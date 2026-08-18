const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getPerformanceAnalysis,
} = require("../controllers/performanceController");

// Get logged-in student's performance analysis
router.get(
    "/",
    authMiddleware,
    getPerformanceAnalysis
);

module.exports = router;