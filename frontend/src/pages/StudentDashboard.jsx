import React, { useState, useEffect } from "react";
import api from "../services/api";

import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import ProgressDashboard from "../components/ProgressDashboard";
import RecentTests from "../components/RecentTests";
import UpcomingExams from "../components/UpcomingExams";
import StudentNotifications from "../components/StudentNotifications";
import QuickActions from "../components/QuickActions";

function Dashboard() {
  console.log("Dashboard loaded");

  const [sidebarOpen, setSidebarOpen] = useState(false);
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  // Empty Dashboard State
  const [dashboard, setDashboard] = useState({
    user: {
  name: storedUser?.fullName || "Student",
  email: storedUser?.email || "",
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
  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      const data = res.data.dashboard;

      const recentTests = (data.recentTests || []).map((test) => ({
        name: test.testTitle,
        score: test.percentage,
        date: test.submittedAt
          ? new Date(test.submittedAt).toLocaleDateString()
          : "-",
      }));

      const progress = (data.subjectPerformance || []).map((subject) => ({
  subject: subject.subject,
  progress: subject.accuracy,
}));
      setDashboard((prev) => ({
  ...prev,

  statistics: {
    subjects: data.subjectPerformance?.length || 0,
    tests: data.overview?.testsAttempted || 0,
    score: data.overview?.averagePercentage || 0,
    hours: 0,
  },

  progress: progress,
  tests: recentTests,
}));
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  loadDashboard();
}, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar
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
          <StudentNotifications
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