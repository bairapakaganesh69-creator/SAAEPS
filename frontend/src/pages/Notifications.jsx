import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Notifications() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: "N001",
      title: "Exam Schedule Released",
      message: "Mid Term examination schedule has been published.",
      date: "2026-08-01"
    },
    {
      id: "N002",
      title: "New Course Added",
      message: "Web Development course has been added.",
      date: "2026-08-02"
    },
    {
      id: "N003",
      title: "Result Published",
      message: "Internal assessment results are now available.",
      date: "2026-08-03"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    title: "",
    message: "",
    date: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(notification) {
    setForm(notification);
    setEditId(notification.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setNotifications(
      notifications.filter(
        (notification) => notification.id !== id
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.title ||
      !form.message ||
      !form.date
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setNotifications(
        notifications.map((notification) =>
          notification.id === editId
            ? form
            : notification
        )
      );

      setEditId(null);
    } else {
      setNotifications([...notifications, form]);
    }

    setForm({
      id: "",
      title: "",
      message: "",
      date: ""
    });

    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <div className="ml-64">

        <Navbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Notifications
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Notification Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    title: "",
                    message: "",
                    date: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Notification
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId
                    ? "Edit Notification"
                    : "Add New Notification"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Notification ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Notification Title"
                    className="border rounded-md px-4 py-3"
                  />

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Notification Message"
                    className="border rounded-md px-4 py-3 col-span-2"
                    rows="3"
                  />

                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border rounded-md px-4 py-3"
                  />

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md"
                  >
                    {editId
                      ? "Update Notification"
                      : "Save Notification"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                    }}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
                  >
                    Cancel
                  </button>

                </div>

              </form>
            )}

            <table className="w-full text-left">

              <thead>
                <tr className="border-b bg-gray-50">

                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {notifications.map((notification) => (

                  <tr
                    key={notification.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {notification.id}
                    </td>

                    <td className="p-4 font-semibold">
                      {notification.title}
                    </td>

                    <td className="p-4">
                      {notification.message}
                    </td>

                    <td className="p-4">
                      {notification.date}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          handleEdit(notification)
                        }
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Notifications;