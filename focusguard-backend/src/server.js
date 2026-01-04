const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");




dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE (FIRST)
======================= */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

/* =======================
   ROUTES (ONCE)
======================= */
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
app.use("/api/sessions", sessionRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/analytics", analyticsRoutes);

/* =======================
   DATABASE + SERVER
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
