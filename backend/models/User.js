
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    authProvider: {
      type: DataTypes.ENUM("local", "google"),
      allowNull: false,
      defaultValue: "local",
    },

    passwordSetupRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    role: {
      type: DataTypes.ENUM("student", "admin"),
      defaultValue: "student",
    },

    // Student profile information
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Exam preferences
    examType: {
      type: DataTypes.ENUM("ECET", "POLYCET"),
      allowNull: true,
    },

    branch: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Email verification
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verificationOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Password reset
    resetOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetOTPExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resetOTPVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
    indexes: [
      {
        name: "users_googleId_unique",
        unique: true,
        fields: ["googleId"],
      },
    ],
  }
);

module.exports = User;
