const getNotifications = (req, res) => {
    res.json({
        message: "Get all notifications"
    });
};

const getNotificationById = (req, res) => {
    res.json({
        message: `Get notification ${req.params.id}`
    });
};

const createNotification = (req, res) => {
    res.json({
        message: "Notification created successfully",
        data: req.body
    });
};

const updateNotification = (req, res) => {
    res.json({
        message: `Notification ${req.params.id} updated successfully`,
        data: req.body
    });
};

const deleteNotification = (req, res) => {
    res.json({
        message: `Notification ${req.params.id} deleted successfully`
    });
};

module.exports = {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification
};