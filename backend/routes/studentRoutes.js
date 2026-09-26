const express = require("express");

const router = express.Router();

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// Get all students
router.get("/", getStudents);

// Get student by ID
router.get("/:id", getStudentById);

// Add student
router.post("/", createStudent);

// Update student
router.put("/:id", updateStudent);

// Delete student
router.delete("/:id", deleteStudent);

module.exports = router;