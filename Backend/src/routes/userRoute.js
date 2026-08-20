const express = require("express");
const Router = express.Router();

const {registerUser, loginUser, getMe} = require("../controllers/userController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");

Router.post("/register", registerUser);
Router.post("/login", loginUser);
Router.get("/me", authMiddleware, getMe);

module.exports = Router;