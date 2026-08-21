const express = require("express");

const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware")
const { updateProfile,
       changePassword, 
       getUserById, 
       getAllUsers, 
       deleteUser,
       updateUserRole
    } = require("../controllers/userController");

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

router.get("/:userId",authMiddleware, adminMiddleware, getUserById);

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

router.put("/:userId/role", authMiddleware, adminMiddleware, updateProfile);

router.delete(
  "/users/:userId",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

module.exports = router;