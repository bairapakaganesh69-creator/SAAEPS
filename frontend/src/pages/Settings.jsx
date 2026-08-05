import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <div className="ml-64">

        <Navbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Settings
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8 max-w-3xl">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              System Settings
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block text-gray-600 mb-2">
                  Website Name
                </label>

                <input
                  type="text"
                  defaultValue="SAAEPS"
                  className="w-full border rounded-md px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  defaultValue="admin@saaeps.com"
                  className="w-full border rounded-md px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2">
                  Language
                </label>

                <select className="w-full border rounded-md px-4 py-3">
                  <option>English</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5"
                />

                <span className="text-gray-700">
                  Enable Email Notifications
                </span>

              </div>

            </div>

            <button className="mt-8 bg-blue-700 text-white px-6 py-3 rounded-md">
              Save Settings
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Settings;