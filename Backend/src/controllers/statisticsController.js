const User = require("../models/authModel");
const Submission = require("../models/submissionModel");
const Challenge = require("../models/challengeModel");

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(
      userId,
      "name xp problemsSolved accuracy"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Total submissions
    const totalSubmissions = await Submission.countDocuments({
      user: userId,
    });

    // Correct submissions
    const correctSubmissions = await Submission.countDocuments({
      user: userId,
      isCorrect: true,
    });

    // Wrong submissions
    const wrongSubmissions =
      totalSubmissions - correctSubmissions;

    return res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      statistics: {
        name: user.name,
        xp: user.xp,
        problemsSolved: user.problemsSolved,
        accuracy: user.accuracy,
        totalSubmissions,
        correctSubmissions,
        wrongSubmissions,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Correct + Wrong Statistics
exports.getCorrectWrongStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalSubmissions = await Submission.countDocuments({
      user: userId,
    });

    const correctSubmissions = await Submission.countDocuments({
      user: userId,
      isCorrect: true,
    });

    const wrongSubmissions = await Submission.countDocuments({
      user: userId,
      isCorrect: false,
    });

    return res.status(200).json({
      message: "Correct / Wrong statistics fetched successfully",

      statistics: {
        totalSubmissions,
        correctSubmissions,
        wrongSubmissions,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// XP Progress
exports.getXPProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(
      userId,
      "name xp"
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "XP progress fetched successfully",
      progress: {
        name: user.name,
        currentXP: user.xp,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// User Progress API
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(
      userId,
      "name xp problemsSolved accuracy"
    ).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalSubmissions = await Submission.countDocuments({
      user: userId,
    });

    const correctSubmissions = await Submission.countDocuments({
      user: userId,
      isCorrect: true,
    });

    const wrongSubmissions = await Submission.countDocuments({
      user: userId,
      isCorrect: false,
    });

    return res.status(200).json({
      message: "User progress fetched successfully",

      progress: {
        name: user.name,

        xp: user.xp,

        problemsSolved: user.problemsSolved,

        accuracy: user.accuracy,

        submissions: {
          total: totalSubmissions,
          correct: correctSubmissions,
          wrong: wrongSubmissions,
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Difficulty Statistics
exports.getDifficultyStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mongoose = require("mongoose");

    const stats = await Submission.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "challenges",
          localField: "challenge",
          foreignField: "_id",
          as: "challengeInfo",
        },
      },
      { $unwind: "$challengeInfo" },
      {
        $group: {
          _id: "$challengeInfo.difficulty",
          total: { $sum: 1 },
          correct: { $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] } },
          wrong: { $sum: { $cond: [{ $eq: ["$isCorrect", false] }, 1, 0] } },
        },
      },
    ]);

    // Format the response
    const formattedStats = {
      easy: { total: 0, correct: 0, wrong: 0 },
      medium: { total: 0, correct: 0, wrong: 0 },
      hard: { total: 0, correct: 0, wrong: 0 },
    };

    stats.forEach((item) => {
      if (item._id && formattedStats[item._id.toLowerCase()]) {
        formattedStats[item._id.toLowerCase()] = {
          total: item.total,
          correct: item.correct,
          wrong: item.wrong,
        };
      }
    });

    return res.status(200).json({
      message: "Difficulty statistics fetched successfully",
      statistics: formattedStats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Category Statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const mongoose = require("mongoose");

    const stats = await Submission.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "challenges",
          localField: "challenge",
          foreignField: "_id",
          as: "challengeInfo",
        },
      },
      { $unwind: "$challengeInfo" },
      {
        $group: {
          _id: "$challengeInfo.category",
          total: { $sum: 1 },
          correct: { $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] } },
          wrong: { $sum: { $cond: [{ $eq: ["$isCorrect", false] }, 1, 0] } },
        },
      },
    ]);

    // Format the response
    const formattedStats = {};
    stats.forEach((item) => {
      if (item._id) {
        formattedStats[item._id] = {
          total: item.total,
          correct: item.correct,
          wrong: item.wrong,
        };
      }
    });

    return res.status(200).json({
      message: "Category statistics fetched successfully",
      statistics: formattedStats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};