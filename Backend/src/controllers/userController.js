const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) =>{
    try{
       const {name, email, password} = req.body;

    //    Check all fields
    if(!name || !email || !password){
        return res.status(400).json({
            message: "All fields are require"
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message: "User alredy exists"
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
        message: "All Files are require",
      });
    }
    
    // check User exist
    const userExist = await User.findOne({email});

    if(!userExist){
      return res.status(400).json({
        message: "User not exist"
      });
    }

    // compare Password
    const isMatch = await bcrypt.compare(password, userExist.password);

    if(!isMatch){
      return res.status(400).json({
        message: "Password Not Matched"
      });
    }

    // Generate JWT Token
    const token = jwt.sign({
      userId: userExist._id,
      role: userExist.role
    },
    process.env.JWT_SECRET,{
      expiresIn: "1d"
    }
    );

    // Login Successful
    return res.status(200).json({
      message: "User Created Successfully",
      token,
      userExist:{
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        xp: userExist.xp,
        problemsSolved: userExist.problemsSolved,
        accuracy: userExist.accuracy,
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
}