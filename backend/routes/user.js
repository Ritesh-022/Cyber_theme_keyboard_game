const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const UNIQUE_ID_RE = /^(CYB|TRD|NEO)-[A-Z0-9]{4}$/;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function publicProfileProjection() {
  return "username uniqueId stats history";
}

router.get("/friends", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select("friends");
    if (!me) return res.status(404).json({ error: "User not found" });

    const friends = await User.find({ uniqueId: { $in: me.friends } })
      .select("username uniqueId stats");
    return res.json(friends);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Friend-only profile by uniqueId
router.get("/profile/:uniqueId", auth, async (req, res) => {
  try {
    const targetId = String(req.params.uniqueId || "").toUpperCase();
    if (!UNIQUE_ID_RE.test(targetId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const me = await User.findById(req.user.id).select("uniqueId friends");
    if (!me) return res.status(404).json({ error: "User not found" });

    if (targetId !== me.uniqueId && !me.friends.includes(targetId)) {
      return res.status(403).json({ error: "Profile is visible to friends only" });
    }

    const user = await User.findOne({ uniqueId: targetId }).select(publicProfileProjection());
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/me", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const normalized = String(username || "").trim();
    if (normalized.length < 2 || normalized.length > 32) {
      return res.status(400).json({ error: "Username must be 2-32 characters" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username: normalized },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const raw = String(req.query.q || "").trim();
    if (!raw) return res.json([]);

    const q = raw.slice(0, 40);
    const safe = escapeRegex(q);
    const users = await User.find({
      $or: [
        { username: { $regex: safe, $options: "i" } },
        { uniqueId: { $regex: safe, $options: "i" } }
      ]
    }).select("username uniqueId stats").limit(10);

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/friend-request", auth, async (req, res) => {
  try {
    const targetId = String(req.body.targetId || "").trim().toUpperCase();
    if (!UNIQUE_ID_RE.test(targetId)) {
      return res.status(400).json({ error: "Invalid target user ID" });
    }

    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ error: "User not found" });
    if (me.uniqueId === targetId) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }
    if (me.friends.includes(targetId)) {
      return res.status(400).json({ error: "Already friends" });
    }

    const target = await User.findOne({ uniqueId: targetId });
    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }
    if (target.friendRequests.includes(me.uniqueId)) {
      return res.status(400).json({ error: "Request already sent" });
    }

    await User.updateOne(
      { uniqueId: targetId },
      { $addToSet: { friendRequests: me.uniqueId } }
    );
    return res.json({ message: "Request sent" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/friend-accept", auth, async (req, res) => {
  try {
    const requesterId = String(req.body.requesterId || "").trim().toUpperCase();
    if (!UNIQUE_ID_RE.test(requesterId)) {
      return res.status(400).json({ error: "Invalid requester user ID" });
    }

    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ error: "User not found" });

    if (!me.friendRequests.includes(requesterId)) {
      return res.status(400).json({ error: "No such request" });
    }

    const requester = await User.findOne({ uniqueId: requesterId });
    if (!requester) {
      return res.status(404).json({ error: "Requester not found" });
    }

    await User.updateOne({ _id: me._id }, {
      $addToSet: { friends: requesterId },
      $pull: { friendRequests: requesterId }
    });
    await User.updateOne({ uniqueId: requesterId }, { $addToSet: { friends: me.uniqueId } });

    return res.json({ message: "Friend added" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/stats", auth, async (req, res) => {
  try {
    const mpm = Number(req.body.mpm);
    const accuracy = Number(req.body.accuracy);

    if (!Number.isFinite(mpm) || !Number.isFinite(accuracy)) {
      return res.status(400).json({ error: "mpm and accuracy must be numbers" });
    }

    const normalizedMPM = Math.max(0, Math.min(400, Math.round(mpm)));
    const normalizedAccuracy = Math.max(0, Math.min(100, Math.round(accuracy)));

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newBest = Math.max(user.stats.bestMPM, normalizedMPM);
    const total = user.stats.totalGames + 1;
    const newAvg = Math.round(
      ((user.stats.avgAccuracy * user.stats.totalGames) + normalizedAccuracy) / total
    );

    await User.updateOne({ _id: user._id }, {
      "stats.bestMPM": newBest,
      "stats.avgAccuracy": newAvg,
      "stats.totalGames": total,
      $push: { history: { $each: [{ mpm: normalizedMPM, accuracy: normalizedAccuracy }], $slice: -50 } }
    });

    return res.json({ bestMPM: newBest, avgAccuracy: newAvg, totalGames: total });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("history stats");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
