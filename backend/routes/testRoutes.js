const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

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

// --------------------------------
// CREATE TEST - ADMIN
// --------------------------------

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createTest
);

// --------------------------------
// GET ALL TESTS
// --------------------------------

router.get("/", getAllTests);

// --------------------------------
// GET TEST BY ID
// --------------------------------

router.get("/:id", getTestById);

// --------------------------------
// ADD QUESTION TO TEST - ADMIN
// --------------------------------

router.post(
    "/:testId/questions",
    authMiddleware,
    roleMiddleware("admin"),
    addQuestionToTest
);

// --------------------------------
// GET QUESTIONS OF TEST
// --------------------------------

router.get(
    "/:testId/questions",
    getTestQuestions
);

// --------------------------------
// PUBLISH TEST - ADMIN
// --------------------------------

router.patch(
    "/:id/publish",
    authMiddleware,
    roleMiddleware("admin"),
    publishTest
);

// --------------------------------
// START TEST
// --------------------------------

router.get(
    "/:id/start",
    startTest
);

// --------------------------------
// START TEST ATTEMPT
// --------------------------------

router.post(
    "/:id/attempt",
    authMiddleware,
    startTestAttempt
);

// --------------------------------
// SAVE STUDENT ANSWER
// --------------------------------

router.post(
    "/:testId/attempt/:attemptId/answers",
    authMiddleware,
    saveAnswer
);

module.exports = router;