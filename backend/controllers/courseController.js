const db = require("../config/db");

// Get all courses
exports.getCourses = (req, res) => {
    const sql = "SELECT * FROM courses";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching courses",
                error: err.message
            });
        }

        res.json({
            success: true,
            courses: results
        });
    });
};

// Get course by ID
exports.getCourseById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM courses WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching course",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.json({
            success: true,
            course: results[0]
        });
    });
};

// Add course
exports.createCourse = (req, res) => {
    const { name, code, description, credits } = req.body;

    if (!name || !code) {
        return res.status(400).json({
            success: false,
            message: "Course name and code are required"
        });
    }

    const sql =
        "INSERT INTO courses (name, code, description, credits) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [name, code, description, credits],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error adding course",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Course added successfully",
                courseId: result.insertId
            });
        }
    );
};

// Update course
exports.updateCourse = (req, res) => {
    const { id } = req.params;
    const { name, code, description, credits } = req.body;

    const sql =
        "UPDATE courses SET name=?, code=?, description=?, credits=? WHERE id=?";

    db.query(
        sql,
        [name, code, description, credits, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating course",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }

            res.json({
                success: true,
                message: "Course updated successfully"
            });
        }
    );
};

// Delete course
exports.deleteCourse = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM courses WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting course",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.json({
            success: true,
            message: "Course deleted successfully"
        });
    });
};