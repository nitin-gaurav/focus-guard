const express = require("express");
const router = express.Router();
const HabitLog = require("../models/HabitLog");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/analytics
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await HabitLog.find({ userId: req.userId });

    const sessions = habits.length;
    const successCount = habits.filter(
      (h) => h.status === "Success"
    ).length;

    const successRate =
      sessions === 0 ? 0 : Math.round((successCount / sessions) * 100);

    // Weekly aggregation (last 7 days)
    const weekMap = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    habits.forEach((h) => {
      const d = new Date(h.createdAt);
      const day = days[d.getDay()];
      weekMap[day] = (weekMap[day] || 0) + h.duration / 60;
    });

    const weekly = days.map((day) => ({
      day,
      hours: Number((weekMap[day] || 0).toFixed(1)),
    }));

    res.json({
      stats: {
        successRate,
        sessions,
        focusTime: Number(
          (habits.reduce((a, b) => a + b.duration, 0) / 60).toFixed(1)
        ),
      },
      weekly,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics failed" });
  }
});

module.exports = router;
