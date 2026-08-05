const { generateResponse } = require("../../ai/services/ai.service");
const feedbackPrompt = require("../../ai/prompts/feedback.prompt");

const feedbackGenerator = async (req, res) => {

    try {

        const {
            studentName,
            subject,
            percentage,
            weakTopics,
            strongTopics,
        } = req.body;

        const feedbackData = `
Student Name: ${studentName}

Subject: ${subject}

Percentage: ${percentage}

Weak Topics:
${JSON.stringify(weakTopics, null, 2)}

Strong Topics:
${JSON.stringify(strongTopics, null, 2)}
`;

        const response = await generateResponse(
            feedbackPrompt,
            feedbackData
        );

        res.status(200).json({
            success: true,
            response,
        });

    } catch (error) {

        console.error("Feedback Generator Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate feedback",
        });

    }

};

module.exports = {
    feedbackGenerator,
};