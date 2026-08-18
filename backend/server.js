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
const performanceRoutes = require("./routes/performanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

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
app.use("/api/performance", performanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

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

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log(
            "✅ MySQL Connected Successfully"
        );

        await sequelize.sync();

        console.log(
            "✅ Database Synchronized"
        );

        app.listen(PORT, () => {
            console.log(
                `🚀 Server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "❌ Server Startup Failed:",
            error.message
        );
    }
};

startServer();