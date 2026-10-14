import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "../services/api";

import StudentSidebar from "../components/StudentSidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import ProgressDashboard from "../components/ProgressDashboard";
import RecentTests from "../components/RecentTests";
import UpcomingExams from "../components/UpcomingExams";
import DashboardNotifications from "../components/DashboardNotifications";
import QuickActions from "../components/QuickActions";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const storedUser = getStoredUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dashboard, setDashboard] = useState({
    user: {
      name: storedUser?.fullName || "Student",
      email: storedUser?.email || "",
    },
    statistics: {
      subjects: 0,
      tests: 0,
      score: 0,
      hours: null,
    },
    progress: [],
    tests: [],
    exams: [],
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardRes, profileRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/auth/profile"),
      ]);

      const data = dashboardRes.data?.dashboard;
      const user = profileRes.data?.user;

      if (!data) {
        throw new Error("Dashboard data was not returned by the server.");
      }

      const currentUser = {
        name: user?.fullName || "Student",
        email: user?.email || "",
      };

      if (user) {
        const previousUser = getStoredUser();

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...previousUser,
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            year: user.year,
            phone: user.phone,
            role: user.role,
            isVerified: user.isVerified,
          })
        );
      }

      const recentTests = (data.recentTests || []).map((test) => ({
        name: test.testTitle || "Mock Test",
        score: test.percentage ?? 0,
        scoreEarned: test.score,
        totalMarks: test.totalMarks,
        date: test.submittedAt
          ? new Date(test.submittedAt).toLocaleDateString()
          : "-",
      }));

      const progress = (data.subjectPerformance || []).map(
        (subject) => ({
          subject: subject.subject,
          progress: subject.accuracy,
        })
      );

      setDashboard((previous) => ({
        ...previous,
        user: currentUser,
        statistics: {
          subjects: data.subjectPerformance?.length ?? 0,
          tests: data.overview?.testsAttempted ?? 0,
          score: data.overview?.averagePercentage ?? 0,
          hours: null,
        },
        progress,
        tests: recentTests,
      }));
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="min-w-0 flex-1">
        <Header
          user={dashboard.user}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Student Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your exam preparation and performance.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={loadDashboard}
                disabled={loading}
                className="font-semibold underline disabled:opacity-60"
              >
                Try again
              </button>
            </div>
          )}

          {loading && (
            <p
              role="status"
              className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700"
            >
              Loading your dashboard...
            </p>
          )}

          <DashboardCards stats={dashboard.statistics} />

          <ProgressDashboard
            progressData={dashboard.progress}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentTests tests={dashboard.tests} />

            <UpcomingExams exams={dashboard.exams} />
          </div>

          <DashboardNotifications />

          <QuickActions />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;