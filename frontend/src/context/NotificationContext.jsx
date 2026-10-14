import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const NotificationContext = createContext(null);

const getNotificationIcon = (type) => {
  const icons = {
    test: "📝",
    result: "📊",
    study: "📚",
    resource: "📖",
    general: "🔔",
  };

  return icons[String(type || "general").toLowerCase()] || "🔔";
};

const formatNotificationTime = (date) => {
  if (!date) return "Recently";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "Recently";

  const difference = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(timestamp).toLocaleDateString();
};

const mapNotification = (notification) => ({
  ...notification,
  id: notification.id,
  icon: getNotificationIcon(notification.type),
  unread: !notification.isRead,
  time: formatNotificationTime(notification.createdAt),
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    // Do not request private data when no user token exists.
    if (!localStorage.getItem("token")) {
      setNotifications([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/notifications");
      const data = response.data?.notifications;

      setNotifications(
        Array.isArray(data) ? data.map(mapNotification) : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const handleAuthChange = () => {
      loadNotifications();
    };

    const handleStorageChange = () => {
      loadNotifications();
    };

    window.addEventListener("auth:changed", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth:changed", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadNotifications]);
  const markAsRead = useCallback(async (id) => {
    const notification = notifications.find((item) => item.id === id);

    if (!notification || !notification.unread) return;

    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, isRead: true, unread: false }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark the notification as read."
      );
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((item) => item.unread);

    if (unreadNotifications.length === 0) return;

    // Use the existing API. If any request fails, reload server state.
    const results = await Promise.allSettled(
      unreadNotifications.map((item) =>
        api.patch(`/notifications/${item.id}/read`)
      )
    );

    if (results.some((result) => result.status === "rejected")) {
      setError("Some notifications could not be updated. Refreshing data.");
      await loadNotifications();
      return;
    }

    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        isRead: true,
        unread: false,
      }))
    );

    setError("");
  }, [notifications, loadNotifications]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        loadNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider."
    );
  }

  return context;
};