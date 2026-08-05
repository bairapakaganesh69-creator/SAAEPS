import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1">

        {/* NAVBAR */}
        <Navbar />

        {/* CENTER DASHBOARD */}
        <main className="flex justify-center p-10">

          <div className="w-full max-w-3xl">

            {/* TITLE */}
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              SAAEPS Admin Dashboard
            </h1>

            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

              {/* TOTAL STUDENTS */}
              <div
                onClick={() => navigate("/students")}
                className="bg-white rounded-lg shadow p-4 cursor-pointer
                           hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">
                  Total Students
                </p>

                <p className="text-2xl font-bold text-blue-600 mt-2">
                  520
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Click to view
                </p>
              </div>

              {/* FACULTY */}
              <div
                onClick={() => navigate("/faculty")}
                className="bg-white rounded-lg shadow p-4 cursor-pointer
                           hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">
                  Faculty Members
                </p>

                <p className="text-2xl font-bold text-green-600 mt-2">
                  45
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Click to view
                </p>
              </div>

              {/* COURSES */}
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">
                  Courses
                </p>

                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  18
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Available
                </p>
              </div>

              {/* EXAMS */}
              <div
                onClick={() => navigate("/exams")}
                className="bg-white rounded-lg shadow p-4 cursor-pointer
                           hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">
                  Exams
                </p>

                <p className="text-2xl font-bold text-red-600 mt-2">
                  12
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Click to view
                </p>
              </div>

            </div>

            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-lg shadow p-5 mt-5">

              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Activities
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ New student added</p>
                <p>✓ Faculty information updated</p>
                <p>✓ New exam scheduled</p>
              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;
