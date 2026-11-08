const { getAttemptQuestions } = require("../services/attemptQuestion.service");

const getAttemptQuestionsController = async (req, res) => {
    try {
        const { testId, attemptId } = req.params;
        const questions = await getAttemptQuestions(
            testId,
            attemptId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error("Get Attempt Questions Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to load attempt questions",
        });
    }
};

module.exports = { getAttemptQuestionsController };
