const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    chatWithAITutor,
} = require("../controllers/aiTutorController");

// AI Tutor Chat
router.post(
    "/chat",
    authMiddleware,
    chatWithAITutor
);

module.exports = router;