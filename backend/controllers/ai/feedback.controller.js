const { generateResponse } = require("../../ai/services/ai.service");
const feedbackPrompt = require("../../ai/prompts/feedback.prompt");

const {
    analyzeFeedback
} = require("../../services/analysis/feedback.service");

const {
    parseAIResponse
} = require("../../utils/ai/aiJsonParser");

const {
    sendSuccessResponse,
    sendErrorResponse
} = require("../../utils/ai/aiResponseFormatter");


const feedbackGenerator = async (req, res) => {

    try {

        const {
            studentName,
            subject,
            percentage,
            weakTopics,
            strongTopics
        } = req.body;


        // ------------------------------------------
        // STEP 1: Deterministic performance analysis
        // ------------------------------------------

        const analysis = analyzeFeedback({
            studentName,
            subject,
            percentage,
            weakTopics,
            strongTopics
        });


        // ------------------------------------------
        // STEP 2: AI only generates natural language
        // ------------------------------------------

        const feedbackData = `
Student Name:
${analysis.studentName}

Subject:
${analysis.subject}

Percentage:
${analysis.percentage}

Performance Level:
${analysis.performanceLevel}

Strengths:
${JSON.stringify(
    analysis.strengths,
    null,
    2
)}

Areas for Improvement:
${JSON.stringify(
    analysis.areasForImprovement,
    null,
    2
)}
`;


        const aiResponse = await generateResponse(
            feedbackPrompt,
            feedbackData
        );


        // ------------------------------------------
        // STEP 3: Normalize AI response
        // ------------------------------------------

        const parsedResponse =
            parseAIResponse(aiResponse);


        return sendSuccessResponse(
            res,
            {
                analysis,
                feedback: parsedResponse
            }
        );

    } catch (error) {

        console.error(
            "Feedback Generator Error:",
            error
        );

        return sendErrorResponse(
            res,
            error.message ||
                "Failed to generate feedback.",
            400
        );

    }

};


module.exports = {
    feedbackGenerator
};