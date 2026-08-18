const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAIFeedback,
} = require("../controllers/aiFeedbackController");

// Get AI feedback for logged-in student
router.get(
    "/",
    authMiddleware,
    getAIFeedback
);

module.exports = router;