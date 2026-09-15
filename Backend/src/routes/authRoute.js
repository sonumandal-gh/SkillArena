const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { rateLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Rate limiter for authentication routes (100 requests per 15 minutes)
const authLimiter = rateLimiter(100, 15 * 60 * 1000);

// Google Login 
router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

// Google Callback
router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`
    }),
    async (req, res) => {
        try {
            // Generate Access Token (15 minutes)
            const accessToken = jwt.sign({
                userId: req.user._id,
                role: req.user.role
            },
                process.env.JWT_SECRET, {
                expiresIn: "15m"
            });

            // Generate Refresh Token (7 days)
            const refreshToken = jwt.sign({
                userId: req.user._id
            },
                process.env.JWT_SECRET, {
                expiresIn: "7d"
            });

            // Save refresh token to user
            req.user.refreshToken = refreshToken;
            await req.user.save();

            // Redirect to frontend with tokens
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            return res.redirect(`${frontendUrl}/oauth-success?token=${accessToken}&refreshToken=${refreshToken}`);
        } catch (error) {
            return res.status(500).json({
                message: "OAuth Callback Error",
                error: error.message
            });
        }
    }
);

const { registerUser, loginUser, getMe, refreshToken, logoutUser } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, getMe);

module.exports = router;