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
  origin: function (origin, callback) {
    // Allow local development plus Netlify/Vercel preview deployments.
    if (!origin || origin.includes("localhost") || origin.includes("netlify.app") || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

/* =======================
   DATABASE CONNECTION
======================= */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Ensure DB is connected for every API request.
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

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
   HEALTH CHECK
======================= */

app.get("/", (req, res) => {
  res.send("FocusGuard API is running 🚀");
});

/* =======================
   EXPORT FOR VERCEL
======================= */

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
