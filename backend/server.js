const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
const sendEmail = require("./services/emailService");
const cors = require("cors");
const Subject = require("./models/Subject");
const Topic = require("./models/Topic");
const Question = require("./models/Question");
require("./models/associations");


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

console.log("========== SERVER STARTED ==========");
console.log(__filename);

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const questionRoutes = require("./routes/questionRoutes");
console.log("✅ authRoutes loaded");
console.log("✅ subjectRoutes loaded");
console.log("✅ topicRoutes loaded");
console.log("✅ questionRoutes loaded");

const User = require("./models/User");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to SAAEPS Backend 🚀");
});

// Connect Database and Create Tables
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ MySQL Connected Successfully");
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("✅ Database Synchronized");
        sendEmail(
    "saaeps.team@gmail.com",
    "SAAEPS Email Test",
    "Congratulations! 🎉 Your SAAEPS backend can send emails successfully."
);
    })
    
    .catch((err) => {
        console.log("❌ Database Connection Failed");
        console.error(err);
    });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});