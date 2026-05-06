const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  mpm: Number,
  accuracy: Number,
  date: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 2, maxlength: 32 },
  uniqueId: { type: String, unique: true, required: true, uppercase: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  friends: { type: [String], default: [] },
  friendRequests: { type: [String], default: [] },
  stats: {
    bestMPM: { type: Number, default: 0 },
    avgAccuracy: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 }
  },
  history: { type: [MatchSchema], default: [] }
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
