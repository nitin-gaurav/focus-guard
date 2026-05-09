const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      default: null,
    },
    session_goal: {
      type: String,
      trim: true,
      default: "Deep Work",
    },
    planned_duration_mins: {
      type: Number,
      required: true,
      min: 1,
    },
    actual_duration_mins: {
      type: Number,
      default: 0,
      min: 0,
    },
    time_of_day: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
      required: true,
    },
    hour_of_day: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
    day_of_week: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    focus_score: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    reflection_note: {
      type: String,
      trim: true,
      default: null,
    },
    streak_at_time: {
      type: Number,
      default: 0,
      min: 0,
    },
    sessions_today: {
      type: Number,
      default: 0,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    started_at: {
      type: Date,
      required: true,
    },
    ended_at: {
      type: Date,
      default: null,
    },

    // Backward-compatible field names used by existing analytics/UI code.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      default: null,
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
      default: "interrupted"  // safe default — only PATCH /reflection sets "completed"
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
      default: null,
    }
  },
  { timestamps: true }
);

focusSessionSchema.index({ userId: 1, startTime: 1 });
focusSessionSchema.index({ user_id: 1, started_at: 1 });

module.exports = mongoose.model("FocusSession", focusSessionSchema);
