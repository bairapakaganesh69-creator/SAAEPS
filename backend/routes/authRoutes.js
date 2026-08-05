const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    registerUser,
    loginUser,
    getProfile,
    verifyOTP,
    resendOTP,
    adminDashboard,
} = require("../controllers/authController");
router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.get("/profile", authMiddleware, getProfile);
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    adminDashboard
);

module.exports = router;