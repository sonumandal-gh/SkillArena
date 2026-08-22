const Submission = require("../models/submissionModel");
const Challenge = require("../models/challengeModel");
const User = require("../models/authModel");

// Submit Answer
exports.submitAnswer = async (req, res) => {
    try {
        const { challengeId, answer } = req.body;

        // 1. Check required fields
        if (!challengeId || !answer) {
            return res.status(400).json({
                message: "challengeId and answer are required",
            });
        }

        // 2. Find challenge
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

        // 3. Check answer
        const isCorrect =
            answer.trim().toLowerCase() ===
            challenge.correctAnswer.trim().toLowerCase();

        let xpEarned = 0;

        if (isCorrect) {
            // Check if user has already solved this challenge correctly
            const alreadySolved = await Submission.findOne({
                user: req.user.userId,
                challenge: challengeId,
                isCorrect: true,
            });

            if (!alreadySolved) {
                xpEarned = challenge.points || 10;
            }
        }

        // 4. Create submission
        const submission = await Submission.create({
            user: req.user.userId,
            challenge: challengeId,
            answer: answer,
            isCorrect: isCorrect,
            xpEarned: xpEarned,
        });

        // 5. Update user stats
        if (xpEarned > 0) {
            user.xp += xpEarned;
            user.problemsSolved += 1;
        }

        // Calculate accuracy
        const totalSubmissions = await Submission.countDocuments({ user: req.user.userId });
        const correctSubmissions = await Submission.countDocuments({ user: req.user.userId, isCorrect: true });

        if (totalSubmissions > 0) {
            user.accuracy = Math.round((correctSubmissions / totalSubmissions) * 100);
        } else {
            user.accuracy = 0;
        }

        await user.save();

        return res.status(201).json({
            message: "Answer submitted successfully",
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