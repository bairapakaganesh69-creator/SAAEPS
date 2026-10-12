const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");

// Load associations
require("./models/associations");

// Routes
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const questionRoutes = require("./routes/questionRoutes");
const testRoutes = require("./routes/testRoutes");
const resultRoutes = require("./routes/resultRoutes");
const testAttemptRoutes = require("./routes/testAttemptRoutes");
const weakTopicRoutes = require("./routes/weakTopicRoutes");
const aiFeedbackRoutes = require("./routes/aiFeedbackRoutes");
const aiTutorRoutes = require("./routes/aiTutorRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const aiRoutes = require("./routes/ai.routes");
const {
    startLlamaCpp,
    stopLlamaCpp,
} = require("./ai/services/llamaCppManager");

const app = express();

// --------------------------------
// MIDDLEWARES
// --------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------
// ROUTES
// --------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/test-attempts", testAttemptRoutes);
app.use("/api/weak-topics", weakTopicRoutes);
app.use("/api/ai-feedback", aiFeedbackRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai", aiRoutes);

// --------------------------------
// ROOT ROUTE
// --------------------------------

app.get("/", (req, res) => {
    res.send("Welcome to SAAEPS Backend 🚀");
});

// --------------------------------
// DATABASE + SERVER
// --------------------------------

const PORT = process.env.PORT || 5000;
let server = null;

const startServer = async () => {
    try {
        await startLlamaCpp();

        await sequelize.authenticate();

        console.log("✅ MySQL Connected Successfully");

        await sequelize.sync();

        console.log("✅ Database Synchronized");

        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server Startup Failed:", error.message);
        try {
            await stopLlamaCpp();
        } catch (cleanupError) {
            console.error("llama.cpp cleanup error:", cleanupError.message);
        }
        process.exitCode = 1;
    }
};

const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down SAAEPS...`);

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    try {
        await stopLlamaCpp();
    } catch (error) {
        console.error("llama.cpp shutdown error:", error.message);
    }

    process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer();
