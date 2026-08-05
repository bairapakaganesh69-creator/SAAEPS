const parseAIResponse = (response) => {

    try {

        if (!response) {
            return null;
        }

        if (typeof response === "object") {
            return response;
        }

        const cleaned = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch (error) {

        console.error("\n==========================================");
        console.error("❌ AI RESPONSE PARSER ERROR");
        console.error("==========================================");
        console.error(error.message);
        console.error("==========================================\n");

        return response;
    }

};

module.exports = {
    parseAIResponse
};