const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getCorrectWrongStats,
  getDifficultyStats,
  getCategoryStats,
  getXPProgress,
  getUserProgress,
  getAdminStats,
  getPublicStats,
} = require("../controllers/statisticsController");

// Public platform stats (no auth)
router.get("/public", getPublicStats);

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);


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