const parseAIResponse = (response) => {

    if (response === null || response === undefined || response === "") {
        const error = new Error("AI response is empty.");
        error.code = "AI_INVALID_JSON";
        throw error;
    }

    if (typeof response === "object") {
        return response;
    }

    if (typeof response !== "string") {
        const error = new Error("AI response must be a JSON object.");
        error.code = "AI_INVALID_JSON";
        throw error;
    }

    const cleaned = response
        .replace(/^```(?:json)?\s*/gi, "")
        .replace(/```\s*$/g, "")
        .trim();

    try {
        const parsed = JSON.parse(cleaned);

        if (
            parsed === null ||
            (typeof parsed !== "object" && typeof parsed !== "boolean")
        ) {
            const error = new Error("AI response must be a JSON object or array.");
            error.code = "AI_INVALID_JSON";
            throw error;
        }

        return parsed;

    } catch (error) {

        console.error("\n==========================================");
        console.error("❌ AI RESPONSE PARSER ERROR");
        console.error("==========================================");
        console.error(error.message);
        console.error("==========================================\n");

        const parserError = new Error(
            "AI response was not valid JSON."
        );

        parserError.code = "AI_INVALID_JSON";
        parserError.originalError = error;
        throw parserError;
    }

};

module.exports = {
    parseAIResponse
};