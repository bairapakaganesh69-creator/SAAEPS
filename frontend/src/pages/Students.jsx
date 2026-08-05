import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "Rahul",
      className: "10th",
      email: "rahul@gmail.com"
    },
    {
      id: "ST002",
      name: "Anjali",
      className: "10th",
      email: "anjali@gmail.com"
    },
    {
      id: "ST003",
      name: "Arjun",
      className: "9th",
      email: "arjun@gmail.com"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    className: "",
    email: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(student) {
    setForm(student);
    setEditId(student.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setStudents(
      students.filter((student) => student.id !== id)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.name ||
      !form.className ||
      !form.email
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setStudents(
        students.map((student) =>
          student.id === editId ? form : student
        )
      );

      setEditId(null);
    } else {
      setStudents([...students, form]);
    }

    setForm({
      id: "",
      name: "",
      className: "",
      email: ""
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
            Students
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Student Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    className: "",
                    email: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Student
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId ? "Edit Student" : "Add New Student"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Student Name"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    placeholder="Class"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border rounded-md px-4 py-3"
                  />

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md"
                  >
                    {editId ? "Update Student" : "Save Student"}
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
                  <th className="p-4">Name</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {student.id}
                    </td>

                    <td className="p-4">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.className}
                    </td>

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
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

export default Students;