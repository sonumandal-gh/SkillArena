const express = require("express");

const router = express.Router();

const {
  submitAnswer,
  getMySubmission,
  getSubmissionById
} = require("../controllers/submissionController");

const {authMiddleware} = require("../middleware/authMiddleware");

router.post(
  "/submit",
  authMiddleware,
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