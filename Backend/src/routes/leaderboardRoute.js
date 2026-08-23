const express = require("express");

const router = express.Router();

const {
  getLeaderboard,
  calculateRank,
  getLeaderboardPagination,
  searchLeaderboard,
  getMyRank,
} = require("../controllers/leaderboardController");

const {authMiddleware} = require("../middleware/authMiddleware")

router.get("/", getLeaderboard);

router.get("/rank/:userId", calculateRank);

router.get("/pagination", getLeaderboardPagination);

router.get("/search", searchLeaderboard);

router.get("/my-rank", authMiddleware, getMyRank);

module.exports = router;