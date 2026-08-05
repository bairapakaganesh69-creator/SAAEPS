const { generateResponse } = require("../../ai/services/ai.service");
const tutorPrompt = require("../../ai/prompts/tutor.prompt");

const tutorChat = async (req, res) => {

    try {

        const { prompt } = req.body;

        const response = await generateResponse(
            tutorPrompt,
            prompt
        );

        res.status(200).json({
            success: true,
            response
        });

    } catch (error) {

        console.error("Tutor Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate AI response"
        });

    }

};

module.exports = {
    tutorChat
};