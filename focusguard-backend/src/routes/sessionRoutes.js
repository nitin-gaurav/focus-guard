const express = require("express");
const router = express.Router();
const FocusSession = require("../models/FocusSession");
const authMiddleware = require("../middleware/authMiddleware");

// Save focus session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { habitId, taskName, plannedDuration, actualDuration, status, distractions } = req.body;

    if (!plannedDuration || actualDuration === undefined) {
      return res.status(400).json({ message: "Missing duration data" });
    }

    const session = await FocusSession.create({
      userId: req.userId,
      habitId: habitId || null,
      taskName,
      plannedDuration,
      actualDuration,
      status,
      distractions: distractions || [],
      startTime: new Date(Date.now() - actualDuration * 60000), // Approximate start time if not provided precisely from frontend
      endTime: new Date(),
    });

    res.json(session);
  } catch (err) {
    console.error("Failed to save session", err);
    res.status(500).json({ message: "Session save failed" });
  }
});

module.exports = router;
