const db = require("../config/db");

// Get all students
exports.getStudents = (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching students",
                error: err
            });
        }

        res.json({
            success: true,
            students: results
        });
    });
};

// Get student by ID
exports.getStudentById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching student"
            });
        }

        res.json({
            success: true,
            student: results[0]
        });
    });
};

// Add student
exports.createStudent = (req, res) => {
    const { name, email, phone, course } = req.body;

    const sql =
        "INSERT INTO students (name, email, phone, course) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, phone, course], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error adding student",
                error: err
            });
        }

        res.json({
            success: true,
            message: "Student added successfully",
            studentId: result.insertId
        });
    });
};

// Update student
exports.updateStudent = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, course } = req.body;

    const sql =
        "UPDATE students SET name=?, email=?, phone=?, course=? WHERE id=?";

    db.query(sql, [name, email, phone, course, id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating student"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully"
        });
    });
};

// Delete student
exports.deleteStudent = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting student"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });
    });
};