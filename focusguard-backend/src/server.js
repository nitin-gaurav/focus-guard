const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://focus-guard.netlify.app",
    /\.netlify\.app$/
  ],
  credentials: true
}));
app.use(express.json());

/* =======================
   ROUTES
======================= */

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sessions", sessionRoutes);

/* =======================
   HEALTH CHECK ROUTE
======================= */

app.get("/", (req, res) => {
  res.send("FocusGuard API is running 🚀");
});

/* =======================
   DATABASE + SERVER
======================= */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
