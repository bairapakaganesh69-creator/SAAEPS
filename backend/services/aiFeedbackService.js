const generateAIFeedback = (analyzedTopics) => {
    const weakTopics = analyzedTopics.filter(
        (topic) => topic.status === "Weak"
    );

    const improvementTopics = analyzedTopics.filter(
        (topic) => topic.status === "Needs Improvement"
    );

    const goodTopics = analyzedTopics.filter(
        (topic) => topic.status === "Good"
    );

    const insufficientDataTopics = analyzedTopics.filter(
        (topic) => topic.status === "Not Enough Data"
    );

    let overallMessage;

    if (weakTopics.length > 0) {
        overallMessage =
            "You have some weak areas that need focused attention. Start with the high-priority topics below.";
    } else if (improvementTopics.length > 0) {
        overallMessage =
            "Your performance is progressing, but a few topics need more practice to become strong areas.";
    } else if (goodTopics.length > 0) {
        overallMessage =
            "Great job! You are performing well. Keep practicing to maintain and improve your score.";
    } else {
        overallMessage =
            "Attempt more tests so we can understand your performance better.";
    }

    const recommendations = [];

    // Weak topics
    weakTopics.forEach((topic) => {
        recommendations.push({
            subject: topic.subject,
            topic: topic.topic,
            priority: "High",
            accuracy: topic.accuracy,

            message:
                `Your accuracy in ${topic.topic} is ${topic.accuracy}%. ` +
                `This is currently a weak area. Revise the basic concepts first, ` +
                `then practice more questions from this topic.`,
        });
    });

    // Improvement topics
    improvementTopics.forEach((topic) => {
        recommendations.push({
            subject: topic.subject,
            topic: topic.topic,
            priority: "Medium",
            accuracy: topic.accuracy,

            message:
                `Your accuracy in ${topic.topic} is ${topic.accuracy}%. ` +
                `You understand the basics, but you need more practice. ` +
                `Try solving 10–15 questions from this topic.`,
        });
    });

    // Good topics
    goodTopics.forEach((topic) => {
        recommendations.push({
            subject: topic.subject,
            topic: topic.topic,
            priority: "Low",
            accuracy: topic.accuracy,

            message:
                `Excellent work in ${topic.topic}! ` +
                `Your accuracy is ${topic.accuracy}%. ` +
                `Keep practicing medium and hard questions to improve further.`,
        });
    });

    // Not enough data
    insufficientDataTopics.forEach((topic) => {
        recommendations.push({
            subject: topic.subject,
            topic: topic.topic,
            priority: "Low",
            accuracy: topic.accuracy,

            message:
                `There is not enough data for ${topic.topic}. ` +
                `Attempt at least 3 questions from this topic so your performance can be analyzed.`,
        });
    });

    return {
        overallMessage,

        summary: {
            totalTopicsAnalyzed: analyzedTopics.length,
            weakTopics: weakTopics.length,
            needsImprovement: improvementTopics.length,
            goodTopics: goodTopics.length,
            notEnoughData: insufficientDataTopics.length,
        },

        recommendations,

        weakTopics,
        improvementTopics,
        goodTopics,
        insufficientDataTopics,
    };
};

module.exports = {
    generateAIFeedback,
};