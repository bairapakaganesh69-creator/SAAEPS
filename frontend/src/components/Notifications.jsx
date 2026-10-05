import React, { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "test",
      title: "New Mock Test Available",
      message: "A new ECET Mathematics mock test is available for practice.",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "result",
      title: "Test Result Published",
      message: "Your latest mock test result is now available.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "study",
      title: "Study Reminder",
      message: "You have pending Trigonometry practice to complete.",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      type: "material",
      title: "New Study Material",
      message: "New Physics - Mechanics study material has been added.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "test":
        return "📝";
      case "result":
        return "📊";
      case "study":
        return "📚";
      case "material":
        return "📖";
      default:
        return "🔔";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-gray-500 mt-1">
            Stay updated with your exam preparation activities.
          </p>
        </div>

        {notifications.some((item) => item.unread) && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Card Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">
              Recent Notifications
            </h2>

            <p className="text-sm text-gray-500">
              {notifications.filter((item) => item.unread).length} unread
            </p>
          </div>

          <div className="text-2xl">
            🔔
          </div>
        </div>

        {/* Notifications */}
        {notifications.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl mb-4">
              🔔
            </div>

            <h3 className="text-lg font-semibold text-gray-700">
              No notifications
            </h3>

            <p className="text-gray-500 mt-1">
              You're all caught up!
            </p>

          </div>

        ) : (

          <div>
            {notifications.map((item) => (

              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`flex items-start gap-4 p-5 border-b last:border-b-0 cursor-pointer transition hover:bg-gray-50 ${
                  item.unread ? "bg-blue-50/50" : "bg-white"
                }`}
              >

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                    item.unread
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-3">

                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    {item.unread && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                    )}

                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {item.time}
                  </p>

                </div>

              </div>

            ))}
          </div>

        )}

      </div>

    </div>
  );
}

export default Notifications;