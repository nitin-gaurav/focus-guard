const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  habitName: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  trigger: String,
  mood: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("HabitLog", habitLogSchema);
