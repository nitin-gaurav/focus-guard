const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Get all habits for the logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error("Failed to fetch habits", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Create a new habit
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, category, targetMinutesPerWeek, color, icon } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Habit title is required" });
    }

    const habit = new Habit({
      userId: req.userId,
      title,
      category,
      targetMinutesPerWeek,
      color,
      icon
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    console.error("Failed to create habit", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
