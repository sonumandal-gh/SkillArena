const express = require("express");
require("dotenv").config();

const mongoConnect = require("./src/config/db");

const app = express();

// Middleware
app.use(express.json());

// Routes import
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const challengesRoutes = require("./src/routes/challengeRoutes");
const submissionRouter = require("./src/routes/submissionRoute");

// test Router
app.get("/", (req, res) =>{
  res.send("Server running");
});

// routes connect
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/submissions", submissionRouter);

const PORT = process.env.PORT || 5003;

mongoConnect().then(() =>{
  app.listen(PORT, () =>{
    console.log("Server running on port " + PORT);
  });
}).catch(err =>{
  console.error("Database connection failed", err);
})