const express = require("express");
const HabitLog = require("../models/HabitLog");
const authMiddleware = require("../middleware/authMiddleware");
const { calculateStatus } = require("../utils/habitRules");

const router = express.Router();

/**
 * Add Habit Log
 */
router.post("/log", authMiddleware, async (req, res) => {
  try {
    const { habitName, duration, timeSlot, trigger, mood } = req.body;

    if (!habitName || !duration || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const status = calculateStatus(habitName, duration);

    const habitLog = new HabitLog({
      userId: req.userId,
      habitName,
      duration,
      timeSlot,
      status,
      trigger,
      mood
    });

    await habitLog.save();

    res.status(201).json({
      message: "Habit logged successfully",
      status
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
