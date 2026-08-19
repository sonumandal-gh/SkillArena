const express = require("express");
require("dotenv").config();

const mongoConnect = require("./src/config/db");

const app = express();

const PORT = 5003 || process.env.PORT;

mongoConnect().then(() =>{
  app.listen(PORT, () =>{
    console.log("Server running on port" + PORT);
  });
}).catch(err =>{
  console.error("Database connection failed", err);
})