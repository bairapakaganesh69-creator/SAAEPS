const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    adminDashboard
);

module.exports = router;