const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mongoConnect = require("./src/database/db");

require("dotenv").config();

const app = express();


// Server Start
const PORT = process.env.PORT || 5000;

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}).catch(err => {
  console.error("Database connection failed", err);
});