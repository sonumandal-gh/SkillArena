const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getCorrectWrongStats,
  getDifficultyStats,
  getCategoryStats,
  getXPProgress,
  getUserProgress,
} = require("../controllers/statisticsController");


router.get(
  "/dashboard",
  authMiddleware,
  getDashboardStats
);


router.get(
  "/correct-wrong",
  authMiddleware,
  getCorrectWrongStats
);


router.get(
  "/difficulty",
  authMiddleware,
  getDifficultyStats
);


router.get(
  "/category",
  authMiddleware,
  getCategoryStats
);


router.get(
  "/xp-progress",
  authMiddleware,
  getXPProgress
);


router.get(
  "/progress",
  authMiddleware,
  getUserProgress
);


module.exports = router;