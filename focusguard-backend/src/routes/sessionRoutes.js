const express = require("express");
const router = express.Router();
const FocusSession = require("../models/FocusSession");
const authMiddleware = require("../middleware/authMiddleware");

// Save focus session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { duration } = req.body;

    const session = await FocusSession.create({
      userId: req.userId,
      duration,
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Session save failed" });
  }
});

module.exports = router;
