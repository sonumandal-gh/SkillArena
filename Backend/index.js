const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoConnect = require("./src/config/db");

const app = express();

// Middleware
// Dynamic CORS allowing all localhost ports and configured FRONTEND_URL
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

const passport = require("./src/config/passport");

app.use(passport.initialize());

// Routes import
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const challengesRoutes = require("./src/routes/challengeRoutes");
const submissionRoutes = require("./src/routes/submissionRoute");
const leaderboardRoutes = require("./src/routes/leaderboardRoute");
const statisticsRoutes = require("./src/routes/statisticsRoute");

// test Router
app.get("/", (req, res) => {
  res.send("Server running");
});

// routes connect
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/statistics", statisticsRoutes);

const PORT = process.env.PORT || 5003;

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}).catch(err => {
  console.error("Database connection failed", err);
})