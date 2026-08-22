const express = require("express");

const router = express.Router();

const {
  submitAnswer,
} = require("../controllers/submissionController");

const {authMiddleware} = require("../middleware/authMiddleware");

router.post(
  "/submit",
  authMiddleware,
  submitAnswer
);

module.exports = router;