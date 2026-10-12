import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Courses() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Starts empty
  const [courses, setCourses] = useState([]);

  // Form data
  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    duration: "",
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

  // Edit course
  function handleEdit(course) {
    setForm({
      id: course.id,
      name: course.name,
      department: course.department,
      duration: course.duration,
    });

    setEditId(course.id);
    setShowForm(true);
  }

  // Delete course
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      setCourses(
        courses.filter((course) => course.id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
      }
    }
  }

  // Add / Update course
  function handleSubmit(e) {
    e.preventDefault();

    // Check all fields
    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.department.trim() ||
      !form.duration.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // Update course
    if (editId) {
      setCourses(
        courses.map((course) =>
          course.id === editId
            ? {
                id: form.id.trim(),
                name: form.name.trim(),
                department: form.department.trim(),
                duration: form.duration.trim(),
              }
            : course
        )
      );

      alert("Course updated successfully");
    }

    // Add course
    else {
      // Check duplicate ID
      const alreadyExists = courses.some(
        (course) => course.id === form.id.trim()
      );

      if (alreadyExists) {
        alert("Course ID already exists");
        return;
      }

      const newCourse = {
        id: form.id.trim(),
        name: form.name.trim(),
        department: form.department.trim(),
        duration: form.duration.trim(),
      };

      setCourses([...courses, newCourse]);

      alert("Course added successfully");
    }

    // Clear form
    setForm({
      id: "",
      name: "",
      department: "",
      duration: "",
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
      duration: "",
    });
  }

  // Search courses
  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    return (
      course.id.toLowerCase().includes(searchText) ||
      course.name.toLowerCase().includes(searchText) ||
      course.department.toLowerCase().includes(searchText) ||
      course.duration.toLowerCase().includes(searchText)
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
            Courses
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Course Management
              </h2>

              {/* Add Course */}
              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    department: "",
                    duration: "",
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Course
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
                  placeholder="Search course..."
                  className="w-full border border-gray-300 rounded-md px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* Total Courses */}
              <p className="text-gray-500 text-sm">
                Total Courses:{" "}
                <span className="font-semibold text-gray-800">
                  {filteredCourses.length}
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
                  {editId ? "Edit Course" : "Add New Course"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  {/* Course ID */}
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Course ID"
                    className="border rounded-md px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Course Name */}
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Course Name"
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

                  {/* Duration */}
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration"
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
                    {editId ? "Update Course" : "Save Course"}
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

            {/* Course Table */}
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                {/* Table Header */}
                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="p-4">
                      ID
                    </th>

                    <th className="p-4">
                      Course Name
                    </th>

                    <th className="p-4">
                      Department
                    </th>

                    <th className="p-4">
                      Duration
                    </th>

                    <th className="p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                  {filteredCourses.length > 0 ? (

                    filteredCourses.map((course) => (

                      <tr
                        key={course.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* ID */}
                        <td className="p-4 font-medium">
                          {course.id}
                        </td>

                        {/* Course Name */}
                        <td className="p-4">
                          {course.name}
                        </td>

                        {/* Department */}
                        <td className="p-4">
                          {course.department}
                        </td>

                        {/* Duration */}
                        <td className="p-4">
                          {course.duration}
                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="flex gap-3">

                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(course)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                            >
                              Edit
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(course.id)
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
                        No courses found
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

export default Courses;