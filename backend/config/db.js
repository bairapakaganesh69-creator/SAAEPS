const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("saaeps_db", "root", "", {
    host: "127.0.0.1",
    dialect: "mysql",
    logging: console.log
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connection established successfully.");
    } catch (error) {
        console.error("❌ Unable to connect:", error);
    }
})();

module.exports = sequelize;