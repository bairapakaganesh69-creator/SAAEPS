import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {

  const [settings, setSettings] = useState({
    applicationName: "SAAEPS",
    email: "admin@saaeps.com",
    notifications: true,
    emailNotifications: true,
    twoFactor: false
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  }

  function handleSave(e) {
    e.preventDefault();

    alert("Settings saved successfully");
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
            Settings
          </h1>

          <form onSubmit={handleSave}>

            {/* ================= APPLICATION SETTINGS ================= */}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Application Settings
              </h2>

              <div className="grid grid-cols-2 gap-5">

                {/* Application Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Name
                  </label>

                  <input
                    type="text"
                    name="applicationName"
                    value={settings.applicationName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Admin Email */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              {/* System Notifications */}
              <div className="mt-6 border-t pt-5">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <span className="text-gray-700">
                    Enable system notifications
                  </span>

                </label>

              </div>

              {/* Email Notifications */}
              <div className="mt-4">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <span className="text-gray-700">
                    Enable email notifications
                  </span>

                </label>

              </div>

            </div>

            {/* ================= SECURITY SETTINGS ================= */}

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Security Settings
              </h2>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="twoFactor"
                  checked={settings.twoFactor}
                  onChange={handleChange}
                  className="w-4 h-4"
                />

                <div>

                  <p className="font-medium text-gray-800">
                    Two-Factor Authentication
                  </p>

                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to the admin account.
                  </p>

                </div>

              </label>

            </div>

            {/* ================= SAVE BUTTON ================= */}

            <button
              type="submit"
              className="bg-blue-700 text-white px-7 py-3 rounded-md
              hover:bg-blue-800"
            >
              Save Settings
            </button>

          </form>

        </main>

      </div>

    </div>
  );
}

export default Settings;

