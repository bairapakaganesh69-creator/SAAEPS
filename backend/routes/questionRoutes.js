
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createQuestion,
    getQuestions,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");

// --------------------------------
// AUTHENTICATED USERS
// --------------------------------

// Get all questions
router.get(
    "/",
    authMiddleware,
    getQuestions
);

// Get questions by topic
router.get(
    "/topic/:topicId",
    authMiddleware,
    getQuestionsByTopic
);

// --------------------------------
// ADMIN QUESTION MANAGEMENT
// --------------------------------

// Create question
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createQuestion
);

// Update question
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateQuestion
);

// Delete question
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteQuestion
);

module.exports = router;
