const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    submitTestAttempt,
    getMyAttempts,
} = require("../controllers/testAttemptController");

// Get logged-in user's test attempt history
router.get(
    "/my-attempts",
    authMiddleware,
    getMyAttempts
);

// Submit test attempt
router.post(
    "/:testId/:attemptId/submit",
    submitTestAttempt
);

module.exports = router;