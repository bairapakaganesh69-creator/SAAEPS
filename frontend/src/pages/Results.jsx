import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Results() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [results, setResults] = useState([
    {
      id: "R001",
      student: "Rahul",
      exam: "Mid Term Examination",
      subject: "Web Development",
      marks: "85",
      grade: "A"
    },
    {
      id: "R002",
      student: "Anjali",
      exam: "Mid Term Examination",
      subject: "Data Structures",
      marks: "92",
      grade: "A+"
    },
    {
      id: "R003",
      student: "Arjun",
      exam: "Internal Assessment",
      subject: "Database Management",
      marks: "78",
      grade: "B+"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    student: "",
    exam: "",
    subject: "",
    marks: "",
    grade: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(result) {
    setForm(result);
    setEditId(result.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setResults(
      results.filter((result) => result.id !== id)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.student ||
      !form.exam ||
      !form.subject ||
      !form.marks ||
      !form.grade
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setResults(
        results.map((result) =>
          result.id === editId ? form : result
        )
      );

      setEditId(null);
    } else {
      setResults([...results, form]);
    }

    setForm({
      id: "",
      student: "",
      exam: "",
      subject: "",
      marks: "",
      grade: ""
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
            Results
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Result Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    student: "",
                    exam: "",
                    subject: "",
                    marks: "",
                    grade: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Result
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId ? "Edit Result" : "Add New Result"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Result ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="student"
                    value={form.student}
                    onChange={handleChange}
                    placeholder="Student Name"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="exam"
                    value={form.exam}
                    onChange={handleChange}
                    placeholder="Exam Name"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="marks"
                    type="number"
                    value={form.marks}
                    onChange={handleChange}
                    placeholder="Marks"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="Grade"
                    className="border rounded-md px-4 py-3"
                  />

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md"
                  >
                    {editId ? "Update Result" : "Save Result"}
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
                  <th className="p-4">Student</th>
                  <th className="p-4">Exam</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Marks</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {results.map((result) => (

                  <tr
                    key={result.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {result.id}
                    </td>

                    <td className="p-4">
                      {result.student}
                    </td>

                    <td className="p-4">
                      {result.exam}
                    </td>

                    <td className="p-4">
                      {result.subject}
                    </td>

                    <td className="p-4">
                      {result.marks}
                    </td>

                    <td className="p-4 font-semibold">
                      {result.grade}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleEdit(result)}
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(result.id)}
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

export default Results;