const db = require("../config/db");

// Get all results
exports.getResults = (req, res) => {
    const sql = "SELECT * FROM results";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching results",
                error: err.message
            });
        }

        res.json({
            success: true,
            results: results
        });
    });
};

// Get result by ID
exports.getResultById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM results WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching result",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        res.json({
            success: true,
            result: results[0]
        });
    });
};

// Add result
exports.createResult = (req, res) => {
    const {
        student_id,
        exam_id,
        subject,
        marks,
        total_marks,
        grade
    } = req.body;

    if (!student_id || !exam_id || marks === undefined) {
        return res.status(400).json({
            success: false,
            message: "Student, exam and marks are required"
        });
    }

    const sql = `
        INSERT INTO results
        (student_id, exam_id, subject, marks, total_marks, grade)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_id,
            exam_id,
            subject,
            marks,
            total_marks,
            grade
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error adding result",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Result added successfully",
                resultId: result.insertId
            });
        }
    );
};

// Update result
exports.updateResult = (req, res) => {
    const { id } = req.params;

    const {
        student_id,
        exam_id,
        subject,
        marks,
        total_marks,
        grade
    } = req.body;

    const sql = `
        UPDATE results
        SET student_id=?,
            exam_id=?,
            subject=?,
            marks=?,
            total_marks=?,
            grade=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            student_id,
            exam_id,
            subject,
            marks,
            total_marks,
            grade,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating result",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Result not found"
                });
            }

            res.json({
                success: true,
                message: "Result updated successfully"
            });
        }
    );
};

// Delete result
exports.deleteResult = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM results WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting result",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        res.json({
            success: true,
            message: "Result deleted successfully"
        });
    });
};