const { sendErrorResponse } = require("./aiResponseFormatter");

const handleAIError = (res, error) => {

    console.error("\n==========================================");
    console.error("❌ AI ERROR HANDLER");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================\n");

    const status = error.status || error.code;

    switch (status) {

        case 400:
            return sendErrorResponse(
                res,
                "Invalid AI request.",
                400
            );

        case 401:
            return sendErrorResponse(
                res,
                "Unauthorized AI request.",
                401
            );

        case 403:
            return sendErrorResponse(
                res,
                "Access denied to AI service.",
                403
            );

        case 404:
            return sendErrorResponse(
                res,
                "AI model not found.",
                404
            );

        case 429:
            return sendErrorResponse(
                res,
                "AI rate limit exceeded. Please try again in a few moments.",
                429
            );

        case 500:
            return sendErrorResponse(
                res,
                "AI service encountered an internal error.",
                500
            );

        case 503:
            return sendErrorResponse(
                res,
                "AI service is temporarily unavailable. Please try again shortly.",
                503
            );

        default:
            return sendErrorResponse(
                res,
                "An unexpected AI error occurred.",
                500
            );

    }

};

module.exports = {
    handleAIError
};