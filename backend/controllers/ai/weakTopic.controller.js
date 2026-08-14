const {
    analyzeWeakTopics
} = require("../../services/analysis/weakTopic.service");

const {
    sendSuccessResponse,
    sendErrorResponse
} = require("../../utils/ai/aiResponseFormatter");


const weakTopicAnalyzer = async (req, res) => {

    try {

        const {
            subject,
            totalMarks,
            obtainedMarks,
            chapterScores
        } = req.body;


        const result = analyzeWeakTopics({
            subject,
            totalMarks: Number(totalMarks),
            obtainedMarks: Number(obtainedMarks),
            chapterScores
        });


        return sendSuccessResponse(
            res,
            result
        );

    } catch (error) {

        console.error(
            "❌ Weak Topic Analysis Error:",
            error.message
        );

        return sendErrorResponse(
            res,
            error.message ||
                "Failed to analyze weak topics.",
            400
        );
    }

};


module.exports = {
    weakTopicAnalyzer
};