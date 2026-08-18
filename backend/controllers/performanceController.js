const TestAttempt = require("../models/TestAttempt");
const Test = require("../models/Test");

const {
    getAttemptAnswers,
    calculateOverallPerformance,
    calculateTestPerformance,
    calculateSubjectPerformance,
    calculateTopicPerformance,
    getStrongestTopic,
    getWeakestTopic,
    calculateAnswerStatistics,
    getTotalQuestionsForAttempts,
} = require("../services/performance.service");

const getPerformanceAnalysis = async (
    req,
    res
) => {
    try {
        // Logged-in student's ID
        const userId = req.user.id;

        // Get submitted attempts
        const attempts =
            await TestAttempt.findAll({
                where: {
                    userId,
                    status: "Submitted",
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

                order: [
                    ["submittedAt", "ASC"],
                ],
            });

        // No submitted tests
        if (attempts.length === 0) {
            return res.status(200).json({
                success: true,

                message:
                    "No submitted tests found.",

                performance: {
                    overview: {
                        testsAttempted: 0,
                        totalScore: 0,
                        totalMarks: 0,
                        averageScore: 0,
                        averagePercentage: 0,
                    },

                    answers: {
                        totalQuestions: 0,
                        answered: 0,
                        correct: 0,
                        wrong: 0,
                        unanswered: 0,
                    },

                    subjectPerformance: [],

                    testPerformance: [],

                    strongestTopic: null,

                    weakestTopic: null,

                    improvementTrend: [],
                },
            });
        }

        // Attempt IDs
        const attemptIds =
            attempts.map(
                (attempt) => attempt.id
            );

        // Get answers
        const answers =
            await getAttemptAnswers(
                attemptIds
            );

        // Overall performance
        const overall =
            calculateOverallPerformance(
                attempts
            );

        // Total questions
        const totalQuestions =
            await getTotalQuestionsForAttempts(
                attempts
            );

        // Answer statistics
        const answerStatistics =
            calculateAnswerStatistics(
                answers,
                totalQuestions
            );

        // Subject performance
        const subjectPerformance =
            calculateSubjectPerformance(
                answers
            );

        // Test performance
        const testPerformance =
            calculateTestPerformance(
                attempts
            );

        // Topic performance
        const topicPerformance =
            calculateTopicPerformance(
                answers
            );

        // Strongest topic
        const strongestTopic =
            getStrongestTopic(
                topicPerformance
            );

        // Weakest topic
        const weakestTopic =
            getWeakestTopic(
                topicPerformance
            );

        // Improvement trend
        const improvementTrend =
            testPerformance.map(
                (test, index) => ({
                    testNumber: index + 1,

                    attemptId:
                        test.attemptId,

                    testTitle:
                        test.testTitle,

                    percentage:
                        test.percentage,

                    submittedAt:
                        test.submittedAt,
                })
            );

        // Final response
        return res.status(200).json({
            success: true,

            performance: {
                overview: {
                    testsAttempted:
                        attempts.length,

                    totalScore:
                        overall.totalScore,

                    totalMarks:
                        overall.totalMarks,

                    averageScore:
                        overall.averageScore,

                    averagePercentage:
                        overall.averagePercentage,
                },

                answers:
                    answerStatistics,

                subjectPerformance,

                testPerformance,

                strongestTopic,

                weakestTopic,

                improvementTrend,
            },
        });

    } catch (error) {
        console.error(
            "Get Performance Analysis Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to Get Performance Analysis",

            error: error.message,
        });
    }
};

module.exports = {
    getPerformanceAnalysis,
};