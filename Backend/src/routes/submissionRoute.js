const express = require("express");

const router = express.Router();

const {
  submitAnswer,
  getMySubmission,
  getSubmissionById
} = require("../controllers/submissionController");

const {authMiddleware} = require("../middleware/authMiddleware");
const { rateLimiter } = require("../middleware/rateLimitMiddleware");

// Limit code execution/submissions to 5 requests per minute
const submissionLimiter = rateLimiter(5, 60 * 1000);

router.post(
  "/submit",
  authMiddleware,
  submissionLimiter,
  submitAnswer
);

router.get(
  "/my",
  authMiddleware,
  getMySubmission
);

router.get(
  "/:id",
  authMiddleware,
  getSubmissionById
);

module.exports = router;