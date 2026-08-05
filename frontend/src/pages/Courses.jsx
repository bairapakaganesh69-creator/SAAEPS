import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Courses() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [courses, setCourses] = useState([
    {
      id: "C001",
      name: "Web Development",
      department: "CSE",
      duration: "6 Months"
    },
    {
      id: "C002",
      name: "Data Structures",
      department: "CSE",
      duration: "4 Months"
    },
    {
      id: "C003",
      name: "Database Management",
      department: "CSE",
      duration: "5 Months"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    duration: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(course) {
    setForm(course);
    setEditId(course.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setCourses(
      courses.filter((course) => course.id !== id)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.name ||
      !form.department ||
      !form.duration
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setCourses(
        courses.map((course) =>
          course.id === editId ? form : course
        )
      );

      setEditId(null);
    } else {
      setCourses([...courses, form]);
    }

    setForm({
      id: "",
      name: "",
      department: "",
      duration: ""
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
            Courses
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Course Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    department: "",
                    duration: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Course
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId ? "Edit Course" : "Add New Course"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Course ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Course Name"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration"
                    className="border rounded-md px-4 py-3"
                  />

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md"
                  >
                    {editId ? "Update Course" : "Save Course"}
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
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {courses.map((course) => (

                  <tr
                    key={course.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {course.id}
                    </td>

                    <td className="p-4">
                      {course.name}
                    </td>

                    <td className="p-4">
                      {course.department}
                    </td>

                    <td className="p-4">
                      {course.duration}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course.id)}
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

export default Courses;