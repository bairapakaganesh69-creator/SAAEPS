const { generateResponse } = require("../ai/services/ai.service");
const tutorPrompt = require("../ai/prompts/tutor.prompt");

const tutorChat = async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("REQ BODY:", req.body);
        console.log("PROMPT:", prompt);

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        const response = await generateResponse(
            tutorPrompt,
            prompt
        );

        res.status(200).json({
            success: true,
            response,
        });

    } catch (error) {
        console.error("AI Controller Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
        });
    }
};

module.exports = {
    tutorChat,
};