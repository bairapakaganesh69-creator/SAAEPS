const express = require("express");

const router = express.Router();

const {
    createQuestion,
    getQuestions,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");

// Create Question
router.post(
    "/",
    createQuestion
);

// Get All Questions
router.get(
    "/",
    getQuestions
);

// Get Questions By Topic
router.get(
    "/topic/:topicId",
    getQuestionsByTopic
);

// Update Question
router.put(
    "/:id",
    updateQuestion
);

// Delete Question
router.delete(
    "/:id",
    deleteQuestion
);

module.exports = router;