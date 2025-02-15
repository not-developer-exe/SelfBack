const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const hisabSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  category: { type: String, required: true },  // 🆕 Category added
  expenses: [expenseSchema], // 🆕 Array of expenses
  totalAmount: { type: Number, default: 0 },  // 🆕 Auto-calculated total
  encrypted: { type: Boolean, default: false },
  content: { type: String, required: true },  // Will store encrypted content if encryption is enabled
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hisab", hisabSchema);