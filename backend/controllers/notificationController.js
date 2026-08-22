const {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    deleteNotification,
} = require("../services/notification.service");

const createNotificationController = async (
    req,
    res
) => {
    try {
        const {
            title,
            message,
            type,
            userId,
        } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message:
                    "Title and message are required",
            });
        }

        const notification =
            await createNotification({
                userId:
                    userId || req.user.id,
                title,
                message,
                type,
            });

        return res.status(201).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error(
            "Create Notification Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create notification",
        });
    }
};

const getNotificationsController =
    async (req, res) => {
        try {
            const notifications =
                await getUserNotifications(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                notifications,
            });
        } catch (error) {
            console.error(
                "Get Notifications Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get notifications",
            });
        }
    };

const getUnreadNotificationsController =
    async (req, res) => {
        try {
            const notifications =
                await getUnreadNotifications(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                notifications,
            });
        } catch (error) {
            console.error(
                "Get Unread Notifications Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get unread notifications",
            });
        }
    };

const getUnreadCountController =
    async (req, res) => {
        try {
            const count =
                await getUnreadCount(
                    req.user.id
                );

            return res.status(200).json({
                success: true,
                count,
            });
        } catch (error) {
            console.error(
                "Get Unread Count Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to get unread count",
            });
        }
    };

const markNotificationAsReadController =
    async (req, res) => {
        try {
            const { id } = req.params;

            const notification =
                await markAsRead(
                    id,
                    req.user.id
                );

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Notification not found",
                });
            }

            return res.status(200).json({
                success: true,
                notification,
            });
        } catch (error) {
            console.error(
                "Mark Notification Read Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to mark notification as read",
            });
        }
    };

const deleteNotificationController =
    async (req, res) => {
        try {
            const { id } = req.params;

            const deleted =
                await deleteNotification(
                    id,
                    req.user.id
                );

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Notification not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Notification deleted successfully",
            });
        } catch (error) {
            console.error(
                "Delete Notification Error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete notification",
            });
        }
    };

module.exports = {
    createNotificationController,
    getNotificationsController,
    getUnreadNotificationsController,
    getUnreadCountController,
    markNotificationAsReadController,
    deleteNotificationController,
};