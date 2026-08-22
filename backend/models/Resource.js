const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resource = sequelize.define(
    "Resource",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        topicId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        type: {
            type: DataTypes.ENUM(
                "PDF",
                "VIDEO",
                "NOTES",
                "LINK"
            ),
            allowNull: false,
        },

        fileUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        thumbnailUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        isPublished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        tableName: "resources",
    }
);

module.exports = Resource;