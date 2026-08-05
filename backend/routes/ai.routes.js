const express = require("express");
const router = express.Router();

// ==========================
// Controllers
// ==========================
const { tutorChat } = require("../controllers/ai/tutor.controller");
const { weakTopicAnalyzer } = require("../controllers/ai/weakTopic.controller");
const { feedbackGenerator } = require("../controllers/ai/feedback.controller");
const { studyPlanner } = require("../controllers/ai/studyPlanner.controller");

// ==========================
// Validators
// ==========================
const {
    tutorValidation,
    weakTopicValidation,
    feedbackValidation,
    studyPlannerValidation,
} = require("../validators/ai.validator");

// ==========================
// Middleware
// ==========================
const validateRequest = require("../middleware/validationMiddleware");

// ==========================
// AI Tutor
// ==========================
router.post(
    "/tutor",
    tutorValidation,
    validateRequest,
    tutorChat
);

// ==========================
// Weak Topic Analyzer
// ==========================
router.post(
    "/weak-topics",
    weakTopicValidation,
    validateRequest,
    weakTopicAnalyzer
);

// ==========================
// Feedback Generator
// ==========================
router.post(
    "/feedback",
    feedbackValidation,
    validateRequest,
    feedbackGenerator
);

// ==========================
// Study Planner
// ==========================
router.post(
    "/study-plan",
    studyPlannerValidation,
    validateRequest,
    studyPlanner
);

module.exports = router;