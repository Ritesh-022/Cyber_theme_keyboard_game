const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createUniqueIdWithRetry } = require("../utils/generateId");

const sign = (user) =>
  jwt.sign(
    { id: user._id, uniqueId: user.uniqueId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

function toPublicUser(user) {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

function exactEmailRegex(email) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}$`, "i");
}

async function createUniqueUser({ username, email, password }) {
  const uniqueId = await createUniqueIdWithRetry(async (candidate) => {
    const exists = await User.exists({ uniqueId: candidate });
    return !exists;
  });

  return User.create({
    username: username.trim(),
    email: email.toLowerCase(),
    password,
    uniqueId
  });
}

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    if (username.trim().length < 2 || username.trim().length > 32)
      return res.status(400).json({ error: "Username must be 2-32 characters" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: exactEmailRegex(normalizedEmail) });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUniqueUser({
      username,
      email: normalizedEmail,
      password: hashed
    });

    res.json({ token: sign(user), user: toPublicUser(user) });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const normalizedEmail = String(email).toLowerCase().trim();
    const candidates = await User.find({ email: exactEmailRegex(normalizedEmail) })
      .sort({ createdAt: -1 })
      .limit(5);
    if (!candidates.length) return res.status(404).json({ error: "No account with that email" });

    let user = null;
    for (const candidate of candidates) {
      const match = await bcrypt.compare(password, candidate.password);
      if (match) {
        user = candidate;
        break;
      }
    }

    if (!user) return res.status(401).json({ error: "Wrong password" });

    return res.json({ token: sign(user), user: toPublicUser(user) });
  } catch (err) {
    return res.status(500).json({ error: "Login failed: " + err.message });
  }
});

module.exports = router;
