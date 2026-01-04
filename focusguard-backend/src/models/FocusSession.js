const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FocusSession", focusSessionSchema);
