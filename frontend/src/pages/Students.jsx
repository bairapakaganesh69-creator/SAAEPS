import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty - no sample students
  const [students, setStudents] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    name: "",
    className: "",
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

  // Edit student
  function handleEdit(student) {
    setForm({
      id: student.id,
      name: student.name,
      className: student.className,
      email: student.email,
    });

    setEditId(student.id);
    setShowForm(true);
  }

  // Delete student
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      setStudents(
        students.filter((student) => student.id !== id)
      );

      // If deleting edited student
      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update student
  function handleSubmit(e) {
    e.preventDefault();

    // Check all fields
    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.className.trim() ||
      !form.email.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update student
    if (editId) {
      setStudents(
        students.map((student) =>
          student.id === editId
            ? {
                id: form.id.trim(),
                name: form.name.trim(),
                className: form.className.trim(),
                email: form.email.trim(),
              }
            : student
        )
      );

      alert("Student updated successfully");
    }

    // Add student
    else {
      // Check duplicate ID
      const alreadyExists = students.some(
        (student) => student.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Student ID already exists");
        return;
      }

      const newStudent = {
        id: form.id.trim(),
        name: form.name.trim(),
        className: form.className.trim(),
        email: form.email.trim(),
      };

      setStudents([...students, newStudent]);

      alert("Student added successfully");
    }

    // Clear form
    setForm({
      id: "",
      name: "",
      className: "",
      email: "",
    });

    setEditId(null);
    setShowForm(false);
  }

  // Cancel form
  function handleCancel() {
    setShowForm(false);
    setEditId(null);

    setForm({
      id: "",
      name: "",
      className: "",
      email: "",
    });
  }

  // Search students
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.id.toLowerCase().includes(searchText) ||
      student.name.toLowerCase().includes(searchText) ||
      student.className.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText)
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
            Students
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Student Management
              </h2>

              {/* Add Student */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    className: "",
                    email: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Student
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
                  placeholder="Search student..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Students */}
              <p className="text-gray-500 text-sm">
                Total Students:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredStudents.length}
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
                  {editId ? "Edit Student" : "Add New Student"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Student ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Student Name */}
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Student Name"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Class */}
                  <input
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    placeholder="Class"
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
                    {editId ? "Update Student" : "Save Student"}
                  </button>

                  {/* Cancel / Exit */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Exit
                  </button>

                </div>

              </form>
            )}

            {/* Student Table */}
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
                      Class
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

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map((student) => (

                      <tr
                        key={student.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* ID */}
                        <td className="p-4 font-medium">
                          {student.id}
                        </td>

                        {/* Name */}
                        <td className="p-4">
                          {student.name}
                        </td>

                        {/* Class */}
                        <td className="p-4">
                          {student.className}
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          {student.email}
                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(student)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(student.id)
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
                        No students found
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

export default Students;