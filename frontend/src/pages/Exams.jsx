import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Exams() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [exams, setExams] = useState([
    {
      id: "EX001",
      name: "Mid Term Examination",
      course: "Web Development",
      date: "2026-08-15",
      duration: "2 Hours"
    },
    {
      id: "EX002",
      name: "Final Examination",
      course: "Data Structures",
      date: "2026-09-10",
      duration: "3 Hours"
    },
    {
      id: "EX003",
      name: "Internal Assessment",
      course: "Database Management",
      date: "2026-09-20",
      duration: "1 Hour"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    course: "",
    date: "",
    duration: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(exam) {
    setForm(exam);
    setEditId(exam.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setExams(
      exams.filter((exam) => exam.id !== id)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.name ||
      !form.course ||
      !form.date ||
      !form.duration
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setExams(
        exams.map((exam) =>
          exam.id === editId ? form : exam
        )
      );

      setEditId(null);
    } else {
      setExams([...exams, form]);
    }

    setForm({
      id: "",
      name: "",
      course: "",
      date: "",
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
            Exams
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Exam Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    course: "",
                    date: "",
                    duration: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Exam
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId ? "Edit Exam" : "Add New Exam"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Exam ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Exam Name"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="Course"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
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
                    {editId ? "Update Exam" : "Save Exam"}
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
                  <th className="p-4">Exam Name</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {exams.map((exam) => (

                  <tr
                    key={exam.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {exam.id}
                    </td>

                    <td className="p-4">
                      {exam.name}
                    </td>

                    <td className="p-4">
                      {exam.course}
                    </td>

                    <td className="p-4">
                      {exam.date}
                    </td>

                    <td className="p-4">
                      {exam.duration}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(exam.id)}
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

export default Exams;