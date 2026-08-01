const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {

        // Validate Input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        // Encrypt Password
const hashedPassword = await bcrypt.hash(password, 10);

console.log("Original Password:", password);
console.log("Hashed Password:", hashedPassword);
// Save User into Database
const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
});
        // For now, just return success
    res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    },
});
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    registerUser,
};