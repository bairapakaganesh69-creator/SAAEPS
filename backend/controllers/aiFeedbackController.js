const TestAttempt = require("../models/TestAttempt");

const {
    getAttemptAnswers,
    calculateTopicPerformance,
} = require("../services/performance.service");

const {
    generateAIFeedback,
} = require("../services/aiFeedbackService");

const getAIFeedback = async (req, res) => {
    try {
        // Logged-in student's ID
        const userId = req.user.id;

        // Get submitted attempts
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

                feedback: {
                    overallMessage:
                        "Attempt more tests so we can understand your performance better.",

                    summary: {
                        totalTopicsAnalyzed: 0,
                        weakTopics: 0,
                        needsImprovement: 0,
                        goodTopics: 0,
                        notEnoughData: 0,
                    },

                    recommendations: [],

                    weakTopics: [],
                    improvementTopics: [],
                    goodTopics: [],
                    insufficientDataTopics: [],
                },
            });
        }

        // Get attempt IDs
        const attemptIds = attempts.map(
            (attempt) => attempt.id
        );

        // Get answers using shared performance service
        const answers =
            await getAttemptAnswers(
                attemptIds
            );

        // Calculate topic performance
        const analyzedTopics =
            calculateTopicPerformance(
                answers
            );

        // Generate feedback
        const feedback =
            generateAIFeedback(
                analyzedTopics
            );

        // Send response
        res.status(200).json({
            success: true,
            feedback,
        });

    } catch (error) {
        console.error(
            "Get AI Feedback Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Generate AI Feedback",
            error: error.message,
        });
    }
};

module.exports = {
    getAIFeedback,
};