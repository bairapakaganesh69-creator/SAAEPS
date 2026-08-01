const { validationResult } = require("express-validator");

const registerUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    res.status(200).json({
        success: true,
        message: "Validation Successful",
        data: req.body,
    });

};

module.exports = {
    registerUser,
};