import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Exams() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty
  const [exams, setExams] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    name: "",
    course: "",
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

  // Edit exam
  function handleEdit(exam) {
    setForm({
      id: exam.id,
      name: exam.name,
      course: exam.course,
      date: exam.date,
    });

    setEditId(exam.id);
    setShowForm(true);
  }

  // Delete exam
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (confirmDelete) {
      setExams(
        exams.filter((exam) => exam.id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update exam
  function handleSubmit(e) {
    e.preventDefault();

    // Check all fields
    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.course.trim() ||
      !form.date.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update exam
    if (editId) {
      setExams(
        exams.map((exam) =>
          exam.id === editId
            ? {
                id: form.id.trim(),
                name: form.name.trim(),
                course: form.course.trim(),
                date: form.date,
              }
            : exam
        )
      );

      alert("Exam updated successfully");
    }

    // Add exam
    else {
      // Check duplicate ID
      const alreadyExists = exams.some(
        (exam) => exam.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Exam ID already exists");
        return;
      }

      const newExam = {
        id: form.id.trim(),
        name: form.name.trim(),
        course: form.course.trim(),
        date: form.date,
      };

      setExams([...exams, newExam]);

      alert("Exam added successfully");
    }

    // Clear form
    setForm({
      id: "",
      name: "",
      course: "",
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
      name: "",
      course: "",
      date: "",
    });
  }

  // Search exams
  const filteredExams = exams.filter((exam) => {
    const searchText = search.toLowerCase();

    return (
      exam.id.toLowerCase().includes(searchText) ||
      exam.name.toLowerCase().includes(searchText) ||
      exam.course.toLowerCase().includes(searchText) ||
      exam.date.toLowerCase().includes(searchText)
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
            Exams
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Exam Management
              </h2>

              {/* Add Exam */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    course: "",
                    date: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Exam
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
                  placeholder="Search exam..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Exams */}
              <p className="text-gray-500 text-sm">
                Total Exams:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredExams.length}
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
                  {editId ? "Edit Exam" : "Add New Exam"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Exam ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Exam ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Exam Name */}
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Exam Name"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Course */}
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="Course"
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
                    {editId ? "Update Exam" : "Save Exam"}
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

            {/* Exam Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* Table Header */}
                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Exam Name
                    </th>

                    <th className="p-4">
                      Course
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

                  {filteredExams.length > 0 ? (

                    filteredExams.map((exam) => (

                      <tr
                        key={exam.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* ID */}
                        <td className="p-4 font-medium">
                          {exam.id}
                        </td>

                        {/* Exam Name */}
                        <td className="p-4">
                          {exam.name}
                        </td>

                        {/* Course */}
                        <td className="p-4">
                          {exam.course}
                        </td>

                        {/* Date */}
                        <td className="p-4">
                          {exam.date}
                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(exam)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(exam.id)
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
                        No exams found
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

export default Exams;