const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["mcq", "coding"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    // MCQ
    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      default: null,
    },

    // Coding
    starterCode: {
      type: String,
      default: null,
    },

    functionName: {
      type: String,
      default: null,
    },

    testCases: {
      type: [
        {
          input: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
          },

          expectedOutput: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
          },
        },
      ],
      default: [],
    },

    points: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);