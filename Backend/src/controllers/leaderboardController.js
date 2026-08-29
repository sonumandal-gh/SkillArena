const User = require("../models/authModel");

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name xp problemsSolved accuracy"
    )
      .sort({ xp: -1 })
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      problemsSolved: user.problemsSolved,
      accuracy: user.accuracy,
    }));

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Calculate Rank
exports.calculateRank = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId, "xp name");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const higherXPUsers = await User.countDocuments({
      xp: { $gt: user.xp },
    });

    const rank = higherXPUsers + 1;

    return res.status(200).json({
      message: "Rank calculated successfully",
      rank,
      name: user.name,
      xp: user.xp,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

// Pagination
exports.getLeaderboardPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find(
      {},
      "name xp problemsSolved accuracy"
    )
      .sort({ xp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      name: user.name,
      xp: user.xp,
      problemsSolved: user.problemsSolved,
      accuracy: user.accuracy,
    }));

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      leaderboard,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Search / Filter
exports.searchLeaderboard = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find(
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      "name xp problemsSolved accuracy"
    )
      .sort({ xp: -1 })
      .lean();

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      problemsSolved: user.problemsSolved,
      accuracy: user.accuracy,
    }));

    return res.status(200).json({
      message: "Search result fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get My Rank
exports.getMyRank = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId, "name xp");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const higherXPUsers = await User.countDocuments({
      xp: { $gt: user.xp },
    });

    const rank = higherXPUsers + 1;

    return res.status(200).json({
      message: "My rank fetched successfully",
      rank,
      name: user.name,
      xp: user.xp,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};