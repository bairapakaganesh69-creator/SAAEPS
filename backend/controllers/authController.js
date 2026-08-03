const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {

        // Validate Input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        // Encrypt Password
const hashedPassword = await bcrypt.hash(password, 10);

console.log("Original Password:", password);
console.log("Hashed Password:", hashedPassword);
// Save User into Database
const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
});
        // For now, just return success
    res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    },
});
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({
            where: { email }
        });

        // User not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
       
// Compare Password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
    return res.status(401).json({
        success: false,
        message: "Invalid Password"
    });
}
// Generate JWT Token
const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d",
    }
);
       res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    },
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
 const getProfile = async (req, res) => {

    try {

        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ["password"],
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile Retrieved Successfully",
            user,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};
const adminDashboard = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome Admin 👑",
    });

};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,
};