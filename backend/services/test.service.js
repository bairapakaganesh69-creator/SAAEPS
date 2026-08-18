const Test = require("../models/Test");
const TestQuestion = require("../models/TestQuestion");
const Question = require("../models/Question");
const TestAttempt = require("../models/TestAttempt");
const TestAttemptAnswer = require("../models/TestAttemptAnswer");

/**
 * Create a new test.
 */
const createTest = async ({
    title,
    examType,
    duration,
    totalMarks,
}) => {
    return await Test.create({
        title,
        examType,
        duration,
        totalMarks,
        status: "Draft",
    });
};

/**
 * Get all tests.
 */
const getAllTests = async () => {
    return await Test.findAll({
        order: [["createdAt", "DESC"]],
    });
};

/**
 * Get test by ID.
 */
const getTestById = async (id) => {
    return await Test.findByPk(id);
};

/**
 * Add a question to a test.
 */
const addQuestionToTest = async (
    testId,
    questionId,
    questionOrder
) => {
    // Check test
    const test = await Test.findByPk(testId);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Check question
    const question =
        await Question.findByPk(questionId);

    if (!question) {
        const error = new Error(
            "Question not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Check duplicate
    const existingQuestion =
        await TestQuestion.findOne({
            where: {
                testId,
                questionId,
            },
        });

    if (existingQuestion) {
        const error = new Error(
            "Question already added to this test"
        );
        error.statusCode = 400;
        throw error;
    }

    return await TestQuestion.create({
        testId,
        questionId,
        questionOrder,
    });
};

/**
 * Get questions belonging to a test.
 */
const getTestQuestions = async (testId) => {
    const test = await Test.findByPk(testId);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return await TestQuestion.findAll({
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
};

/**
 * Publish a test.
 */
const publishTest = async (id) => {
    const test = await Test.findByPk(id);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (test.status === "Published") {
        const error = new Error(
            "Test is already published"
        );
        error.statusCode = 400;
        throw error;
    }

    const testQuestions =
        await TestQuestion.findAll({
            where: {
                testId: id,
            },
        });

    if (testQuestions.length === 0) {
        const error = new Error(
            "Cannot publish a test without questions"
        );
        error.statusCode = 400;
        throw error;
    }

    test.status = "Published";

    await test.save();

    return test;
};

/**
 * Get test details and questions for starting a test.
 *
 * Correct answers and explanations are intentionally
 * excluded from the returned questions.
 */
const getStartTestData = async (id) => {
    const test = await Test.findByPk(id);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (test.status !== "Published") {
        const error = new Error(
            "This test is not published yet"
        );
        error.statusCode = 400;
        throw error;
    }

    const testQuestions =
        await TestQuestion.findAll({
            where: {
                testId: id,
            },
            include: [
                {
                    model: Question,
                },
            ],
            order: [["questionOrder", "ASC"]],
        });

    if (testQuestions.length === 0) {
        const error = new Error(
            "This test has no questions"
        );
        error.statusCode = 400;
        throw error;
    }

    const questions = testQuestions.map(
        (item) => {
            const question =
                item.Question.toJSON();

            return {
                id: question.id,
                question: question.question,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD,
                difficulty:
                    question.difficulty,
                marks: question.marks,
                questionOrder:
                    item.questionOrder,
            };
        }
    );

    return {
        test: {
            id: test.id,
            title: test.title,
            examType: test.examType,
            duration: test.duration,
            totalMarks: test.totalMarks,
            questionCount:
                questions.length,
        },

        questions,
    };
};

/**
 * Start a test attempt for a student.
 */
const startTestAttempt = async (
    testId,
    userId
) => {
    const test =
        await Test.findByPk(testId);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (test.status !== "Published") {
        const error = new Error(
            "This test is not published yet"
        );
        error.statusCode = 400;
        throw error;
    }

    // Check existing active attempt
    const existingAttempt =
        await TestAttempt.findOne({
            where: {
                userId,
                testId,
                status: "In Progress",
            },
        });

    if (existingAttempt) {
        return {
            existing: true,
            attempt: existingAttempt,
        };
    }

    const attempt =
        await TestAttempt.create({
            userId,
            testId,
            startedAt: new Date(),
            status: "In Progress",
            score: 0,
            totalMarks: test.totalMarks,
        });

    return {
        existing: false,
        attempt,
    };
};

/**
 * Save or update a student's answer.
 */
const saveAnswer = async (
    testId,
    attemptId,
    questionId,
    selectedAnswer,
    userId
) => {
    // Validate answer
    if (!questionId || !selectedAnswer) {
        const error = new Error(
            "questionId and selectedAnswer are required"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        !["A", "B", "C", "D"].includes(
            selectedAnswer
        )
    ) {
        const error = new Error(
            "selectedAnswer must be A, B, C or D"
        );
        error.statusCode = 400;
        throw error;
    }

    // Check test
    const test =
        await Test.findByPk(testId);

    if (!test) {
        const error = new Error(
            "Test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Check attempt
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
            "Access Denied. This test attempt does not belong to you"
        );
        error.statusCode = 403;
        throw error;
    }

    // Check test ownership
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

    // Attempt must be active
    if (
        attempt.status !== "In Progress"
    ) {
        const error = new Error(
            "This test attempt has already been submitted"
        );
        error.statusCode = 400;
        throw error;
    }

    // Check question
    const question =
        await Question.findByPk(
            questionId
        );

    if (!question) {
        const error = new Error(
            "Question not found"
        );
        error.statusCode = 404;
        throw error;
    }

    // Check question belongs to test
    const testQuestion =
        await TestQuestion.findOne({
            where: {
                testId,
                questionId,
            },
        });

    if (!testQuestion) {
        const error = new Error(
            "This question does not belong to this test"
        );
        error.statusCode = 400;
        throw error;
    }

    // Check existing answer
    let answer =
        await TestAttemptAnswer.findOne({
            where: {
                attemptId,
                questionId,
            },
        });

    // Update existing answer
    if (answer) {
        answer.selectedAnswer =
            selectedAnswer;

        await answer.save();

        return {
            created: false,
            answer,
        };
    }

    // Create new answer
    answer =
        await TestAttemptAnswer.create({
            attemptId,
            questionId,
            selectedAnswer,
            isCorrect: null,
            marksObtained: 0,
        });

    return {
        created: true,
        answer,
    };
};

module.exports = {
    createTest,
    getAllTests,
    getTestById,
    addQuestionToTest,
    getTestQuestions,
    publishTest,
    getStartTestData,
    startTestAttempt,
    saveAnswer,
};