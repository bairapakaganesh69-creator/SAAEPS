const TestAttempt = require("../models/TestAttempt");

const {
    getAttemptAnswers,
    calculateTopicPerformance,
    getWeakTopics,
} = require("../services/performance.service");

const getWeakTopicsAnalysis = async (req, res) => {
    try {
        // Logged-in student's ID
        const userId = req.user.id;

        // Get all submitted attempts of this student
        const attempts = await TestAttempt.findAll({
            where: {
                userId,
                status: "Submitted",
            },
        });

        // No submitted tests
        if (attempts.length === 0) {
            return res.status(200).json({
                success: true,

                message: "No submitted tests found.",

                summary: {
                    totalTopicsAnalyzed: 0,
                    weakTopics: 0,
                    needsImprovement: 0,
                    goodTopics: 0,
                },

                weakTopics: [],
                improvementTopics: [],
                goodTopics: [],
                allTopics: [],
            });
        }

        // Get attempt IDs
        const attemptIds = attempts.map(
            (attempt) => attempt.id
        );

        // Get all answers with Question → Topic + Subject
        const answers = await getAttemptAnswers(
            attemptIds
        );

        // Calculate topic-wise performance
        const analyzedTopics =
            calculateTopicPerformance(answers);

        // Get weak topics
        const weakTopics =
            getWeakTopics(analyzedTopics);

        // Get improvement topics
        const improvementTopics =
            analyzedTopics.filter(
                (topic) =>
                    topic.status === "Needs Improvement"
            );

        // Get good topics
        const goodTopics =
            analyzedTopics.filter(
                (topic) => topic.status === "Good"
            );

        // Send response
        res.status(200).json({
            success: true,

            summary: {
                totalTopicsAnalyzed:
                    analyzedTopics.length,

                weakTopics:
                    weakTopics.length,

                needsImprovement:
                    improvementTopics.length,

                goodTopics:
                    goodTopics.length,
            },

            weakTopics,

            improvementTopics,

            goodTopics,

            allTopics: analyzedTopics,
        });

    } catch (error) {
        console.error(
            "Get Weak Topics Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Analyze Weak Topics",
            error: error.message,
        });
    }
};

module.exports = {
    getWeakTopicsAnalysis,
};