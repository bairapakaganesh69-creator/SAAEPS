const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

console.log("========== SERVER STARTED ==========");
console.log(__filename);

const sequelize = require("./config/db");

// Load models and associations
require("./models");
require("./models/associations");

// Routes
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/ai.routes");

const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const questionRoutes = require("./routes/questionRoutes");
const testRoutes = require("./routes/testRoutes");
const resultRoutes = require("./routes/resultRoutes");
const testAttemptRoutes = require("./routes/testAttemptRoutes");

console.log("✅ authRoutes loaded");
console.log("✅ aiRoutes loaded");
console.log("✅ subjectRoutes loaded");
console.log("✅ topicRoutes loaded");
console.log("✅ questionRoutes loaded");
console.log("✅ testRoutes loaded");
console.log("✅ resultRoutes loaded");
console.log("✅ testAttemptRoutes loaded");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Authentication
app.use("/api/auth", authRoutes);

// AI
app.use("/api/ai", aiRoutes);

// Question Bank
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);

// Mock Tests
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/test-attempts", testAttemptRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Welcome to SAAEPS Backend");
});

// Database connection
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ MySQL Connected Successfully");
        return sequelize.sync();
    })
    .then(() => {
        console.log("✅ Database Synchronized");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err.message);
        process.exit(1);
    });