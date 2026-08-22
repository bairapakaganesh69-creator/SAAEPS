import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Faculty() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty
  const [faculty, setFaculty] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    email: "",
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

  // Edit faculty
  function handleEdit(member) {
    setForm({
      id: member.id,
      name: member.name,
      department: member.department,
      email: member.email,
    });

    setEditId(member.id);
    setShowForm(true);
  }

  // Delete faculty
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?"
    );

    if (confirmDelete) {
      setFaculty(
        faculty.filter((member) => member.id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update faculty
  function handleSubmit(e) {
    e.preventDefault();

    // Check all fields
    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.department.trim() ||
      !form.email.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update faculty
    if (editId) {
      setFaculty(
        faculty.map((member) =>
          member.id === editId
            ? {
                id: form.id.trim(),
                name: form.name.trim(),
                department: form.department.trim(),
                email: form.email.trim(),
              }
            : member
        )
      );

      alert("Faculty updated successfully");
    }

    // Add faculty
    else {
      // Check duplicate ID
      const alreadyExists = faculty.some(
        (member) => member.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Faculty ID already exists");
        return;
      }

      const newFaculty = {
        id: form.id.trim(),
        name: form.name.trim(),
        department: form.department.trim(),
        email: form.email.trim(),
      };

      setFaculty([...faculty, newFaculty]);

      alert("Faculty added successfully");
    }

    // Clear form
    setForm({
      id: "",
      name: "",
      department: "",
      email: "",
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
      name: "",
      department: "",
      email: "",
    });
  }

  // Search faculty
  const filteredFaculty = faculty.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.id.toLowerCase().includes(searchText) ||
      member.name.toLowerCase().includes(searchText) ||
      member.department.toLowerCase().includes(searchText) ||
      member.email.toLowerCase().includes(searchText)
    );
  });

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
            Faculty
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Faculty Management
              </h2>

              {/* Add Faculty */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    department: "",
                    email: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Faculty
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
                  placeholder="Search faculty..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Faculty */}
              <p className="text-gray-500 text-sm">
                Total Faculty:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredFaculty.length}
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
                  {editId ? "Edit Faculty" : "Add New Faculty"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Faculty ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Faculty ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Faculty Name */}
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Faculty Name"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Department */}
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Email */}
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
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
                    {editId ? "Update Faculty" : "Save Faculty"}
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

            {/* Faculty Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* Table Header */}
                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Name
                    </th>

                    <th className="p-4">
                      Department
                    </th>

                    <th className="p-4">
                      Email
                    </th>

                    <th className="p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredFaculty.length > 0 ? (

                    filteredFaculty.map((member) => (

                      <tr
                        key={member.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* ID */}
                        <td className="p-4 font-medium">
                          {member.id}
                        </td>

                        {/* Name */}
                        <td className="p-4">
                          {member.name}
                        </td>

                        {/* Department */}
                        <td className="p-4">
                          {member.department}
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          {member.email}
                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(member)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(member.id)
                              }
                              className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    /* Empty Table */
                    <tr>

                      <td
                        colSpan="5"
                        className="p-10 text-center text-gray-500"
                      >
                        No faculty found
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

export default Faculty;