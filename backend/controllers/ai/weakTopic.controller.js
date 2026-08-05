const { generateResponse } = require("../../ai/services/ai.service");
const weakTopicPrompt = require("../../ai/prompts/weakTopic.prompt");

const weakTopicAnalyzer = async (req, res) => {

    try {

        const {
            subject,
            totalMarks,
            obtainedMarks,
            chapterScores,
        } = req.body;

        const quizData = `
Subject: ${subject}

Total Marks: ${totalMarks}

Obtained Marks: ${obtainedMarks}

Chapter Scores:

${JSON.stringify(chapterScores, null, 2)}
`;

        const response = await generateResponse(
            weakTopicPrompt,
            quizData
        );

        res.status(200).json({
            success: true,
            response,
        });

    } catch (error) {

        console.error("Weak Topic Analyzer Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to analyze quiz performance",
        });

    }

};

module.exports = {
    weakTopicAnalyzer,
};