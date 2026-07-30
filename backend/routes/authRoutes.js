console.log("✅ authRoutes.js executed");
const express = require("express");

const router = express.Router();

const { registerUser } = require("../controllers/authController");

router.post("/register", registerUser);

module.exports = router;