const express = require("express");
const router = express.Router();

const { tutorChat } = require("../controllers/ai.controller");

// AI Tutor Route
router.post("/tutor", tutorChat);

module.exports = router;