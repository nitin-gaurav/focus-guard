const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: "General"
  },
  targetMinutesPerWeek: {
    type: Number,
    default: 120
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  icon: {
    type: String,
    default: "FiTarget"
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Habit", habitSchema);
