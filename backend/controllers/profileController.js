const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Get admin profile
exports.getProfile = (req, res) => {
    const adminId = req.user.id;

    const sql = `
        SELECT id, name, email, phone, profile_picture
        FROM admins
        WHERE id = ?
    `;

    db.query(sql, [adminId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching profile",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        res.json({
            success: true,
            profile: results[0]
        });
    });
};

// Update admin profile
exports.updateProfile = (req, res) => {
    const adminId = req.user.id;
    const { name, email, phone } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    const sql = `
        UPDATE admins
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, phone, adminId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating profile",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Profile updated successfully"
            });
        }
    );
};

// Change admin password
exports.changePassword = (req, res) => {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password are required"
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "New password must contain at least 6 characters"
        });
    }

    const sql = "SELECT password FROM admins WHERE id = ?";

    db.query(sql, [adminId], async (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            results[0].password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query(
            "UPDATE admins SET password = ? WHERE id = ?",
            [hashedPassword, adminId],
            (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({
                        success: false,
                        message: "Error changing password",
                        error: updateErr.message
                    });
                }

                res.json({
                    success: true,
                    message: "Password changed successfully"
                });
            }
        );
    });
};