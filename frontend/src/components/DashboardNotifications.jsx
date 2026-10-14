import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

function DashboardNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
  } = useNotifications();

  const recentNotifications = notifications.slice(0, 3);

  return (
    <section className="rounded-xl bg-white p-5 shadow-lg">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount} unread
          </p>
        </div>

        <Link
          to="/student/notifications"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={loadNotifications}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <p role="status" className="py-6 text-center text-gray-500">
          Loading notifications...
        </p>
      ) : recentNotifications.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-3xl">🔔</p>
          <p className="mt-2 font-medium text-gray-700">
            No notifications yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            New updates will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {recentNotifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-4 ${
                item.unread ? "bg-blue-50/60" : ""
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="break-words font-semibold text-gray-800">
                  {item.title}
                </p>

                <p className="mt-1 break-words text-sm text-gray-600">
                  {item.message}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {item.time}
                </p>

                {item.unread && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>

              {item.unread && (
                <span
                  className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-600"
                  aria-label="Unread"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardNotifications;