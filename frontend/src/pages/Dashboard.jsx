import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
const [totalStudents, setTotalStudents] = useState(null);

useEffect(() => {
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin Dashboard Data:", res.data);

      setTotalStudents(res.data.totalStudents);
    } catch (error) {
      console.error(
        "Failed to load admin dashboard data:",
        error.response?.data || error.message
      );
    }
  };

  fetchAdminData();
}, []);
  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT
          Sidebar is fixed, so keep 250px space on the left */}
      <div className="ml-[250px] min-h-screen">

        {/* NAVBAR */}
        <Navbar />

        {/* DASHBOARD */}
        <main className="p-6 lg:p-8">

          <div className="w-full max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="mb-8">

              <h1 className="text-3xl font-bold text-gray-800">
                SAAEPS Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Manage students, faculty, courses and examinations
              </p>

            </div>


            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


              {/* STUDENTS */}
              <div
                onClick={() => navigate("/students")}
                className="bg-white rounded-2xl shadow-sm border border-gray-200
                           p-6 cursor-pointer hover:shadow-lg
                           transition-all"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Students
                    </p>

                   <p className="text-3xl font-bold text-blue-600 mt-2">
  {totalStudents ?? "—"}
</p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-100
                                  flex items-center justify-center text-2xl">
                    👨‍🎓
                  </div>

                </div>

                <p className="text-xs text-gray-400 mt-4">
                  Click to manage students →
                </p>

              </div>


              {/* FACULTY */}
              <div
                onClick={() => navigate("/faculty")}
                className="bg-white rounded-2xl shadow-sm border border-gray-200
                           p-6 cursor-pointer hover:shadow-lg
                           transition-all"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Faculty Members
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                      —
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-100
                                  flex items-center justify-center text-2xl">
                    👨‍🏫
                  </div>

                </div>

                <p className="text-xs text-gray-400 mt-4">
                  Click to manage faculty →
                </p>

              </div>


              {/* COURSES */}
              <Link to="/courses">

                <div
                  className="bg-white rounded-2xl shadow-sm border border-gray-200
                             p-6 cursor-pointer hover:shadow-lg
                             transition-all"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-gray-500">
                        Courses
                      </p>

                      <p className="text-3xl font-bold text-yellow-600 mt-2">
                        —
                      </p>

                    </div>

                    <div className="w-12 h-12 rounded-xl bg-yellow-100
                                    flex items-center justify-center text-2xl">
                      📚
                    </div>

                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    Click to manage courses →
                  </p>

                </div>

              </Link>


              {/* EXAMS */}
              <div
                onClick={() => navigate("/exams")}
                className="bg-white rounded-2xl shadow-sm border border-gray-200
                           p-6 cursor-pointer hover:shadow-lg
                           transition-all"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Exams
                    </p>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                      —
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-xl bg-red-100
                                  flex items-center justify-center text-2xl">
                    📝
                  </div>

                </div>

                <p className="text-xs text-gray-400 mt-4">
                  Click to manage exams →
                </p>

              </div>

            </div>


            {/* QUICK ACTIONS */}
            <div className="mt-8">

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <Link
                  to="/students"
                  className="bg-blue-600 text-white rounded-xl p-4
                             hover:bg-blue-700 transition text-center font-medium"
                >
                  👨‍🎓 Manage Students
                </Link>

                <Link
                  to="/faculty"
                  className="bg-green-600 text-white rounded-xl p-4
                             hover:bg-green-700 transition text-center font-medium"
                >
                  👨‍🏫 Manage Faculty
                </Link>

                <Link
                  to="/exams"
                  className="bg-red-600 text-white rounded-xl p-4
                             hover:bg-red-700 transition text-center font-medium"
                >
                  📝 Manage Exams
                </Link>

                <Link
                  to="/results"
                  className="bg-purple-600 text-white rounded-xl p-4
                             hover:bg-purple-700 transition text-center font-medium"
                >
                  📊 View Results
                </Link>

              </div>

            </div>


            {/* RECENT ACTIVITIES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200
                            p-6 mt-8">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-bold text-gray-800">
                  Recent Activities
                </h2>

                <span className="text-sm text-green-600 font-medium">
                  ● System Active
                </span>

              </div>


              <div className="space-y-4">

                <div className="flex items-center gap-4 border-b pb-4">

                  <div className="w-10 h-10 rounded-full bg-blue-100
                                  flex items-center justify-center">
                    👨‍🎓
                  </div>

                  <div>

                    <p className="font-medium text-gray-700">
                      Student account available
                    </p>

                    <p className="text-sm text-gray-400">
                      Student registration system is active
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-4 border-b pb-4">

                  <div className="w-10 h-10 rounded-full bg-green-100
                                  flex items-center justify-center">
                    👨‍🏫
                  </div>

                  <div>

                    <p className="font-medium text-gray-700">
                      Faculty management
                    </p>

                    <p className="text-sm text-gray-400">
                      Faculty management module is available
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-full bg-red-100
                                  flex items-center justify-center">
                    📝
                  </div>

                  <div>

                    <p className="font-medium text-gray-700">
                      Examination management
                    </p>

                    <p className="text-sm text-gray-400">
                      Examination module is available
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;