const { generateAITutorResponse } = require("../../services/aiTutorService");

const tutorChat = async (req, res) => {
    try {
        const { prompt, subject, topic, question } = req.body;

        let userMessage = question || prompt;

        if (!userMessage || !userMessage.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        if (subject || topic) {
            userMessage = `
Subject: ${subject || "General"}
Topic: ${topic || "General"}

Student Question:
${userMessage}
`;
        }

        const reply = await generateAITutorResponse(userMessage);

        return res.status(200).json({
            success: true,
            data: {
                response: reply
            }
        });

    } catch (error) {
        console.error("AI Tutor Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected AI error occurred"
        });
    }
};

module.exports = { tutorChat };