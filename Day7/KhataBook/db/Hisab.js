const mongoose = require("mongoose");

const hisabSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  content: { type: String, required: true }, // Will store encrypted content if chosen
  encrypted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hisab", hisabSchema);