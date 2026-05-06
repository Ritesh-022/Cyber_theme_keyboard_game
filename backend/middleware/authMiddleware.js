const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Server auth misconfigured" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = auth;
