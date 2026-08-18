const TestAttemptAnswer = require("../models/TestAttemptAnswer");
const Question = require("../models/Question");
const TestQuestion = require("../models/TestQuestion");

/**
 * Get all answers for an attempt.
 */
const getAttemptResultAnswers = async (attemptId) => {
    return await TestAttemptAnswer.findAll({
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
};

/**
 * Calculate result details from submitted answers.
 */
const calculateResult = (answers) => {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let score = 0;

    const answerDetails = answers.map((answer) => {
        const question = answer.Question;

        if (!question) {
            return null;
        }

        const selectedAnswer =
            answer.selectedAnswer;

        const isAnswered =
            Boolean(selectedAnswer);

        const isCorrect =
            isAnswered &&
            selectedAnswer ===
                question.correctAnswer;

        if (isCorrect) {
            correctAnswers++;

            score += Number(
                question.marks || 0
            );
        }

        const isWrong =
            isAnswered && !isCorrect;

        if (isWrong) {
            wrongAnswers++;
        }

        return {
            questionId: question.id,

            question: question.question,

            optionA: question.optionA,

            optionB: question.optionB,

            optionC: question.optionC,

            optionD: question.optionD,

            selectedAnswer,

            correctAnswer:
                question.correctAnswer,

            marks: question.marks,

            isCorrect,

            explanation:
                question.explanation,
        };
    });

    return {
        correctAnswers,
        wrongAnswers,
        score,
        answerDetails:
            answerDetails.filter(Boolean),
    };
};
/**
 * Get total number of questions in a test.
 */
const getTotalQuestions = async (testId) => {
    return await TestQuestion.count({
        where: {
            testId,
        },
    });
};

/**
 * Calculate percentage.
 */
const calculatePercentage = (
    score,
    totalMarks
) => {
    return totalMarks > 0
        ? Math.round(
              (score / totalMarks) * 100
          )
        : 0;
};

module.exports = {
    getAttemptResultAnswers,
    calculateResult,
    getTotalQuestions,
    calculatePercentage,
};