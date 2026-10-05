import React from "react";
import { useNotifications } from "../context/NotificationContext";

function StudentNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-gray-500 mt-1">
            Stay updated with your exam preparation.
          </p>
        </div>

        {unreadCount > 0 && (
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

        <div className="px-5 py-4 border-b">

          <h2 className="font-semibold text-gray-800">
            Recent Notifications
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>

        </div>

        {/* No Notifications */}
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

          /* Notifications List */
          <div>

            {notifications.map((item) => (

              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`flex items-start gap-4 p-5 border-b last:border-b-0 cursor-pointer transition hover:bg-gray-50 ${
                  item.unread
                    ? "bg-blue-50"
                    : "bg-white"
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
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    {item.unread && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
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

export default StudentNotifications;