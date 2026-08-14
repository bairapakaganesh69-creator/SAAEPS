const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getResultByAttemptId,
} = require("../controllers/resultController");

// Get Result By Attempt ID
router.get(
    "/attempt/:attemptId",
    authMiddleware,
    getResultByAttemptId
);

module.exports = router;