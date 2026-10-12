import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: "📝",
      title: "New Mock Test Available",
      message: "A new ECET Mathematics mock test is available for practice.",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      icon: "📊",
      title: "Test Result Published",
      message: "Your latest mock test result is now available.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      icon: "📚",
      title: "Study Reminder",
      message: "You have pending Trigonometry practice to complete.",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      icon: "📖",
      title: "New Study Material",
      message: "New Physics Mechanics study material has been added.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};