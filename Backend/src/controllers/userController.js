const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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