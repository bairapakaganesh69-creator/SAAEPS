const express = require("express");

const router = express.Router();

const {
    createTest,
    getAllTests,
    getTestById,
    addQuestionToTest,
    getTestQuestions,
    publishTest,
    startTest,
    startTestAttempt,
    saveAnswer,
} = require("../controllers/testController");

const {
    submitTestAttempt,
} = require("../controllers/testAttemptController");

// Create Test
router.post("/", createTest);
// Get All Tests
router.get("/", getAllTests);
// Get Test By ID
router.get("/:id", getTestById);
// Add Question To Test
router.post("/:testId/questions", addQuestionToTest);
// Get Questions Of Test
router.get("/:testId/questions", getTestQuestions);
// Publish Test
router.patch("/:id/publish", publishTest);
// Start Test - Student
router.get("/:id/start", startTest);
// Start Test Attempt
router.post("/:id/attempt", startTestAttempt);
// Save Student Answer
router.post("/:testId/attempt/:attemptId/answers", saveAnswer);

// Submit Test Attempt
router.post(
    "/:testId/attempt/:attemptId/submit",
    submitTestAttempt
);

module.exports = router;