const db = require("../config/db");

// Get all exams
exports.getExams = (req, res) => {
    const sql = "SELECT * FROM exams";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching exams",
                error: err.message
            });
        }

        res.json({
            success: true,
            exams: results
        });
    });
};

// Get exam by ID
exports.getExamById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM exams WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching exam",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        res.json({
            success: true,
            exam: results[0]
        });
    });
};

// Create exam
exports.createExam = (req, res) => {
    const {
        name,
        course_id,
        exam_date,
        start_time,
        end_time,
        total_marks
    } = req.body;

    if (!name || !course_id || !exam_date) {
        return res.status(400).json({
            success: false,
            message: "Exam name, course and exam date are required"
        });
    }

    const sql = `
        INSERT INTO exams
        (name, course_id, exam_date, start_time, end_time, total_marks)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            course_id,
            exam_date,
            start_time,
            end_time,
            total_marks
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error creating exam",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Exam created successfully",
                examId: result.insertId
            });
        }
    );
};

// Update exam
exports.updateExam = (req, res) => {
    const { id } = req.params;

    const {
        name,
        course_id,
        exam_date,
        start_time,
        end_time,
        total_marks
    } = req.body;

    const sql = `
        UPDATE exams
        SET name=?,
            course_id=?,
            exam_date=?,
            start_time=?,
            end_time=?,
            total_marks=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            course_id,
            exam_date,
            start_time,
            end_time,
            total_marks,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating exam",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Exam not found"
                });
            }

            res.json({
                success: true,
                message: "Exam updated successfully"
            });
        }
    );
};

// Publish exam
exports.publishExam = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE exams
        SET status = 'published'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error publishing exam",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        res.json({
            success: true,
            message: "Exam published successfully"
        });
    });
};

// Delete exam
exports.deleteExam = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM exams WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting exam",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        res.json({
            success: true,
            message: "Exam deleted successfully"
        });
    });
};