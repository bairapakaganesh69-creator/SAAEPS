const {
    getDashboardData,
} = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
    try {
        // Logged-in student's ID
        const userId = req.user.id;

        // Get dashboard data from service
        const dashboard =
            await getDashboardData(userId);

        return res.status(200).json({
            success: true,
            dashboard,
        });

    } catch (error) {
        console.error(
            "Get Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to Get Dashboard",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboard,
};