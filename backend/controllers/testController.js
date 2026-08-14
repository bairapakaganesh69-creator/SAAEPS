const Test = require("../models/Test");
const TestQuestion = require("../models/TestQuestion");
const Question = require("../models/Question");
const TestAttempt = require("../models/TestAttempt");
const TestAttemptAnswer = require("../models/TestAttemptAnswer");
// Create Test
const createTest = async (req, res) => {
    try {
        const {
            title,
            examType,
            duration,
            totalMarks,
        } = req.body;

        const test = await Test.create({
            title,
            examType,
            duration,
            totalMarks,
            status: "Draft",
        });

        res.status(201).json({
            success: true,
            message: "Test Created Successfully",
            test,
        });
    } catch (error) {
        console.error("Create Test Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Create Test",
            error: error.message,
        });
    }
};
// Get All Tests
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.findAll({
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            count: tests.length,
            tests,
        });
    } catch (error) {
        console.error("Get All Tests Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Get Tests",
            error: error.message,
        });
    }
};
// Get Test By ID
const getTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findByPk(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        res.status(200).json({
            success: true,
            test,
        });
    } catch (error) {
        console.error("Get Test By ID Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Get Test",
            error: error.message,
        });
    }
};
// Add Question To Test
const addQuestionToTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { questionId, questionOrder } = req.body;

        // Check if test exists
        const test = await Test.findByPk(testId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Check if question exists
        const question = await Question.findByPk(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Check if question is already added
        const existingQuestion = await TestQuestion.findOne({
            where: {
                testId,
                questionId,
            },
        });

        if (existingQuestion) {
            return res.status(400).json({
                success: false,
                message: "Question already added to this test",
            });
        }

        // Add question to test
        const testQuestion = await TestQuestion.create({
            testId,
            questionId,
            questionOrder,
        });

        res.status(201).json({
            success: true,
            message: "Question Added To Test Successfully",
            testQuestion,
        });
    } catch (error) {
        console.error("Add Question To Test Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Add Question To Test",
            error: error.message,
        });
    }
};
// Get Questions Of Test
const getTestQuestions = async (req, res) => {
    try {
        const { testId } = req.params;

        // Check if test exists
        const test = await Test.findByPk(testId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Get questions belonging to the test
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

        res.status(200).json({
            success: true,
            count: testQuestions.length,
            questions: testQuestions.map((item) => ({
                ...item.Question.toJSON(),
                questionOrder: item.questionOrder,
            })),
        });
    } catch (error) {
        console.error("Get Test Questions Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Get Test Questions",
            error: error.message,
        });
    }
};
// Publish Test
const publishTest = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if test exists
        const test = await Test.findByPk(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Check current status
        if (test.status === "Published") {
            return res.status(400).json({
                success: false,
                message: "Test is already published",
            });
        }

        // Get questions of this test
        const testQuestions = await TestQuestion.findAll({
            where: {
                testId: id,
            },
        });

        // Make sure test has questions
        if (testQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot publish a test without questions",
            });
        }

        // Publish test
        test.status = "Published";
        await test.save();

        res.status(200).json({
            success: true,
            message: "Test Published Successfully",
            test,
        });
    } catch (error) {
        console.error("Publish Test Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Publish Test",
            error: error.message,
        });
    }
};
// Start Test - Student
const startTest = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if test exists
        const test = await Test.findByPk(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Only Published tests can be started
        if (test.status !== "Published") {
            return res.status(400).json({
                success: false,
                message: "This test is not published yet",
            });
        }

        // Get questions of the test
        const testQuestions = await TestQuestion.findAll({
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

        // Check if test has questions
        if (testQuestions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "This test has no questions",
            });
        }

        // Remove correct answer and explanation
        const questions = testQuestions.map((item) => {
            const question = item.Question.toJSON();

            return {
                id: question.id,
                question: question.question,
                optionA: question.optionA,
                optionB: question.optionB,
                optionC: question.optionC,
                optionD: question.optionD,
                difficulty: question.difficulty,
                marks: question.marks,
                questionOrder: item.questionOrder,
            };
        });

        res.status(200).json({
            success: true,
            test: {
                id: test.id,
                title: test.title,
                examType: test.examType,
                duration: test.duration,
                totalMarks: test.totalMarks,
                questionCount: questions.length,
            },
            questions,
        });
    } catch (error) {
        console.error("Start Test Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Start Test",
            error: error.message,
        });
    }
};
// Start Test Attempt - Student
const startTestAttempt = async (req, res) => {
    try {
        const { id } = req.params;

        // For now, we will use userId from request body.
        // Later JWT authentication will provide this automatically.
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        // Check if test exists
        const test = await Test.findByPk(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Test not found",
            });
        }

        // Test must be published
        if (test.status !== "Published") {
            return res.status(400).json({
                success: false,
                message: "This test is not published yet",
            });
        }

        // Check whether student already has an active attempt
        const existingAttempt = await TestAttempt.findOne({
            where: {
                userId,
                testId: id,
                status: "In Progress",
            },
        });

        if (existingAttempt) {
            return res.status(200).json({
                success: true,
                message: "Existing Test Attempt Found",
                attempt: existingAttempt,
            });
        }

        // Create new attempt
        const attempt = await TestAttempt.create({
            userId,
            testId: id,
            startedAt: new Date(),
            status: "In Progress",
            score: 0,
            totalMarks: test.totalMarks,
        });

        res.status(201).json({
            success: true,
            message: "Test Attempt Started Successfully",
            attempt: {
                id: attempt.id,
                userId: attempt.userId,
                testId: attempt.testId,
                startedAt: attempt.startedAt,
                status: attempt.status,
                score: attempt.score,
                totalMarks: attempt.totalMarks,
            },
        });
    } catch (error) {
        console.error("Start Test Attempt Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Start Test Attempt",
            error: error.message,
        });
    }
};// Save Student Answer
const saveAnswer = async (req, res) => {
    try {
        const { testId, attemptId } = req.params;
        const { questionId, selectedAnswer } = req.body;

        // Validate selected answer
        if (!questionId || !selectedAnswer) {
            return res.status(400).json({
                success: false,
                message: "questionId and selectedAnswer are required",
            });
        }

        // Check selected answer format
        if (!["A", "B", "C", "D"].includes(selectedAnswer)) {
            return res.status(400).json({
                success: false,
                message: "selectedAnswer must be A, B, C or D",
            });
        }

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

        // Make sure attempt belongs to this test
        if (Number(attempt.testId) !== Number(testId)) {
            return res.status(400).json({
                success: false,
                message: "This attempt does not belong to this test",
            });
        }

        // Attempt must still be active
        if (attempt.status !== "In Progress") {
            return res.status(400).json({
                success: false,
                message: "This test attempt has already been submitted",
            });
        }

        // Check question
        const question = await Question.findByPk(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
            });
        }

        // Check whether question belongs to this test
        const testQuestion = await TestQuestion.findOne({
            where: {
                testId,
                questionId,
            },
        });

        if (!testQuestion) {
            return res.status(400).json({
                success: false,
                message: "This question does not belong to this test",
            });
        }

        // Check if answer already exists
        let answer = await TestAttemptAnswer.findOne({
            where: {
                attemptId,
                questionId,
            },
        });

        if (answer) {
            // Update existing answer
            answer.selectedAnswer = selectedAnswer;

            await answer.save();

            return res.status(200).json({
                success: true,
                message: "Answer Updated Successfully",
                answer: {
                    id: answer.id,
                    attemptId: answer.attemptId,
                    questionId: answer.questionId,
                    selectedAnswer: answer.selectedAnswer,
                },
            });
        }

        // Create new answer
        answer = await TestAttemptAnswer.create({
            attemptId,
            questionId,
            selectedAnswer,
            isCorrect: null,
            marksObtained: 0,
        });

        res.status(201).json({
            success: true,
            message: "Answer Saved Successfully",
            answer: {
                id: answer.id,
                attemptId: answer.attemptId,
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
            },
        });

    } catch (error) {
        console.error("Save Answer Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to Save Answer",
            error: error.message,
        });
    }
};
module.exports = {
    createTest,
    getAllTests,
    getTestById,
    addQuestionToTest,
    getTestQuestions,
    publishTest,
    startTest,
    startTestAttempt,
    saveAnswer,
};