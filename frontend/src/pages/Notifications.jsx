import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Notifications() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty
  const [notifications, setNotifications] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    title: "",
    message: "",
    date: "",
  });

  // Search
  const [search, setSearch] = useState("");

  // Handle input changes
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Edit notification
  function handleEdit(notification) {
    setForm({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      date: notification.date,
    });

    setEditId(notification.id);
    setShowForm(true);
  }

  // Delete notification
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (confirmDelete) {
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== id
        )
      );

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update notification
  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id.trim() ||
      !form.title.trim() ||
      !form.message.trim() ||
      !form.date.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update notification
    if (editId) {
      setNotifications(
        notifications.map((notification) =>
          notification.id === editId
            ? {
                id: form.id.trim(),
                title: form.title.trim(),
                message: form.message.trim(),
                date: form.date,
              }
            : notification
        )
      );

      alert("Notification updated successfully");
    }

    // Add notification
    else {
      const alreadyExists = notifications.some(
        (notification) => notification.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Notification ID already exists");
        return;
      }

      const newNotification = {
        id: form.id.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
        date: form.date,
      };

      setNotifications([
        ...notifications,
        newNotification,
      ]);

      alert("Notification added successfully");
    }

    // Clear form
    setForm({
      id: "",
      title: "",
      message: "",
      date: "",
    });

    setEditId(null);
    setShowForm(false);
  }

  // Exit form
  function handleExit() {
    setShowForm(false);
    setEditId(null);

    setForm({
      id: "",
      title: "",
      message: "",
      date: "",
    });
  }

  // Search notifications
  const filteredNotifications = notifications.filter(
    (notification) => {
      const searchText = search.toLowerCase();

      return (
        notification.id.toLowerCase().includes(searchText) ||
        notification.title.toLowerCase().includes(searchText) ||
        notification.message.toLowerCase().includes(searchText) ||
        notification.date.toLowerCase().includes(searchText)
      );
    }
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-64">

        {/* Navbar */}
        <Navbar />

        <main className="p-8">

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Notifications
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Notification Management
              </h2>

              {/* Add Notification */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    title: "",
                    message: "",
                    date: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Notification
              </button>

            </div>

            {/* Search + Total */}
            <div className="flex justify-between items-center mb-6">

              {/* Search */}
              <div className="w-80">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notification..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Notifications */}
              <p className="text-gray-500 text-sm">
                Total Notifications:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredNotifications.length}
                </span>
              </p>

            </div>

            {/* Add / Edit Form */}
            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                {/* Form Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId
                    ? "Edit Notification"
                    : "Add New Notification"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Notification ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Notification ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Title */}
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Notification Title"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Message */}
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Notification Message"
                    rows="3"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Date */}
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Form Buttons */}
                <div className="mt-5 flex gap-3">

                  {/* Save / Update */}
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                  >
                    {editId
                      ? "Update Notification"
                      : "Save Notification"}
                  </button>

                  {/* Exit */}
                  <button
                    type="button"
                    onClick={handleExit}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Exit
                  </button>

                </div>

              </form>
            )}

            {/* Notification Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* Table Header */}
                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Title
                    </th>

                    <th className="p-4">
                      Message
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                    <th className="p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredNotifications.length > 0 ? (

                    filteredNotifications.map(
                      (notification) => (

                        <tr
                          key={notification.id}
                          className="border-b hover:bg-gray-50"
                        >

                          {/* ID */}
                          <td className="p-4 font-medium">
                            {notification.id}
                          </td>

                          {/* Title */}
                          <td className="p-4">
                            {notification.title}
                          </td>

                          {/* Message */}
                          <td className="p-4">
                            {notification.message}
                          </td>

                          {/* Date */}
                          <td className="p-4">
                            {notification.date}
                          </td>

                          {/* Actions */}
                          <td className="p-4">

                            <div className="flex gap-3">

                              {/* Edit */}
                              <button
                                onClick={() =>
                                  handleEdit(notification)
                                }
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                              >
                                Edit
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() =>
                                  handleDelete(
                                    notification.id
                                  )
                                }
                                className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    /* Empty Table */
                    <tr>

                      <td
                        colSpan="5"
                        className="p-10 text-center text-gray-500"
                      >
                        No notifications found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Notifications;