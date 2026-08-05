import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Faculty() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [faculty, setFaculty] = useState([
    {
      id: "F001",
      name: "Dr. Ramesh",
      department: "Computer Science",
      email: "ramesh@gmail.com"
    },
    {
      id: "F002",
      name: "Mrs. Priya",
      department: "Mathematics",
      email: "priya@gmail.com"
    },
    {
      id: "F003",
      name: "Mr. Suresh",
      department: "Physics",
      email: "suresh@gmail.com"
    }
  ]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    department: "",
    email: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEdit(member) {
    setForm(member);
    setEditId(member.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setFaculty(
      faculty.filter((member) => member.id !== id)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.id ||
      !form.name ||
      !form.department ||
      !form.email
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setFaculty(
        faculty.map((member) =>
          member.id === editId ? form : member
        )
      );

      setEditId(null);
    } else {
      setFaculty([...faculty, form]);
    }

    setForm({
      id: "",
      name: "",
      department: "",
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
            Faculty
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Faculty Management
              </h2>

              <button
                onClick={() => {
                  setForm({
                    id: "",
                    name: "",
                    department: "",
                    email: ""
                  });

                  setEditId(null);
                  setShowForm(true);
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
              >
                + Add Faculty
              </button>

            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border rounded-lg p-6 mb-6"
              >

                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {editId ? "Edit Faculty" : "Add New Faculty"}
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="Faculty ID"
                    className="border rounded-md px-4 py-3"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Faculty Name"
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
                    {editId ? "Update Faculty" : "Save Faculty"}
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
                  <th className="p-4">Department</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

                {faculty.map((member) => (

                  <tr
                    key={member.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {member.id}
                    </td>

                    <td className="p-4">
                      {member.name}
                    </td>

                    <td className="p-4">
                      {member.department}
                    </td>

                    <td className="p-4">
                      {member.email}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 mr-4"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(member.id)}
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

export default Faculty;