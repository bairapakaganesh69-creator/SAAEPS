const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AICache = sequelize.define(
    "AICache",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cacheKey: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },

        module: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        provider: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        model: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        prompt: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        systemPrompt: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },

        response: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },

        usage: {
            type: DataTypes.JSON,
            allowNull: true,
        },

        latency: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "ai_cache",
    }
);

module.exports = AICache;