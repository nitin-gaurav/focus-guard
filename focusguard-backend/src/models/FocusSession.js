const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ["pomodoro", "deep", "custom"],
      default: "deep",
    },
    distractions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

focusSessionSchema.index({ userId: 1, startTime: 1 });

module.exports = mongoose.model("FocusSession", focusSessionSchema);
