const logAIRequest = ({ model, systemPrompt, userPrompt }) => {

    console.log("\n==========================================");
    console.log("🤖 AI REQUEST");
    console.log("==========================================");

    console.log("\n📌 Model:");
    console.log(model);

    console.log("\n📌 System Prompt:");
    console.log(systemPrompt);

    if (userPrompt) {
        console.log("\n📌 User Prompt:");
        console.log(userPrompt);
    }

    console.log("\n==========================================");

};

const logAIResponse = ({ responseTime, usageMetadata }) => {

    console.log("\n✅ AI Response Generated");

    console.log(`⏱ Response Time : ${responseTime} ms`);

    if (usageMetadata) {

        console.log("\n📊 Token Usage");

        console.log(
            "Prompt Tokens:",
            usageMetadata.promptTokenCount
        );

        console.log(
            "Response Tokens:",
            usageMetadata.candidatesTokenCount
        );

        console.log(
            "Total Tokens:",
            usageMetadata.totalTokenCount
        );

    }

    console.log("==========================================\n");

};

const logAIError = (error) => {

    console.error("\n==========================================");
    console.error("❌ AI SERVICE ERROR");
    console.error("==========================================");

    console.error(error);

    console.error("==========================================\n");

};

module.exports = {
    logAIRequest,
    logAIResponse,
    logAIError
};