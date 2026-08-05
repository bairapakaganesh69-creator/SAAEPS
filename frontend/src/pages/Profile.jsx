import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "SAAEPS Admin",
    email: "admin@saaeps.com",
    phone: "9876543210",
    role: "Administrator",
  });

  const [form, setForm] = useState(profile);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSave() {
    setProfile(form);
    setEditing(false);
  }

  function handleCancel() {
    setForm(profile);
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <div className="ml-64">

        <Navbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Profile
          </h1>

          <div className="bg-white rounded-lg shadow-sm max-w-3xl p-8">

            {/* Profile Header */}

            <div className="flex items-center gap-5 border-b pb-6 mb-6">

              <div className="w-20 h-20 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold">
                A
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>

                <p className="text-gray-500">
                  {profile.role}
                </p>
              </div>

            </div>

            {/* Profile Details */}

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block text-gray-600 mb-2">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full border rounded-md px-4 py-3 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full border rounded-md px-4 py-3 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full border rounded-md px-4 py-3 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Role
                </label>

                <input
                  name="role"
                  value={form.role}
                  disabled
                  className="w-full border rounded-md px-4 py-3 bg-gray-100"
                />
              </div>

            </div>

            {/* Buttons */}

            <div className="mt-8 flex gap-3">

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Profile;