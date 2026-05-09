const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const FocusSession = require("../models/FocusSession");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const getTimeOfDay = (hour) => {
  if (hour >= 5 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 16) return "afternoon";
  if (hour >= 17 && hour <= 20) return "evening";
  return "night";
};

const getTodayStart = (date = new Date()) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  return today;
};

const normalizeDuration = (value, fallback = 0) => {
  const duration = Number(value);
  return Number.isFinite(duration) && duration >= 0 ? duration : fallback;
};

// Create a focus session when the Pomodoro starts. Also accepts the legacy
// completed-session payload so older clients keep working.
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      habit_id,
      habitId,
      session_goal,
      taskName,
      planned_duration_mins,
      plannedDuration,
      actual_duration_mins,
      actualDuration,
      completed,
      status,
      distractions,
      started_at,
      startTime,
      ended_at,
      endTime,
    } = req.body;

    const plannedMins = normalizeDuration(planned_duration_mins ?? plannedDuration);

    if (!plannedMins) {
      return res.status(400).json({ message: "Planned duration is required" });
    }

    const requestedHabitId = habit_id || habitId || null;
    const validHabitId = requestedHabitId && mongoose.Types.ObjectId.isValid(requestedHabitId)
      ? requestedHabitId
      : null;
    const linkedHabit = validHabitId
      ? await Habit.findOne({ _id: validHabitId, userId: req.userId })
      : null;
    const safeHabitId = linkedHabit ? linkedHabit._id : null;
    const allHabits = safeHabitId ? [] : await Habit.find({ userId: req.userId }).select("currentStreak");
    const rawStartedAt = started_at || startTime;
    const isCompleted = completed === true || status === "completed";
    const actualMins = normalizeDuration(actual_duration_mins ?? actualDuration, isCompleted ? plannedMins : 0);
    const endedAt = isCompleted ? new Date(ended_at || endTime || Date.now()) : null;
    const startedAt = rawStartedAt
      ? new Date(rawStartedAt)
      : new Date((endedAt || new Date()).getTime() - actualMins * 60000);
    const hourOfDay = startedAt.getHours();
    const todayStart = getTodayStart(startedAt);
    const sessionsToday = await FocusSession.countDocuments({
      userId: req.userId,
      startTime: { $gte: todayStart, $lt: startedAt },
    });
    const streakAtTime = linkedHabit
      ? linkedHabit.currentStreak || 0
      : allHabits.reduce((max, habit) => Math.max(max, habit.currentStreak || 0), 0);
    const sessionGoal = (session_goal || taskName || "Deep Work").trim() || "Deep Work";

    const session = await FocusSession.create({
      user_id: req.userId,
      habit_id: safeHabitId,
      session_goal: sessionGoal,
      planned_duration_mins: plannedMins,
      actual_duration_mins: actualMins,
      time_of_day: getTimeOfDay(hourOfDay),
      hour_of_day: hourOfDay,
      day_of_week: startedAt.getDay(),
      focus_score: null,
      reflection_note: null,
      streak_at_time: streakAtTime,
      sessions_today: sessionsToday,
      completed: isCompleted,
      started_at: startedAt,
      ended_at: endedAt,

      userId: req.userId,
      habitId: safeHabitId,
      taskName: sessionGoal,
      plannedDuration: plannedMins,
      actualDuration: actualMins,
      status: isCompleted ? "completed" : "interrupted",
      distractions: distractions || [],
      startTime: startedAt,
      endTime: endedAt,
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("Failed to save session", err);
    res.status(500).json({ message: "Session save failed" });
  }
});

router.patch("/:id/reflection", authMiddleware, async (req, res) => {
  try {
    const { focus_score, reflection_note, actual_duration_mins } = req.body;
    const focusScore = Number(focus_score);

    if (!Number.isInteger(focusScore) || focusScore < 1 || focusScore > 5) {
      return res.status(400).json({ message: "Focus score must be a number from 1 to 5" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Session not found" });
    }

    const session = await FocusSession.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const endedAt = new Date();
    const startedAt = session.started_at || session.startTime || endedAt;
    const actualMins = normalizeDuration(
      actual_duration_mins,
      Math.max(1, Math.round((endedAt.getTime() - new Date(startedAt).getTime()) / 60000))
    );

    session.focus_score = focusScore;
    session.reflection_note = reflection_note ? String(reflection_note).trim() : null;
    session.actual_duration_mins = actualMins;
    session.completed = true;
    session.ended_at = endedAt;

    session.actualDuration = actualMins;
    session.status = "completed";
    session.endTime = endedAt;

    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Failed to save reflection", err);
    res.status(500).json({ message: "Reflection save failed" });
  }
});

router.patch("/:id/stop", authMiddleware, async (req, res) => {
  try {
    const { actual_duration_mins } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Session not found" });
    }

    const session = await FocusSession.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const endedAt = new Date();
    const startedAt = session.started_at || session.startTime || endedAt;
    const actualMins = normalizeDuration(
      actual_duration_mins,
      Math.max(0, Math.round((endedAt.getTime() - new Date(startedAt).getTime()) / 60000))
    );

    session.actual_duration_mins = actualMins;
    session.completed = false;
    session.ended_at = endedAt;

    session.actualDuration = actualMins;
    session.status = "interrupted";
    session.endTime = endedAt;

    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Failed to stop session", err);
    res.status(500).json({ message: "Session stop failed" });
  }
});

module.exports = router;
