const express = require("express");
const router = express.Router();
const FocusSession = require("../models/FocusSession");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/analytics
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.userId });

    // A session is "logged" only when it has been explicitly ended via
    // PATCH /reflection (completed=true) or PATCH /stop (ended_at set).
    // We intentionally exclude in-progress sessions (no ended_at, not completed).
    const loggedSessions = sessions.filter(
      (s) => s.completed === true || s.status === "completed"
    );

    const totalSessions = loggedSessions.length;
    const successCount  = loggedSessions.filter((s) => s.completed === true).length;
    const successRate   = totalSessions === 0
      ? 0
      : Math.round((successCount / totalSessions) * 100);

    // Weekly aggregation — all 7 days of the current week (Sun–Sat)
    const weekMap = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    loggedSessions.forEach((s) => {
      const sessionStart    = s.started_at || s.startTime;
      const sessionDuration = s.actual_duration_mins ?? s.actualDuration ?? 0;
      if (!sessionStart) return;
      const d = new Date(sessionStart);
      // Only count sessions from the current week
      if (d < weekStart) return;
      const day = days[d.getDay()];
      weekMap[day] = (weekMap[day] || 0) + sessionDuration / 60; // → hours
    });

    const weekly = days.map((day) => ({
      day,
      hours: Number((weekMap[day] || 0).toFixed(2)),
    }));

    const totalFocusHours = Number(
      (loggedSessions.reduce(
        (acc, s) => acc + (s.actual_duration_mins ?? s.actualDuration ?? 0),
        0
      ) / 60).toFixed(1)
    );

    res.json({
      stats: {
        successRate,
        sessions: totalSessions,
        focusTime: totalFocusHours,
      },
      weekly,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics failed" });
  }
});

// GET /api/analytics/habits — per-habit focus minutes for the current calendar week
router.get("/habits", authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    // Only fetch completed sessions from the current week
    const sessions = await FocusSession.find({
      userId: req.userId,
      completed: true,
      $or: [
        { started_at: { $gte: weekStart } },
        { startTime:  { $gte: weekStart } },
      ],
    });

    const habitMins = {};
    sessions.forEach((s) => {
      const hid  = String(s.habit_id || s.habitId || "none");
      const mins = s.actual_duration_mins ?? s.actualDuration ?? 0;
      habitMins[hid] = (habitMins[hid] || 0) + mins;
    });

    res.json(habitMins); // { "<habitId>": totalMinutes, ... }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Habit analytics failed" });
  }
});

module.exports = router;
