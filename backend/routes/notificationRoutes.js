const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createNotificationController,
    getNotificationsController,
    getUnreadNotificationsController,
    getUnreadCountController,
    markNotificationAsReadController,
    deleteNotificationController,
} = require("../controllers/notificationController");

// Create notification
router.post(
    "/",
    authMiddleware,
    createNotificationController
);

// Get all notifications for logged-in user
router.get(
    "/",
    authMiddleware,
    getNotificationsController
);

// Get unread notifications
router.get(
    "/unread",
    authMiddleware,
    getUnreadNotificationsController
);

// Get unread notification count
router.get(
    "/unread/count",
    authMiddleware,
    getUnreadCountController
);

// Mark notification as read
router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsReadController
);

// Delete notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotificationController
);

module.exports = router;