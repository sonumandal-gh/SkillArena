const express = require("express");

const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");

const {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challengeController");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createChallenge
);

// Get All Challenges
// Search + Filter
router.get(
  "/",
  authMiddleware,
  getAllChallenges
);

// Get Challenge By ID
router.get(
  "/:challengeId",
  authMiddleware,
  getChallengeById
);

// Update Challenge
// Admin only
router.put(
  "/:challengeId",
  authMiddleware,
  adminMiddleware,
  updateChallenge
);

// Delete Challenge
// Admin only
router.delete(
  "/:challengeId",
  authMiddleware,
  adminMiddleware,
  deleteChallenge
);

module.exports = router;