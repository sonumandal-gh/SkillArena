const Submission = require("../models/submissionModel");
const Challenge = require("../models/challengeModel");
const User = require("../models/authModel");
const executeCode = require("../../services/codeExecutionService");

// 1. Submit Answer / Code

exports.submitAnswer = async (req, res) => {
  try {
    const { challengeId, answer, code, language } = req.body;

    // Check challengeId
    if (!challengeId) {
      return res.status(400).json({
        message: "challengeId is required",
      });
    }

    // Find challenge
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    // Find user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // MCQ CHALLENGE

    if (challenge.type === "mcq") {
      if (!answer) {
        return res.status(400).json({
          message: "Answer is required",
        });
      }

      // Check answer
      const isCorrect =
        answer.trim().toLowerCase() ===
        challenge.correctAnswer.trim().toLowerCase();

      let xpEarned = 0;

      // Check if already solved
      const alreadySolved = await Submission.findOne({
        user: req.user.userId,
        challenge: challengeId,
        isCorrect: true,
      });

      // Give XP only first time
      if (isCorrect && !alreadySolved) {
        xpEarned = challenge.points || 10;
      }

      // Create submission
      const submission = await Submission.create({
        user: req.user.userId,
        challenge: challengeId,
        type: "mcq",
        answer: answer,
        code: null,
        language: "mcq",
        isCorrect: isCorrect,
        xpEarned: xpEarned,
        status: isCorrect ? "accepted" : "wrong",
      });

      // Update XP and problems solved
      if (isCorrect && !alreadySolved) {
        user.xp += xpEarned;
        user.problemsSolved += 1;
      }

      // Update accuracy
      await updateAccuracy(user);

      return res.status(201).json({
        message: isCorrect
          ? "Correct answer"
          : "Wrong answer",

        submission,
      });
    }

    // CODING CHALLENGE

    if (challenge.type === "coding") {
      if (!code) {
        return res.status(400).json({
          message: "Code is required",
        });
      }


      // Execute code
      const { allPassed, results } = await executeCode({
        code,
        testCases: challenge.testCases,
        functionName: challenge.functionName,
        language: language || "javascript",
      });

      let xpEarned = 0;

      // Check if already solved correctly
      const alreadySolved = await Submission.findOne({
        user: req.user.userId,
        challenge: challengeId,
        isCorrect: true,
      });

      // Give XP only first time
      if (allPassed && !alreadySolved) {
        xpEarned = challenge.points || 10;
      }

      // Create submission
      const submission = await Submission.create({
        user: req.user.userId,
        challenge: challengeId,
        type: "coding",
        answer: code,
        code: code,
        language: language || "javascript",
        isCorrect: allPassed,
        xpEarned: xpEarned,
        status: allPassed ? "accepted" : "wrong",
      });

      // Update XP and problems solved
      if (allPassed && !alreadySolved) {
        user.xp += xpEarned;
        user.problemsSolved += 1;
      }

      // Update accuracy (and save user)
      await updateAccuracy(user);

      return res.status(201).json({
        message: allPassed
          ? "All test cases passed!"
          : "Some test cases failed.",
        submission,
        results,
      });
    }

    // Invalid type
    return res.status(400).json({
      message: "Invalid challenge type",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 2. Get My Submissions

exports.getMySubmission = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.userId,
    })
      .populate(
        "challenge",
        "title category difficulty points type"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Submissions fetched successfully",
      submissions,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 3. Get Submission By ID

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate(
      "challenge",
      "title category difficulty points type"
    );

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    return res.status(200).json({
      message: "Submission fetched successfully",
      submission,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// 4. Update Accuracy

const updateAccuracy = async (user) => {
  const totalSubmissions = await Submission.countDocuments({
    user: user._id,
  });

  const correctSubmissions = await Submission.countDocuments({
    user: user._id,
    isCorrect: true,
  });

  if (totalSubmissions > 0) {
    user.accuracy = Math.round(
      (correctSubmissions / totalSubmissions) * 100
    );
  } else {
    user.accuracy = 0;
  }

  await user.save();
};

// 5. Run Code Only (Dry Run Test Cases)
exports.runCode = async (req, res) => {
  try {
    const { challengeId, code, language } = req.body;

    if (!challengeId || !code) {
      return res.status(400).json({
        message: "challengeId and code are required",
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        message: "Challenge not found",
      });
    }

    const { allPassed, results } = await executeCode({
      code,
      testCases: challenge.testCases,
      functionName: challenge.functionName,
      language: language || "javascript",
    });

    return res.status(200).json({
      message: allPassed
        ? "All test cases passed!"
        : "Some test cases failed.",
      allPassed,
      results,
      isRunOnly: true,
    });
  } catch (error) {
    console.error("Run code error:", error);
    return res.status(500).json({
      message: "Server error during code execution",
      error: error.message,
    });
  }
};