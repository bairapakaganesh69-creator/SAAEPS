
const {
  generateAITutorResponse,
} = require("../services/aiTutorService");

const chatWithAITutor = async (req, res) => {
  try {
    const body = req.body || {};
    const { message, subject, topic } = body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    if (
      subject !== undefined &&
      typeof subject !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject must be text.",
      });
    }

    if (
      topic !== undefined &&
      typeof topic !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Topic must be text.",
      });
    }

    const reply = await generateAITutorResponse(
      message,
      {
        subject,
        topic,
      }
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "AI Tutor Controller Error:",
      error.message
    );

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 504
          ? error.message
          : statusCode < 500
            ? error.message
            : "Failed to get an AI Tutor response. Please try again.",
    });
  }
};

module.exports = {
  chatWithAITutor,
};
