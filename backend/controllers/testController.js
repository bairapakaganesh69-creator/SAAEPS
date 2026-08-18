const {
    createTest: createTestService,
    getAllTests: getAllTestsService,
    getTestById: getTestByIdService,
    addQuestionToTest: addQuestionToTestService,
    getTestQuestions: getTestQuestionsService,
    publishTest: publishTestService,
    getStartTestData,
    startTestAttempt: startTestAttemptService,
    saveAnswer: saveAnswerService,
} = require("../services/test.service");

// --------------------------------
// CREATE TEST
// --------------------------------

const createTest = async (req, res) => {
    try {
        const {
            title,
            examType,
            duration,
            totalMarks,
        } = req.body;

        const test =
            await createTestService({
                title,
                examType,
                duration,
                totalMarks,
            });

        res.status(201).json({
            success: true,
            message:
                "Test Created Successfully",
            test,
        });

    } catch (error) {
        console.error(
            "Create Test Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Create Test",
            error: error.message,
        });
    }
};

// --------------------------------
// GET ALL TESTS
// --------------------------------

const getAllTests = async (req, res) => {
    try {
        const tests =
            await getAllTestsService();

        res.status(200).json({
            success: true,
            count: tests.length,
            tests,
        });

    } catch (error) {
        console.error(
            "Get All Tests Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Get Tests",
            error: error.message,
        });
    }
};

// --------------------------------
// GET TEST BY ID
// --------------------------------

const getTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test =
            await getTestByIdService(id);

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
        console.error(
            "Get Test By ID Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Get Test",
            error: error.message,
        });
    }
};

// --------------------------------
// ADD QUESTION TO TEST
// --------------------------------

const addQuestionToTest = async (
    req,
    res
) => {
    try {
        const { testId } = req.params;

        const {
            questionId,
            questionOrder,
        } = req.body;

        const testQuestion =
            await addQuestionToTestService(
                testId,
                questionId,
                questionOrder
            );

        res.status(201).json({
            success: true,
            message:
                "Question Added To Test Successfully",
            testQuestion,
        });

    } catch (error) {
        console.error(
            "Add Question To Test Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Add Question To Test",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// --------------------------------
// GET TEST QUESTIONS
// --------------------------------

const getTestQuestions = async (
    req,
    res
) => {
    try {
        const { testId } = req.params;

        const testQuestions =
            await getTestQuestionsService(
                testId
            );

        res.status(200).json({
            success: true,
            count:
                testQuestions.length,

            questions:
                testQuestions.map(
                    (item) => ({
                        ...item.Question.toJSON(),

                        questionOrder:
                            item.questionOrder,
                    })
                ),
        });

    } catch (error) {
        console.error(
            "Get Test Questions Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Get Test Questions",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// --------------------------------
// PUBLISH TEST
// --------------------------------

const publishTest = async (req, res) => {
    try {
        const { id } = req.params;

        const test =
            await publishTestService(id);

        res.status(200).json({
            success: true,
            message:
                "Test Published Successfully",
            test,
        });

    } catch (error) {
        console.error(
            "Publish Test Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Publish Test",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// --------------------------------
// START TEST
// --------------------------------

const startTest = async (req, res) => {
    try {
        const { id } = req.params;

        const result =
            await getStartTestData(id);

        res.status(200).json({
            success: true,

            test: result.test,

            questions:
                result.questions,
        });

    } catch (error) {
        console.error(
            "Start Test Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Start Test",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// --------------------------------
// START TEST ATTEMPT
// --------------------------------

const startTestAttempt = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const userId =
            req.user.id;

        const result =
            await startTestAttemptService(
                id,
                userId
            );

        if (result.existing) {
            return res.status(200).json({
                success: true,

                message:
                    "Existing Test Attempt Found",

                attempt:
                    result.attempt,
            });
        }

        const attempt =
            result.attempt;

        res.status(201).json({
            success: true,

            message:
                "Test Attempt Started Successfully",

            attempt: {
                id: attempt.id,

                userId:
                    attempt.userId,

                testId:
                    attempt.testId,

                startedAt:
                    attempt.startedAt,

                status:
                    attempt.status,

                score:
                    attempt.score,

                totalMarks:
                    attempt.totalMarks,
            },
        });

    } catch (error) {
        console.error(
            "Start Test Attempt Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Start Test Attempt",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// --------------------------------
// SAVE STUDENT ANSWER
// --------------------------------

const saveAnswer = async (req, res) => {
    try {
        const {
            testId,
            attemptId,
        } = req.params;

        const {
            questionId,
            selectedAnswer,
        } = req.body;

       const userId = req.user.id;

const result =
    await saveAnswerService(
        testId,
        attemptId,
        questionId,
        selectedAnswer,
        userId
    );

        const answer =
            result.answer;

        res.status(
            result.created
                ? 201
                : 200
        ).json({
            success: true,

            message:
                result.created
                    ? "Answer Saved Successfully"
                    : "Answer Updated Successfully",

            answer: {
                id: answer.id,

                attemptId:
                    answer.attemptId,

                questionId:
                    answer.questionId,

                selectedAnswer:
                    answer.selectedAnswer,
            },
        });

    } catch (error) {
        console.error(
            "Save Answer Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,

            message:
                error.statusCode
                    ? error.message
                    : "Failed to Save Answer",

            error:
                error.statusCode
                    ? undefined
                    : error.message,
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