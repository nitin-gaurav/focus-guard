const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: false, // Optional if they do a generic focus session
    },
    taskName: {
      type: String,
      trim: true,
      default: "Deep Work"
    },
    plannedDuration: {
      type: Number,
      required: true,
    },
    actualDuration: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ["completed", "failed", "interrupted"],
      default: "completed"
    },
    distractions: [{
      category: String,
      timestamp: Date
    }],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    }
  },
  { timestamps: true }
);

focusSessionSchema.index({ userId: 1, startTime: 1 });

module.exports = mongoose.model("FocusSession", focusSessionSchema);
