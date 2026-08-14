const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");
const TestAttemptAnswer = require("../models/TestAttemptAnswer");
const TestQuestion = require("../models/TestQuestion");
const Question = require("../models/Question");

// Submit and Evaluate Test Attempt
const submitTestAttempt = async (req, res) => {
    try {
        const { testId, attemptId } = req.params;

        // Check test
        const test = await Test.findByPk(testId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Check attempt
        const attempt = await TestAttempt.findByPk(attemptId);

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Test attempt not found",
            });
        }

        // Check attempt belongs to this test
        if (Number(attempt.testId) !== Number(testId)) {
            return res.status(400).json({
                success: false,
                message: "This attempt does not belong to this test",
            });
        }

        // Check whether already submitted
        if (attempt.status === "Submitted") {
            return res.status(400).json({
                success: false,
                message: "This test attempt has already been submitted",
            });
        }

        // Get all questions in this test
        const testQuestions = await TestQuestion.findAll({
            where: {
                testId,
            },
            include: [
                {
                    model: Question,
                },
            ],
            order: [["questionOrder", "ASC"]],
        });

        // Get all answers submitted by student
        const answers = await TestAttemptAnswer.findAll({
            where: {
                attemptId,
            },
        });

        // Create quick lookup
        const answerMap = {};

        answers.forEach((answer) => {
            answerMap[answer.questionId] = answer;
        });

        let score = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let unanswered = 0;

        // Evaluate every question
        for (const testQuestion of testQuestions) {
            const question = testQuestion.Question;

            const studentAnswer = answerMap[question.id];

            // Question not answered
            if (!studentAnswer || !studentAnswer.selectedAnswer) {
                unanswered++;

                if (studentAnswer) {
                    studentAnswer.isCorrect = false;
                    studentAnswer.marksObtained = 0;
                    await studentAnswer.save();
                }

                continue;
            }

            // Correct answer
            if (
                studentAnswer.selectedAnswer === question.correctAnswer
            ) {
                correctAnswers++;

                score += question.marks;

                studentAnswer.isCorrect = true;
                studentAnswer.marksObtained = question.marks;

                await studentAnswer.save();
            }

            // Wrong answer
            else {
                wrongAnswers++;

                studentAnswer.isCorrect = false;
                studentAnswer.marksObtained = 0;

                await studentAnswer.save();
            }
        }

        const totalQuestions = testQuestions.length;

        const answered = correctAnswers + wrongAnswers;

        const percentage =
            test.totalMarks > 0
                ? Number(((score / test.totalMarks) * 100).toFixed(2))
                : 0;

        // Update attempt
        attempt.score = score;
        attempt.status = "Submitted";
        attempt.submittedAt = new Date();

        await attempt.save();

        res.status(200).json({
            success: true,
            message: "Test Submitted Successfully",

            result: {
                attemptId: attempt.id,
                testId: test.id,

                totalQuestions,
                answered,
                correctAnswers,
                wrongAnswers,
                unanswered,

                score,
                totalMarks: test.totalMarks,
                percentage,

                status: attempt.status,
                startedAt: attempt.startedAt,
                submittedAt: attempt.submittedAt,
            },
        });
    } catch (error) {
        console.error("Submit Test Attempt Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Submit Test Attempt",
            error: error.message,
        });
    }
};
// Get Logged-in User's Test Attempt History
const getMyAttempts = async (req, res) => {
    try {
        // Get logged-in user's ID from authentication middleware
        const userId = req.user.id;

        // Get all attempts of this user
        const attempts = await TestAttempt.findAll({
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

        res.status(200).json({
            success: true,
            count: attempts.length,

            attempts: attempts.map((attempt) => ({
                attemptId: attempt.id,
                testId: attempt.testId,
                testTitle: attempt.Test.title,
                examType: attempt.Test.examType,

                score: attempt.score,
                totalMarks: attempt.totalMarks,

                percentage:
                    attempt.totalMarks > 0
                        ? Number(
                              (
                                  (attempt.score / attempt.totalMarks) *
                                  100
                              ).toFixed(2)
                          )
                        : 0,

                status: attempt.status,

                startedAt: attempt.startedAt,
                submittedAt: attempt.submittedAt,
            })),
        });
    } catch (error) {
        console.error("Get My Attempts Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Get Test Attempt History",
            error: error.message,
        });
    }
};

module.exports = {
    submitTestAttempt,
    getMyAttempts,
};