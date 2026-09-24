const { sendErrorResponse } = require("./aiResponseFormatter");

const statusMap = {
    AI_INVALID_JSON: 500,
    AI_PROVIDER_ERROR: 502,
    AI_PROVIDER_FAILED: 502,
    AI_SERVICE_UNAVAILABLE: 503,
    AI_TIMEOUT: 504,
    AI_RATE_LIMIT: 429,
    VALIDATION_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
};

const resolveStatusCode = (error) => {
    if (typeof error?.statusCode === "number") {
        return error.statusCode;
    }

    if (typeof error?.status === "number") {
        return error.status;
    }

    if (typeof error?.code === "string") {
        const mapped = statusMap[error.code];
        if (mapped) {
            return mapped;
        }

        const numericCode = Number(error.code);
        if (Number.isFinite(numericCode)) {
            return numericCode;
        }
    }

    return 500;
};

const handleAIError = (res, error) => {

    if (res.headersSent) {
        return res.end();
    }

    console.error("\n==========================================");
    console.error("❌ AI ERROR HANDLER");
    console.error("==========================================");
    console.error(error?.message || error);
    console.error("==========================================\n");

    const status = resolveStatusCode(error);
    const message = error?.message || "An unexpected AI error occurred.";

    switch (status) {

        case 400:
            return sendErrorResponse(
                res,
                message || "Invalid AI request.",
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
                message || "AI service encountered an internal error.",
                500
            );

        case 502:
            return sendErrorResponse(
                res,
                message || "AI provider failed to generate a response.",
                502
            );

        case 503:
            return sendErrorResponse(
                res,
                "AI service is temporarily unavailable. Please try again shortly.",
                503
            );

        case 504:
            return sendErrorResponse(
                res,
                "AI request timed out. Please try again.",
                504
            );

        default:
            return sendErrorResponse(
                res,
                message || "An unexpected AI error occurred.",
                status
            );

    }

};

module.exports = {
    handleAIError
};