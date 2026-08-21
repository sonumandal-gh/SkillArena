const Challenge = require("../models/challengeModel");

exports.createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      options,
      correctAnswer,
      points,
    } = req.body;

    // Check required fields
    if (
      !title ||
      !description ||
      !category ||
      !difficulty ||
      !options ||
      !correctAnswer ||
      !points
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Create challenge
    const challenge = await Challenge.create({
      title,
      description,
      category,
      difficulty,
      options,
      correctAnswer,
      points,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all challenges + search + filter
exports.getAllChallenges = async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;

    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const challenges = await Challenge.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Challenges fetched successfully",
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Challenge By ID
exports.getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId)
      .populate("createdBy", "name email");

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    return res.status(200).json({
      message: "Challenge fetched successfully",
      challenge,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Challenge
exports.updateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const {
      title,
      description,
      category,
      difficulty,
      options,
      correctAnswer,
      points,
    } = req.body;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (category !== undefined) challenge.category = category;
    if (difficulty !== undefined) challenge.difficulty = difficulty;
    if (options !== undefined) challenge.options = options;
    if (correctAnswer !== undefined) {
      challenge.correctAnswer = correctAnswer;
    }
    if (points !== undefined) challenge.points = points;

    await challenge.save();

    return res.status(200).json({
      message: "Challenge updated successfully",
      challenge,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// 5. Delete Challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findByIdAndDelete(challengeId);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    return res.status(200).json({
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};