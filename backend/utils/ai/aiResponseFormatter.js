const sendSuccessResponse = (
    res,
    response,
    statusCode = 200
) => {

    return res.status(statusCode).json({
        success: true,
        response
    });

};

const sendErrorResponse = (
    res,
    message = "Something went wrong",
    statusCode = 500
) => {

    return res.status(statusCode).json({
        success: false,
        message
    });

};

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
};