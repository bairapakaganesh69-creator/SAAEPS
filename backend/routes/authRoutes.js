const express = require("express");

const router = express.Router();

const { registerUser } = require("../controllers/authController");
const { registerValidation } = require("../validators/authValidator");

router.post(
    "/register",
    registerValidation,
    registerUser
);

module.exports = router;