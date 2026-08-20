const User = require("../models/authModel");

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