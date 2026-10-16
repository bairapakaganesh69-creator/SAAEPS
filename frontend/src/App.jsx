
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

import Landing from "./pages/Landing";
import AuthModal from "./components/AuthModal";

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
import StudentNotifications from "./components/StudentNotifications";
import StudentDashboard from "./pages/StudentDashboard";
import StudyPlanner from "./pages/StudyPlanner";
import Performance from "./pages/Performance";
import MockTests from "./pages/MockTests";
import Subjects from "./pages/Subjects";
import WeakTopicAnalyzer from "./pages/WeakTopicAnalyzer";

// Authentication pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerified from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmailOTP from "./pages/VerifyEmailOTP";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";
import GoogleSetPassword from "./pages/GoogleSetPassword";

// AI pages
import AITutor from "./pages/AITutor";
import AIFeedback from "./pages/AIFeedback";

function AppRoutes() {
  const location = useLocation();

  // Preserve the landing page behind authentication modals.
  const isModalRoute = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-otp",
].includes(location.pathname);

const backgroundLocation =
  location.state?.backgroundLocation ||
  (isModalRoute ? { pathname: "/" } : null);

  return (
    <>
      {/* Main application routes */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyEmailOTP />} />
        <Route
          path="/google-set-password"
          element={<GoogleSetPassword />}
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

        {/* AI pages */}
        <Route
          path="/student/ai-feedback"
          element={<AIFeedback />}
        />
        <Route
          path="/student/ai-tutor"
          element={<AITutor />}
        />

        {/* Student panel */}
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />
        <Route path="/planner" element={<StudyPlanner />} />
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
          element={<StudentNotifications />}
        />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/settings" element={<Settings />} />
        <Route path="/student/subjects" element={<Subjects />} />
        <Route
          path="/student/weak-topics"
          element={<WeakTopicAnalyzer />}
        />

        {/* Admin panel */}
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/results" element={<Results />} />
        <Route
          path="/notifications"
          element={<Notifications />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Unknown URLs */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      {/* Authentication modal over the landing page */}
      {isModalRoute && <AuthModal />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}
