const parseAIResponse = (response) => {

    try {

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch(error) {

        console.log("AI JSON Parse Error:", error);

        return response;
    }
};


module.exports = {
    parseAIResponse
};