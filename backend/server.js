
const express = require("express");
console.log("========== SERVER STARTED ==========");
console.log(__filename);
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to SAAEPS Backend 🚀");
});

const User = require("./models/User");

// Connect Database and Create Tables
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
    console.log("❌ Database Connection Failed");
    console.error(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});