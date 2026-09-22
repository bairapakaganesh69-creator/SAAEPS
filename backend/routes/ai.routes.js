const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
// ==========================
// Controllers
// ==========================
const { tutorChat } = require("../controllers/ai/tutor.controller");
const { weakTopicAnalyzer } = require("../controllers/ai/weakTopic.controller");
const { feedbackGenerator } = require("../controllers/ai/feedback.controller");
const { studyPlanner } = require("../controllers/ai/studyPlanner.controller");
const { performanceFeedback } = require("../controllers/ai/performanceFeedback.controller");

// ==========================
// Validators
// ==========================
const {
    tutorValidation,
    weakTopicValidation,
    feedbackValidation,
    studyPlannerValidation,
    performanceFeedbackValidation,
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
    authMiddleware,
    tutorValidation,
    validateRequest,
    tutorChat
);

// ==========================
// Weak Topic Analyzer
// ==========================
router.post(
    "/weak-topics",
    authMiddleware,
    weakTopicValidation,
    validateRequest,
    weakTopicAnalyzer
);

// ==========================
// Feedback Generator
// ==========================
router.post(
    "/feedback",
    authMiddleware,
    feedbackValidation,
    validateRequest,
    feedbackGenerator
);

// ==========================
// Study Planner
// ==========================
router.post(
    "/study-plan",
    authMiddleware,
    studyPlannerValidation,
    validateRequest,
    studyPlanner
);

// ==========================
// Performance Feedback
// ==========================
router.post(
    "/performance-feedback",
    authMiddleware,
    performanceFeedbackValidation,
    validateRequest,
    performanceFeedback
);

module.exports = router;