const { generateResponse } = require("../../ai/services/ai.service");
const plannerPrompt = require("../../ai/prompts/planner.prompt");
const { parseAIResponse } = require("../../utils/responseParser");

const studyPlanner = async (req, res) => {
    try {

        const {
            studentName,
            goal,
            subject,
            durationDays,
            studyHoursPerDay,
            weakTopics
        } = req.body;

        const prompt = `
Student Name: ${studentName}

Goal: ${goal}

Subject: ${subject}

Duration (Days): ${durationDays}

Study Hours Per Day: ${studyHoursPerDay}

Weak Topics:
${JSON.stringify(weakTopics, null, 2)}
`;

        const aiResponse = await generateResponse(
            plannerPrompt,
            prompt
        );

        const parsedResponse = parseAIResponse(aiResponse);

        res.status(200).json({
            success: true,
            response: parsedResponse
        });

    } catch (error) {

        console.error("Study Planner Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate study plan."
        });

    }
};

module.exports = {
    studyPlanner,
};