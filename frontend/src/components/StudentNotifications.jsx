import React from "react";
import { useNotifications } from "../context/NotificationContext";

function StudentNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-gray-500">
            Stay updated with your exam preparation.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadNotifications}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            Recent Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount} unread notification
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div
            role="status"
            className="py-16 text-center text-gray-500"
          >
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl">🔔</div>
            <h3 className="text-lg font-semibold text-gray-700">
              No notifications
            </h3>
            <p className="mt-1 text-gray-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 border-b p-5 transition last:border-b-0 hover:bg-gray-50 ${
                  item.unread ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xl ${
                    item.unread ? "bg-blue-100" : "bg-gray-100"
                  }`}
                  aria-hidden="true"
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words font-semibold text-gray-800">
                      {item.title}
                    </h3>

                    {item.unread && (
                      <span
                        className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-600"
                        aria-label="Unread"
                      />
                    )}
                  </div>

                  <p className="mt-1 break-words text-sm text-gray-600">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentNotifications;