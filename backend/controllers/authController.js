const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client();

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

        const { fullName, email, password, examType, branch } = req.body;

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
    examType,
    branch: examType === "ECET" ? branch : null,
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

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        // Prevent login before required password setup is complete.
        if (user.passwordSetupRequired) {
            return res.status(403).json({
                success: false,
                message: "Please complete your password setup first.",
            });
        }

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



const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                success: false,
                message: "Google authentication is not configured",
            });
        }

        // Verify the Google ID token.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or unverified Google account",
            });
        }

        const googleId = payload.sub;
        const email = payload.email.trim().toLowerCase();
        const fullName = payload.name || email.split("@")[0];

        // Check whether this Google account already exists.
        let user = await User.findOne({
            where: { googleId },
        });

        if (user) {
            if (user.email !== email) {
                return res.status(403).json({
                    success: false,
                    message: "Google account email does not match",
                });
            }

            if (!user.isVerified) {
                return res.status(200).json({
                    success: true,
                    requiresOTP: true,
                    email: user.email,
                    message: "Please verify your email using OTP",
                });
            }

            if (user.passwordSetupRequired) {
                return res.status(200).json({
                    success: true,
                    requiresPasswordSetup: true,
                    email: user.email,
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                success: true,
                message: "Google sign-in successful",
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        // Do not automatically link a Google account to an existing
        // email/password account.
        const existingEmailUser = await User.findOne({
            where: { email },
        });

        if (existingEmailUser) {
            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists. Please use your existing login method.",
            });
        }

        // Create the Google account before exam selection.
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const otp = crypto.randomInt(1000, 10000).toString();

        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            googleId,
            authProvider: "google",
            passwordSetupRequired: true,
            examType: null,
            branch: null,
            isVerified: false,
            verificationOTP: otp,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000),
        });

        // Send the verification OTP to the user's email.
        await sendEmail(
            email,
            "SAAEPS Email Verification OTP",
            `Your SAAEPS verification OTP is ${otp}. It expires in 10 minutes.`
        );

        return res.status(201).json({
            success: true,
            requiresOTP: true,
            email: user.email,
            message: "OTP sent. Please verify your email.",
        });
    } catch (error) {
        console.error("Google Auth Error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed. Please try again.",
        });
    }
};




const googleSetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword,
            credential,
            examType,
            branch,
        } = req.body;

        // 1. Validate required fields
        if (
            !email ||
            typeof newPassword !== "string" ||
            !newPassword.trim() ||
            !credential ||
            !examType
        ) {
            return res.status(400).json({
                success: false,
                message: "Email, Google credential, exam type, and password are required.",
            });
        }

        // 2. Validate exam type
        if (!["ECET", "POLYCET"].includes(examType)) {
            return res.status(400).json({
                success: false,
                message: "Please select ECET or POLYCET.",
            });
        }

        // 3. ECET requires a branch
        if (
            examType === "ECET" &&
            !["CSE", "ECE"].includes(branch)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select CSE or ECE for ECET.",
            });
        }

        // 4. Ensure Google OAuth is configured
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                success: false,
                message: "Google authentication is not configured.",
            });
        }

        // 5. Verify the Google credential
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or unverified Google account.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const googleEmail = payload.email.trim().toLowerCase();

        // 6. Ensure the supplied email belongs to this Google account
        if (normalizedEmail !== googleEmail) {
            return res.status(403).json({
                success: false,
                message: "Google account email does not match.",
            });
        }

        // 7. Find the correct Google user
        const user = await User.findOne({
            where: {
                email: normalizedEmail,
                authProvider: "google",
            },
        });

        if (!user || user.googleId !== payload.sub) {
            return res.status(404).json({
                success: false,
                message: "Google account not found. Please register again.",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before setting a password.",
            });
        }

        if (!user.passwordSetupRequired) {
            return res.status(400).json({
                success: false,
                message: "Password setup is already completed. Please log in.",
            });
        }

        // 8. Hash the password (no minimum length restriction)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 9. Save the exam preferences and password
        user.password = hashedPassword;
        user.examType = examType;
        user.branch = examType === "ECET" ? branch : null;
        user.passwordSetupRequired = false;

        await user.save();

        // 10. Generate the login token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 11. Return the successful result
        return res.status(200).json({
            success: true,
            message: "Google registration completed successfully.",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                examType: user.examType,
                branch: user.branch,
            },
        });
    } catch (error) {
        console.error("Google Set Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to complete password setup. Please try again.",
        });
    }
};



// --------------------------------
// GET PROFILE
// --------------------------------


const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profile = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            department: user.department,
            year: user.year,
            phone: user.phone,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return res.status(200).json({
            success: true,
            message: "Profile Retrieved Successfully",
            user: profile,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
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

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            email,
            department,
            year,
            phone,
        } = req.body;

        // Validate required fields
        if (!fullName || !fullName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full Name is required",
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find current user
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check whether another user already uses this email
        const existingUser = await User.findOne({
            where: {
                email: email.trim(),
            },
        });

        if (existingUser && existingUser.id !== user.id) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered",
            });
        }

        // Update profile
        user.fullName = fullName.trim();
        user.email = email.trim();
        user.department = department?.trim() || null;
        user.year = year?.trim() || null;
        user.phone = phone?.trim() || null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                department: user.department,
                year: user.year,
                phone: user.phone,
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
    googleAuth,
    googleSetPassword,
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
