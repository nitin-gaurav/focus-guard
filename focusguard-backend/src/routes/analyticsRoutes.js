const express = require("express");
const router = express.Router();
const FocusSession = require("../models/FocusSession");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/analytics
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.userId });

    const totalSessions = sessions.length;
    const successCount = sessions.filter(
      (s) => s.status === "completed"
    ).length;

    const successRate =
      totalSessions === 0 ? 0 : Math.round((successCount / totalSessions) * 100);

    // Weekly aggregation (last 7 days)
    const weekMap = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    sessions.forEach((s) => {
      if (s.startTime) {
        const d = new Date(s.startTime);
        const day = days[d.getDay()];
        weekMap[day] = (weekMap[day] || 0) + s.actualDuration / 60; // hours
      }
    });

    const weekly = days.map((day) => ({
      day,
      hours: Number((weekMap[day] || 0).toFixed(1)),
    }));

    res.json({
      stats: {
        successRate,
        sessions: totalSessions,
        focusTime: Number(
          (sessions.reduce((a, b) => a + (b.actualDuration || 0), 0) / 60).toFixed(1)
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
