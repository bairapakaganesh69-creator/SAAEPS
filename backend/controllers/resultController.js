const TestAttempt = require("../models/TestAttempt");
const TestAttemptAnswer = require("../models/TestAttemptAnswer");
const Test = require("../models/Test");
const Question = require("../models/Question");
const TestQuestion = require("../models/TestQuestion");
// Get Result By Attempt ID
const getResultByAttemptId = async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Find attempt
        const attempt = await TestAttempt.findByPk(attemptId);

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Test Attempt not found",
            });
        }
        // Check whether this attempt belongs to the logged-in user
if (Number(attempt.userId) !== Number(req.user.id)) {
    return res.status(403).json({
        success: false,
        message: "Access Denied. You can only view your own test result.",
    });
}

        // Find test
        const test = await Test.findByPk(attempt.testId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Get submitted answers
        const answers = await TestAttemptAnswer.findAll({
            where: {
                attemptId,
            },
            include: [
                {
                    model: Question,
                    attributes: [
                        "id",
                        "question",
                        "optionA",
                        "optionB",
                        "optionC",
                        "optionD",
                        "correctAnswer",
                        "marks",
                        "explanation",
                    ],
                },
            ],
        });

        let correctAnswers = 0;
        let wrongAnswers = 0;
        let score = 0;

        const answerDetails = answers.map((answer) => {
            const question = answer.Question;

            const isCorrect =
                answer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                correctAnswers++;
                score += question.marks;
            } else {
                wrongAnswers++;
            }

            return {
                questionId: question.id,
                question: question.question,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD,
                selectedAnswer: answer.selectedAnswer,
                correctAnswer: question.correctAnswer,
                marks: question.marks,
                isCorrect,
                explanation: question.explanation,
            };
        });

        const totalQuestions = await TestQuestion.count({
    where: {
        testId: test.id,
    },
});

        const percentage =
            test.totalMarks > 0
                ? Math.round((score / test.totalMarks) * 100)
                : 0;

        res.status(200).json({
            success: true,

            result: {
                attemptId: attempt.id,
                testId: test.id,
                testTitle: test.title,
                examType: test.examType,

               totalQuestions,

                answered: answers.length,
                correctAnswers,
                wrongAnswers,

                score,
                totalMarks: test.totalMarks,
                percentage,

                status: attempt.status,
                startedAt: attempt.startedAt,
                submittedAt: attempt.submittedAt,
            },

            answers: answerDetails,
        });
    } catch (error) {
        console.error("Get Result Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Get Result",
            error: error.message,
        });
    }
};

module.exports = {
    getResultByAttemptId,
};