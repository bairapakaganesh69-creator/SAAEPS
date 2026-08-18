const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");
const TestAttemptAnswer = require("../models/TestAttemptAnswer");
const TestQuestion = require("../models/TestQuestion");
const Question = require("../models/Question");

/**
 * Submit and evaluate a test attempt.
 */
const evaluateTestAttempt = async (
    testId,
    attemptId,
    userId
) => {
    // Find test
    const test = await Test.findByPk(testId);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Find attempt
    const attempt =
        await TestAttempt.findByPk(
            attemptId
        );

    if (!attempt) {
        const error = new Error(
            "Test attempt not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Check attempt ownership
    if (
        Number(attempt.userId) !==
        Number(userId)
    ) {
        const error = new Error(
            "Access Denied. You can only submit your own test attempt."
        );

        error.statusCode = 403;
        throw error;
    }

    // Check attempt belongs to test
    if (
        Number(attempt.testId) !==
        Number(testId)
    ) {
        const error = new Error(
            "This attempt does not belong to this test"
        );

        error.statusCode = 400;
        throw error;
    }

    // Check already submitted
    if (
        attempt.status === "Submitted"
    ) {
        const error = new Error(
            "This test attempt has already been submitted"
        );

        error.statusCode = 400;
        throw error;
    }

    // Get test questions
    const testQuestions =
        await TestQuestion.findAll({
            where: {
                testId,
            },
            include: [
                {
                    model: Question,
                },
            ],
            order: [
                ["questionOrder", "ASC"],
            ],
        });

    // Get student's answers
    const answers =
        await TestAttemptAnswer.findAll({
            where: {
                attemptId,
            },
        });

    // Create quick lookup
    const answerMap = {};

    answers.forEach((answer) => {
        answerMap[answer.questionId] =
            answer;
    });

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    // Evaluate every question
    for (const testQuestion of testQuestions) {
        const question =
            testQuestion.Question;

        const studentAnswer =
            answerMap[question.id];

        // Unanswered
        if (
            !studentAnswer ||
            !studentAnswer.selectedAnswer
        ) {
            unanswered++;

            if (studentAnswer) {
                studentAnswer.isCorrect =
                    false;

                studentAnswer.marksObtained =
                    0;

                await studentAnswer.save();
            }

            continue;
        }

        // Correct
        if (
            studentAnswer.selectedAnswer ===
            question.correctAnswer
        ) {
            correctAnswers++;

            score += Number(
                question.marks || 0
            );

            studentAnswer.isCorrect =
                true;

            studentAnswer.marksObtained =
                Number(
                    question.marks || 0
                );

            await studentAnswer.save();
        }

        // Wrong
        else {
            wrongAnswers++;

            studentAnswer.isCorrect =
                false;

            studentAnswer.marksObtained =
                0;

            await studentAnswer.save();
        }
    }

    const totalQuestions =
        testQuestions.length;

    const answered =
        correctAnswers +
        wrongAnswers;

    const percentage =
        test.totalMarks > 0
            ? Number(
                  (
                      (score /
                          test.totalMarks) *
                      100
                  ).toFixed(2)
              )
            : 0;

    // Update attempt
    attempt.score = score;

    attempt.status =
        "Submitted";

    attempt.submittedAt =
        new Date();

    await attempt.save();

    return {
        attemptId: attempt.id,

        testId: test.id,

        totalQuestions,

        answered,

        correctAnswers,

        wrongAnswers,

        unanswered,

        score,

        totalMarks:
            test.totalMarks,

        percentage,

        status:
            attempt.status,

        startedAt:
            attempt.startedAt,

        submittedAt:
            attempt.submittedAt,
    };
};

/**
 * Get all attempts belonging to a user.
 */
const getUserAttempts = async (userId) => {
    return await TestAttempt.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: Test,
                attributes: [
                    "id",
                    "title",
                    "examType",
                    "duration",
                    "totalMarks",
                ],
            },
        ],
        order: [["startedAt", "DESC"]],
    });
};

module.exports = {
    evaluateTestAttempt,
    getUserAttempts,
};