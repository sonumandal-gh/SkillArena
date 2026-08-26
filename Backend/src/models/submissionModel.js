const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true,
        },

        type: {
            type: String,
            enum: ["mcq", "coding"],
            required: true,
        },

        answer: {
            type: String,
            required: true,
        },

        code: {
            type: String,
            default: null,
        },

        isCorrect: {
            type: Boolean,
            required: true,
        },

        xpEarned: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "accepted",
                "wrong",
                "error",
                "pending",
        ],
      required: true,
    },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Submission", submissionSchema);