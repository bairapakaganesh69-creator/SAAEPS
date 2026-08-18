const TestAttempt = require("../models/TestAttempt");
const Test = require("../models/Test");

const {
    getAttemptResultAnswers,
    calculateResult,
    getTotalQuestions,
    calculatePercentage,
} = require("../services/result.service");

// Get Result By Attempt ID
const getResultByAttemptId = async (
    req,
    res
) => {
    try {
        const { attemptId } = req.params;

        // --------------------------------
        // FIND ATTEMPT
        // --------------------------------

        const attempt =
            await TestAttempt.findByPk(
                attemptId
            );

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message:
                    "Test Attempt not found",
            });
        }

        // --------------------------------
        // CHECK OWNERSHIP
        // --------------------------------

        if (
            Number(attempt.userId) !==
            Number(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Access Denied. You can only view your own test result.",
            });
        }

        // --------------------------------
        // FIND TEST
        // --------------------------------

        const test =
            await Test.findByPk(
                attempt.testId
            );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // --------------------------------
        // GET ANSWERS
        // --------------------------------

        const answers =
            await getAttemptResultAnswers(
                attemptId
            );

        // --------------------------------
        // CALCULATE RESULT
        // --------------------------------

        const result =
            calculateResult(answers);

        // --------------------------------
        // TOTAL QUESTIONS
        // --------------------------------

        const totalQuestions =
            await getTotalQuestions(
                test.id
            );

        // --------------------------------
        // PERCENTAGE
        // --------------------------------

        const percentage =
            calculatePercentage(
                result.score,
                test.totalMarks
            );

        // --------------------------------
        // FINAL RESPONSE
        // --------------------------------

        return res.status(200).json({
            success: true,

            result: {
                attemptId: attempt.id,

                testId: test.id,

                testTitle: test.title,

                examType: test.examType,

                totalQuestions,

                answered:
                    answers.length,

                correctAnswers:
                    result.correctAnswers,

                wrongAnswers:
                    result.wrongAnswers,

                score: result.score,

                totalMarks:
                    test.totalMarks,

                percentage,

                status: attempt.status,

                startedAt:
                    attempt.startedAt,

                submittedAt:
                    attempt.submittedAt,
            },

            answers:
                result.answerDetails,
        });
    } catch (error) {
        console.error(
            "Get Result Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to Get Result",

            error: error.message,
        });
    }
};

module.exports = {
    getResultByAttemptId,
};