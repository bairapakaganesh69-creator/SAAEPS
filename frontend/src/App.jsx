import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Student pages
import StudentDashboard from "./pages/StudentDashboard";
import StudyPlanner from "./pages/StudyPlanner";
import Performance from "./pages/Performance";
import MockTests from "./pages/MockTests";

// Authentication pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerified from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmailOTP from "./pages/VerifyEmailOTP";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== AUTHENTICATION ==================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/verify-otp"
          element={<VerifyEmailOTP />}
        />

        <Route
          path="/email-verified"
          element={<EmailVerified />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-reset-otp"
          element={<VerifyResetOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ==================== STUDENT PANEL ==================== */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
         path="/planner"
         element={<StudyPlanner />}
        />

        <Route
        path="/student/performance"
        element={<Performance />}
        />

        <Route
  path="/student/mock-tests"
  element={<MockTests />}
/>

<Route
  path="/student/notifications"
  element={<StudentDashboard />}
/>

<Route
  path="/student/profile"
  element={<StudentDashboard />}
/>

<Route
  path="/student/settings"
  element={<StudentDashboard />}
/>

        {/* ==================== ADMIN PANEL ==================== */}

        <Route
          path="/Dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/students"
          element={<Students />}
        />

        <Route
          path="/faculty"
          element={<Faculty />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/exams"
          element={<Exams />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />


        {/* ==================== DEFAULT ==================== */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;