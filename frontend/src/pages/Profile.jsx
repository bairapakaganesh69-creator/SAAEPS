import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Profile() {
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle input changes
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Open Edit Profile
  function handleEdit() {
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      password: profile.password,
    });

    setShowForm(true);
  }

  // Save Profile
  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    setProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    });

    setShowForm(false);
    setShowPassword(false);

    alert("Profile updated successfully");
  }

  // Exit
  function handleExit() {
    setShowForm(false);
    setShowPassword(false);

    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      password: profile.password,
    });
  }

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
            Profile
          </h1>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold text-gray-800">
                Admin Profile
              </h2>

              {!showForm && (
                <button
                  onClick={handleEdit}
                  className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
                >
                  Edit Profile
                </button>
              )}

            </div>

            {/* Edit Form */}
            {showForm ? (

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-2 gap-5">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full border border-gray-300 rounded-md px-4 py-3
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>

                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full border border-gray-300 rounded-md px-4 py-3
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-md px-4 py-3
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Eye Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-gray-600 hover:text-blue-600 text-xl"
                        title={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "👁️" : "👁️"}
                      </button>

                    </div>
                  </div>

                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">

                  {/* Save */}
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                  >
                    Save Profile
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

            ) : (

              /* Profile Display */
              <div className="grid grid-cols-2 gap-5">

                {/* Name */}
                <div className="border rounded-md p-4">
                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {profile.name || "Not added"}
                  </p>
                </div>

                {/* Email */}
                <div className="border rounded-md p-4">
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {profile.email || "Not added"}
                  </p>
                </div>

                {/* Phone */}
                <div className="border rounded-md p-4">
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {profile.phone || "Not added"}
                  </p>
                </div>

                {/* Password */}
                <div className="border rounded-md p-4">
                  <p className="text-sm text-gray-500">
                    Password
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {profile.password
                      ? "••••••••"
                      : "Not added"}
                  </p>
                </div>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Profile;