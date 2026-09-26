const db = require("../config/db");

// Get all faculty
exports.getFaculty = (req, res) => {
    const sql = "SELECT * FROM faculty";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching faculty",
                error: err.message
            });
        }

        res.json({
            success: true,
            faculty: results
        });
    });
};

// Get faculty by ID
exports.getFacultyById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM faculty WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching faculty",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.json({
            success: true,
            faculty: results[0]
        });
    });
};

// Add faculty
exports.createFaculty = (req, res) => {
    const { name, email, phone, department } = req.body;

    if (!name || !email || !department) {
        return res.status(400).json({
            success: false,
            message: "Name, email and department are required"
        });
    }

    const sql =
        "INSERT INTO faculty (name, email, phone, department) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [name, email, phone, department],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error adding faculty",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Faculty added successfully",
                facultyId: result.insertId
            });
        }
    );
};

// Update faculty
exports.updateFaculty = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, department } = req.body;

    const sql =
        "UPDATE faculty SET name=?, email=?, phone=?, department=? WHERE id=?";

    db.query(
        sql,
        [name, email, phone, department, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating faculty",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Faculty not found"
                });
            }

            res.json({
                success: true,
                message: "Faculty updated successfully"
            });
        }
    );
};

// Delete faculty
exports.deleteFaculty = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM faculty WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting faculty",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.json({
            success: true,
            message: "Faculty deleted successfully"
        });
    });
};