const express = require("express");

const router = express.Router();

const {
    createQuestion,
    getQuestions,
    getQuestionsByTopic,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

// Create Question
router.post("/", createQuestion);

// Get All Questions
router.get("/", getQuestions);
router.get("/topic/:topicId", getQuestionsByTopic);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
module.exports = router;