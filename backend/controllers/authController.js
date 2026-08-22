const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../services/emailService");

// --------------------------------
// REGISTER USER
// --------------------------------

const registerUser = async (req, res) => {
    try {
        // Validate input
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
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        // Generate 4-digit OTP
        const otp = Math.floor(
            1000 + Math.random() * 9000
        );

        // OTP expires in 10 minutes
        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Save OTP
        user.verificationOTP = otp;
        user.otpExpires = otpExpiry;

        await user.save();

        // Send verification email
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

        return res.status(201).json({
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
        console.error("Register User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// LOGIN USER
// --------------------------------

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check email verification
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message:
                    "Please verify your email before logging in.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        // Generate JWT
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

        return res.status(200).json({
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
        console.error("Login User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// GET PROFILE
// --------------------------------

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(
            req.user.id,
            {
                attributes: {
                    exclude: ["password"],
                },
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile Retrieved Successfully",
            user,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// ADMIN DASHBOARD
// --------------------------------

const adminDashboard = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome Admin 👑",
    });
};

// --------------------------------
// UPDATE PROFILE
// --------------------------------

const updateProfile = async (req, res) => {
    try {
        const { fullName } = req.body;

        if (!fullName || !fullName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full Name is required",
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.fullName = fullName.trim();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error(
            "Update Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// CHANGE PASSWORD
// --------------------------------

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters",
            });
        }

        const user = await User.findByPk(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password Changed Successfully",
        });
    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// VERIFY EMAIL OTP
// --------------------------------

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP
        if (String(user.verificationOTP) !== String(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check expiry
        if (
            !user.otpExpires ||
            new Date() > new Date(user.otpExpires)
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired",
            });
        }

        // Verify user
        user.isVerified = true;
        user.verificationOTP = null;
        user.otpExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// RESEND OTP
// --------------------------------

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check verification status
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified.",
            });
        }

        // Generate new OTP
        const otp = Math.floor(
            1000 + Math.random() * 9000
        );

        // OTP expires in 10 minutes
        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Save OTP
        user.verificationOTP = otp;
        user.otpExpires = otpExpiry;

        await user.save();

        // Send email
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

        return res.status(200).json({
            success: true,
            message: "New OTP sent successfully.",
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// FORGOT PASSWORD
// --------------------------------

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate reset OTP
        const otp = Math.floor(
            1000 + Math.random() * 9000
        );

        // OTP expires in 10 minutes
        const otpExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Save reset OTP
        user.resetOTP = otp;
        user.resetOTPExpires = otpExpiry;
        user.resetOTPVerified = false;

        await user.save();

        // Send reset email
        await sendEmail(
            email,
            "SAAEPS Password Reset OTP",
            `Hello ${user.fullName},

Your Password Reset OTP is:

${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
SAAEPS Team`
        );

        return res.status(200).json({
            success: true,
            message:
                "Password Reset OTP Sent Successfully",
        });
    } catch (error) {
        console.error(
            "Forgot Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// VERIFY RESET OTP
// --------------------------------

const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP
        if (
            String(user.resetOTP) !==
            String(otp)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check expiry
        if (
            !user.resetOTPExpires ||
            new Date() >
                new Date(user.resetOTPExpires)
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired",
            });
        }

        // Mark reset OTP as verified
        user.resetOTPVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Reset OTP Verified Successfully",
        });
    } catch (error) {
        console.error(
            "Verify Reset OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// --------------------------------
// RESET PASSWORD
// --------------------------------

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and new password are required",
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // OTP must be verified first
        if (!user.resetOTPVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first",
            });
        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        // Update password
        user.password = hashedPassword;

        // Clear reset OTP data
        user.resetOTP = null;
        user.resetOTPExpires = null;
        user.resetOTPVerified = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.error(
            "Reset Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    adminDashboard,
    updateProfile,
    changePassword,
};