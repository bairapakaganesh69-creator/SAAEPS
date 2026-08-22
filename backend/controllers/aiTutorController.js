const {
    generateAITutorResponse,
} = require("../services/aiTutorService");

const chatWithAITutor = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const reply =
            await generateAITutorResponse(
                message
            );

        res.status(200).json({
            success: true,
            reply,
        });

    } catch (error) {
        console.error(
            "AI Tutor Controller Error:",
            error
        );

        res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Failed to get AI Tutor response",
        });
    }
};

module.exports = {
    chatWithAITutor,
};