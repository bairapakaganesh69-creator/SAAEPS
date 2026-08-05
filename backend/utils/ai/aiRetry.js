const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const retryAIRequest = async (
    aiFunction,
    maxRetries = 3,
    delay = 2000
) => {

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(`🔄 AI Attempt ${attempt}/${maxRetries}`);

            return await aiFunction();

        } catch (error) {

            lastError = error;

            const status = error.status || error.code;

            // Retry only temporary AI errors
            if (
                status === 429 ||
                status === 500 ||
                status === 503
            ) {

                console.log(
                    `⚠ Gemini unavailable. Retrying in ${delay / 1000}s...`
                );

                await sleep(delay);

                continue;
            }

            // Don't retry other errors
            throw error;
        }
    }

    throw lastError;
};

module.exports = {
    retryAIRequest
};