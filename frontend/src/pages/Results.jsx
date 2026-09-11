import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Results() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty
  const [results, setResults] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    studentId: "",
    studentName: "",
    exam: "",
    marks: "",
    grade: "",
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

  // Edit result
  function handleEdit(result) {
    setForm({
      id: result.id,
      studentId: result.studentId,
      studentName: result.studentName,
      exam: result.exam,
      marks: result.marks,
      grade: result.grade,
    });

    setEditId(result.id);
    setShowForm(true);
  }

  // Delete result
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (confirmDelete) {
      setResults(
        results.filter((result) => result.id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update result
  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id.trim() ||
      !form.studentId.trim() ||
      !form.studentName.trim() ||
      !form.exam.trim() ||
      !form.marks.trim() ||
      !form.grade.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update result
    if (editId) {
      setResults(
        results.map((result) =>
          result.id === editId
            ? {
                id: form.id.trim(),
                studentId: form.studentId.trim(),
                studentName: form.studentName.trim(),
                exam: form.exam.trim(),
                marks: form.marks.trim(),
                grade: form.grade.trim(),
              }
            : result
        )
      );

      alert("Result updated successfully");
    }

    // Add result
    else {
      const alreadyExists = results.some(
        (result) => result.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Result ID already exists");
        return;
      }

      const newResult = {
        id: form.id.trim(),
        studentId: form.studentId.trim(),
        studentName: form.studentName.trim(),
        exam: form.exam.trim(),
        marks: form.marks.trim(),
        grade: form.grade.trim(),
      };

      setResults([...results, newResult]);

      alert("Result added successfully");
    }

    // Clear form
    setForm({
      id: "",
      studentId: "",
      studentName: "",
      exam: "",
      marks: "",
      grade: "",
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
      studentId: "",
      studentName: "",
      exam: "",
      marks: "",
      grade: "",
    });
  }

  // Search results
  const filteredResults = results.filter((result) => {
    const searchText = search.toLowerCase();

    return (
      result.id.toLowerCase().includes(searchText) ||
      result.studentId.toLowerCase().includes(searchText) ||
      result.studentName.toLowerCase().includes(searchText) ||
      result.exam.toLowerCase().includes(searchText) ||
      result.marks.toLowerCase().includes(searchText) ||
      result.grade.toLowerCase().includes(searchText)
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
            Results
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Result Management
              </h2>

              {/* Add Result */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    studentId: "",
                    studentName: "",
                    exam: "",
                    marks: "",
                    grade: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Result
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
                  placeholder="Search result..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Results */}
              <p className="text-gray-500 text-sm">
                Total Results:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredResults.length}
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
                  {editId ? "Edit Result" : "Add New Result"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Result ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Result ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Student ID */}
                  <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Student Name */}
                  <input
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    placeholder="Student Name"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Exam */}
                  <input
                    name="exam"
                    value={form.exam}
                    onChange={handleChange}
                    placeholder="Exam Name"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Marks */}
                  <input
                    name="marks"
                    type="number"
                    value={form.marks}
                    onChange={handleChange}
                    placeholder="Marks"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Grade */}
                  <input
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="Grade"
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
                    {editId ? "Update Result" : "Save Result"}
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

            {/* Results Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* Table Header */}
                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Student ID
                    </th>

                    <th className="p-4">
                      Student Name
                    </th>

                    <th className="p-4">
                      Exam
                    </th>

                    <th className="p-4">
                      Marks
                    </th>

                    <th className="p-4">
                      Grade
                    </th>

                    <th className="p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredResults.length > 0 ? (

                    filteredResults.map((result) => (

                      <tr
                        key={result.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* ID */}
                        <td className="p-4 font-medium">
                          {result.id}
                        </td>

                        {/* Student ID */}
                        <td className="p-4">
                          {result.studentId}
                        </td>

                        {/* Student Name */}
                        <td className="p-4">
                          {result.studentName}
                        </td>

                        {/* Exam */}
                        <td className="p-4">
                          {result.exam}
                        </td>

                        {/* Marks */}
                        <td className="p-4">
                          {result.marks}
                        </td>

                        {/* Grade */}
                        <td className="p-4">
                          {result.grade}
                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(result)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(result.id)
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
                        colSpan="7"
                        className="p-10 text-center text-gray-500"
                      >
                        No results found
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

export default Results;