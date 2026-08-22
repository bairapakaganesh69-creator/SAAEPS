const Notification = require("../models/Notification");

const createNotification = async ({
    userId,
    title,
    message,
    type = "general",
}) => {
    return await Notification.create({
        userId,
        title,
        message,
        type,
    });
};

const getUserNotifications = async (userId) => {
    return await Notification.findAll({
        where: {
            userId,
        },
        order: [
            ["createdAt", "DESC"],
        ],
    });
};

const getUnreadNotifications = async (userId) => {
    return await Notification.findAll({
        where: {
            userId,
            isRead: false,
        },
        order: [
            ["createdAt", "DESC"],
        ],
    });
};

const getUnreadCount = async (userId) => {
    return await Notification.count({
        where: {
            userId,
            isRead: false,
        },
    });
};

const markAsRead = async (
    notificationId,
    userId
) => {
    const notification =
        await Notification.findOne({
            where: {
                id: notificationId,
                userId,
            },
        });

    if (!notification) {
        return null;
    }

    notification.isRead = true;

    await notification.save();

    return notification;
};

const deleteNotification = async (
    notificationId,
    userId
) => {
    const deleted =
        await Notification.destroy({
            where: {
                id: notificationId,
                userId,
            },
        });

    return deleted > 0;
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    deleteNotification,
};