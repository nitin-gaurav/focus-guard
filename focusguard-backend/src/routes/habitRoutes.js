const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

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

/**
 * Update an existing habit
 */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const { title, category, targetMinutesPerWeek, color, icon } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: "Habit title is required" });
      }
      updates.title = String(title).trim();
    }
    if (category !== undefined) updates.category = category;
    if (targetMinutesPerWeek !== undefined) updates.targetMinutesPerWeek = Number(targetMinutesPerWeek);
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(updatedHabit);
  } catch (err) {
    console.error("Failed to update habit", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete a habit
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const deletedHabit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("Failed to delete habit", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
