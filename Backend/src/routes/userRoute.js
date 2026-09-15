const express = require("express");

const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware")
const { updateProfile,
       changePassword, 
       setPassword,
       getUserById, 
       getAllUsers, 
       deleteUser,
       updateUserRole
    } = require("../controllers/userController");

router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/set-password", authMiddleware, setPassword);

// Static Admin routes FIRST (to prevent /users being intercepted as /:userId)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// Parameterized Admin routes
router.get("/:userId", authMiddleware, adminMiddleware, getUserById);
router.put("/:userId/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:userId", authMiddleware, adminMiddleware, deleteUser);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;