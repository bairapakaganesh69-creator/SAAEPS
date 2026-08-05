const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

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
// Generate 4-digit OTP
const otp = Math.floor(1000 + Math.random() * 9000);

// OTP expires in 10 minutes
const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
// Save OTP
user.verificationOTP = otp;
user.otpExpires = otpExpiry;

await user.save();
console.log("Generated OTP:", otp);
await sendEmail(
    email,
    "SAAEPS Email Verification",
    `Hello ${fullName},

Welcome to SAAEPS!

Your Email Verification OTP is:

${otp}

This OTP is valid for 10 minutes.

Please do not share this OTP with anyone.

Thank you,
SAAEPS Team`
);
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
       // Check if email is verified
if (!user.isVerified) {
    return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in."
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
const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // Find user
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check OTP
        if (user.verificationOTP != otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check Expiry
        if (new Date() > user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        // Verify User
        user.isVerified = true;
        user.verificationOTP = null;
        user.otpExpires = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const resendOTP = async (req, res) => {
    try {

        const { email } = req.body;

        // Find user
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

        // Already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified."
            });
        }

        // Generate new 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Expiry = 10 minutes
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP
        user.verificationOTP = otp;
        user.otpExpires = otpExpiry;

        await user.save();

        console.log("New OTP:", otp);

        // Send Email
        await sendEmail(
            email,
            "SAAEPS Resend OTP",
            `Hello ${user.fullName},

Your new OTP is:

${otp}

It is valid for 10 minutes.

Thank you,
SAAEPS Team`
        );

        res.status(200).json({
            success: true,
            message: "New OTP sent successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    verifyOTP,
    resendOTP,
    adminDashboard,
};