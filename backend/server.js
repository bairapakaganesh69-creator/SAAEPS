const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

console.log("========== SERVER STARTED ==========");
console.log(__filename);

const sequelize = require("./config/db");

// Import Models
require("./models/User");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/ai.routes");

console.log("✅ authRoutes loaded");
console.log("✅ aiRoutes loaded");

const app = express();

/* ==========================
   Middlewares
========================== */

app.use(cors());
app.use(express.json());

/* ==========================
   Routes
========================== */

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Welcome to SAAEPS Backend");
});

/* ==========================
   Database Connection
========================== */

sequelize
    .authenticate()
    .then(() => {
        console.log("✅ MySQL Connected Successfully");
        return sequelize.sync();
    })
    .then(() => {
        console.log("✅ Database Synchronized");
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err);
    });

/* ==========================
   Start Server
========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});