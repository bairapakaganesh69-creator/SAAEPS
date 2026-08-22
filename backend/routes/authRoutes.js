const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    adminDashboard,
} = require("../controllers/authController");

const {
    registerValidation,
} = require("../validators/authValidator");

// Register
router.post(
    "/register",
    registerValidation,
    registerUser
);

// Login
router.post(
    "/login",
    loginUser
);

// Email OTP Verification
router.post(
    "/verify-otp",
    verifyOTP
);

// Resend Email OTP
router.post(
    "/resend-otp",
    resendOTP
);

// Forgot Password
router.post(
    "/forgot-password",
    forgotPassword
);

// Verify Reset OTP
router.post(
    "/verify-reset-otp",
    verifyResetOTP
);

// Reset Password
router.post(
    "/reset-password",
    resetPassword
);

// Get Profile
router.get(
    "/profile",
    authMiddleware,
    getProfile
);
// Update Profile
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);
// Change Password
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

// Admin Dashboard
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    adminDashboard
);

module.exports = router;