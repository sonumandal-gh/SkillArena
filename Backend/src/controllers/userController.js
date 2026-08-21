const User = require("../models/authModel");
const bcrypt = require("bcrypt");

// UpdateProfile

exports.updateProfile = async (req, res) =>{
    try{
      const {name, email} = req.body;

      const user = await User.findById(req.user.userId);

      if(!user){
        return res.sstatus(404).json({
            message: "User not found",
        });
      }

       if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        problemsSolved: user.problemsSolved,
        accuracy: user.accuracy,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Change Password
exports.changePassword = async (req, res) =>{
  try{
     const { currentPassword, newPassword} = req.body;

    //  Check Fields
    if(!currentPassword || !newPassword){
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Logged-in user find
    const user = await User.findById(req.user.userId);

    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current password verify 
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isPasswordMatch){
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // New password hash
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password in Database
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get User By id
exports.getUserById = async (req, res) => {
  try{
    const {userId} = req.body;

    const user = await User.findById(userId).select(-password);

    if(!user){
      return res.status(404).json({
        message: "User Not Found"
      });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Users + Search Users
exports.getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    // search by name or email
    if(search){
      query = {
        $or: [
          {name: {$regex: search, $options: "i"}},
          {email: {$regex: search, $options: "i"}}
        ]
      };
    }
    
    const users = await User.find().select("-password");

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Admin cannot delete himself
    if (req.user.userId.toString() === userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Change User Role
exports.updateUserRole = async (req, res) =>{
  try{
    const {role, userId} = req.body;

     // Validate role
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either user or admin",
      });
    }

    // Find User
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update role
    user.role = role;
    await user.save();

    return res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};