const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getWeakTopicsAnalysis,
} = require("../controllers/weakTopicController");

// Get weak topics of logged-in student
router.get(
    "/",
    authMiddleware,
    getWeakTopicsAnalysis
);

module.exports = router;