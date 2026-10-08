import React, { useState, useEffect } from "react";
// import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import ProgressDashboard from "../components/ProgressDashboard";
import RecentTests from "../components/RecentTests";
import UpcomingExams from "../components/UpcomingExams";
import Notifications from "../components/Notifications";
import QuickActions from "../components/QuickActions";

function Dashboard() {
  console.log("Dashboard loaded");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Empty Dashboard State
  const [dashboard, setDashboard] = useState({
    user: {
      name: "",
      email: "",
    },

    statistics: {
      subjects: 0,
      tests: 0,
      score: 0,
      hours: 0,
    },

    progress: [],
    tests: [],
    exams: [],
    notifications: [],
  });

  useEffect(() => {
    // Connect your backend API here

    /*
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      });
    */
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <Header
          user={dashboard.user}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 sm:p-6 space-y-6">
          {/* Dashboard Cards */}
          <DashboardCards
            stats={dashboard.statistics}
          />

          {/* Learning Progress */}
          <ProgressDashboard
            progressData={dashboard.progress}
          />

          {/* Recent Tests & Upcoming Exams */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RecentTests
              tests={dashboard.tests}
            />

            <UpcomingExams
              exams={dashboard.exams}
            />
          </div>

          {/* Notifications */}
          <Notifications
            notifications={dashboard.notifications}
          />

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;