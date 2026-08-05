const { body } = require("express-validator");

// ==========================
// AI Tutor Validation
// ==========================
const tutorValidation = [

    body("prompt")
        .trim()
        .notEmpty()
        .withMessage("Prompt is required")

];

// ==========================
// Weak Topic Analyzer Validation
// ==========================
const weakTopicValidation = [

    body("subject")
        .notEmpty()
        .withMessage("Subject is required"),

    body("totalMarks")
        .isNumeric()
        .withMessage("Total Marks must be a number"),

    body("obtainedMarks")
        .isNumeric()
        .withMessage("Obtained Marks must be a number"),

    body("chapterScores")
        .isArray({ min: 1 })
        .withMessage("Chapter Scores are required")

];

// ==========================
// Feedback Generator Validation
// ==========================
const feedbackValidation = [

    body("studentName")
        .notEmpty()
        .withMessage("Student Name is required"),

    body("subject")
        .notEmpty()
        .withMessage("Subject is required"),

    body("percentage")
        .isNumeric()
        .withMessage("Percentage must be numeric"),

    body("weakTopics")
        .isArray()
        .withMessage("Weak Topics must be an array"),

    body("strongTopics")
        .isArray()
        .withMessage("Strong Topics must be an array")

];

// ==========================
// Study Planner Validation
// ==========================
const studyPlannerValidation = [

    body("studentName")
        .notEmpty()
        .withMessage("Student Name is required"),

    body("goal")
        .notEmpty()
        .withMessage("Goal is required"),

    body("subject")
        .notEmpty()
        .withMessage("Subject is required"),

    body("durationDays")
        .isInt({ min: 1 })
        .withMessage("Duration Days must be greater than 0"),

    body("studyHoursPerDay")
        .isFloat({ min: 1 })
        .withMessage("Study Hours Per Day must be greater than 0"),

    body("weakTopics")
        .isArray({ min: 1 })
        .withMessage("Weak Topics must be an array with at least one topic")

];

// ==========================
// Performance Feedback Validation
// ==========================
const performanceFeedbackValidation = [

    body("studentName")
        .notEmpty()
        .withMessage("Student Name is required"),

    body("subject")
        .notEmpty()
        .withMessage("Subject is required"),

    body("totalMarks")
        .isNumeric()
        .withMessage("Total Marks must be a number"),

    body("obtainedMarks")
        .isNumeric()
        .withMessage("Obtained Marks must be a number"),

    body("correctAnswers")
        .isNumeric()
        .withMessage("Correct Answers must be a number"),

    body("wrongAnswers")
        .isNumeric()
        .withMessage("Wrong Answers must be a number"),

    body("timeTaken")
        .isNumeric()
        .withMessage("Time Taken must be a number"),

    body("weakTopics")
        .isArray()
        .withMessage("Weak Topics must be an array"),

    body("strongTopics")
        .isArray()
        .withMessage("Strong Topics must be an array")

];

module.exports = {
    tutorValidation,
    weakTopicValidation,
    feedbackValidation,
    studyPlannerValidation,
    performanceFeedbackValidation,
};