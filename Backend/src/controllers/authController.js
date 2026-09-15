const User = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) =>{
    try{
       const {name, email, password} = req.body;

    //    Check all fields
    if(!name || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message: "User already exists with this email"
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    }catch(error){
     res.status(500).json({
      message: "Server error",
      error: error.message,
    });
    }
}

// Login User
exports.loginUser = async (req, res) => {
  try{
    const {email, password} = req.body;

    // Check email and password
    if(!password || !email){
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    
    // check User exist
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        message: "User does not exist with this email"
      });
    }

    // Check if user registered via Google OAuth (password is null)
    if (!user.password) {
      return res.status(400).json({
        message: "This account was created using Google OAuth. Please sign in using Google.",
      });
    }

    // compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({
        message: "Invalid credentials. Password does not match."
      });
    }

    // Generate Access Token (15 minutes)
    const accessToken = jwt.sign({
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET, {
      expiresIn: "15m"
    });

    // Generate Refresh Token (7 days)
    const refreshToken = jwt.sign({
      userId: user._id
    },
    process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Save refresh token to user model
    user.refreshToken = refreshToken;
    await user.save();

    // Login Successful
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        problemsSolved: user.problemsSolved,
        accuracy: user.accuracy,
      }
    });

  }catch(error){
     res.status(500).json({
      message: "Server error",
      error: error.message
     })
  }
}

// get current user
exports.getMe = async (req, res) => {
   try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Generate new Access Token
    const accessToken = jwt.sign({
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET, {
      expiresIn: "15m"
    });

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
      error: error.message,
    });
  }
};

// Logout User
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error during logout",
      error: error.message,
    });
  }
}

