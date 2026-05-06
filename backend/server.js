require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS not allowed for this origin"));
  },
  credentials: true
}));
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/ai", require("./routes/ai"));

const port = Number(process.env.PORT) || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`Server on :${port}`)))
  .catch(console.error);
