
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  GraduationCap,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { register, googleAuth } from "../services/authservice";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

const backgroundLocation =
  location.state?.backgroundLocation || { pathname: "/" };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    examType: "ECET",
    branch: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "examType" ? { branch: "" } : {}),
    }));
  };

  // Email and password registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.examType === "ECET" && !formData.branch) {
      setError("Please select your branch.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        examType: formData.examType,
        branch: formData.examType === "ECET" ? formData.branch : "",
      });

      navigate("/verify-otp", {
  state: {
    email: formData.email.trim(),
    backgroundLocation,
    fromRegistration: true,
  },
});
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google registration and sign-in
  const handleGoogleRegister = async (credential) => {
    setError("");

    if (!credential) {
      setError("Google did not return a valid credential.");
      return;
    }

    setLoading(true);

    try {
      const response = await googleAuth({ credential });
      const data = response.data;

      if (data.requiresOTP) {
        navigate("/verify-otp", {
          state: {
            email: data.email,
            authFlow: "google",
            credential,
            backgroundLocation,
    fromRegistration: true,
          },
        });
        return;
      }

      if (data.requiresPasswordSetup) {
        navigate("/google-set-password", {
          state: {
            email: data.email,
            credential,
          },
        });
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth:changed"));

        navigate(
          data.user.role === "admin"
            ? "/Dashboard"
            : data.user.role === "student"
              ? "/student-dashboard"
              : "/",
          { replace: true }
        );
        return;
      }

      setError("Unexpected response from the server. Please try again.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Google registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <main className="auth-page">
      {/* Decorative background circles */}
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-orb auth-orb-three" />

      {/* White registration card */}
      <div className="auth-card auth-register-card">
        {/* SAAEPS logo */}
        <Link to="/" className="auth-brand">
          <img src="/saaeps-logo.png" alt="SAAEPS logo" />
          <span>SAAEPS</span>
        </Link>

        {/* Page heading */}
        <div className="auth-heading">
          <p className="auth-eyebrow">STUDENT PORTAL</p>
          <h1>
            Create your <span>account</span>
          </h1>
          <p className="auth-description">
            Join SAAEPS and begin your ECET or POLYCET preparation journey.
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full name */}
          <div className="auth-field">
            <label htmlFor="register-fullName">Full name</label>
            <div className="auth-input-wrap">
              <UserRound size={19} />
              <input
                id="register-fullName"
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="register-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail size={19} />
              <input
                id="register-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Exam type */}
          <div className="auth-field">
            <label htmlFor="register-examType">
              Exam preparation type
            </label>
            <div className="auth-input-wrap">
              <GraduationCap size={19} />
              <select
                id="register-examType"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                required
                className="w-full min-w-0 appearance-none border-0 bg-transparent text-sm text-slate-800 outline-none"
              >
                <option value="ECET">ECET</option>
                <option value="POLYCET">POLYCET</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Branch: required for ECET */}
          {formData.examType === "ECET" && (
            <div className="auth-field">
              <label htmlFor="register-branch">Branch selection</label>
              <div className="auth-input-wrap">
                <GraduationCap size={19} />
                <select
                  id="register-branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="w-full min-w-0 appearance-none border-0 bg-transparent text-sm text-slate-800 outline-none"
                >
                  <option value="">Select your branch</option>
                  <option value="CSE">
                    CSE — Computer Science and Engineering
                  </option>
                  <option value="ECE">
                    ECE — Electronics and Communication Engineering
                  </option>
                </select>
                <ChevronDown size={18} />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={19} />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="auth-icon-button"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="auth-field">
            <label htmlFor="register-confirmPassword">
              Confirm password
            </label>
            <div className="auth-input-wrap">
              <LockKeyhole size={19} />
              <input
                id="register-confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="auth-icon-button"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              {error}
            </div>
          )}

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-primary-button"
          >
            {loading ? "Creating account..." : "Create SAAEPS account"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        {/* Google registration */}
        <div className="auth-divider" />

        <p className="mb-4 text-center text-sm font-medium text-slate-500">
          Or register with Google
        </p>

        <div className="flex justify-center">
          {loading ? (
            <p className="text-sm text-slate-500">Please wait...</p>
          ) : (
            <GoogleLogin
              onSuccess={(response) => {
                if (response.credential) {
                  handleGoogleRegister(response.credential);
                } else {
                  setError("Google did not return an account credential.");
                }
              }}
              onError={() => {
                setError(
                  "Google sign-in was cancelled or failed. Please try again."
                );
              }}
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
            />
          )}
        </div>

        {/* Login link */}
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <p className="auth-footer">
          By creating an account, you join the SAAEPS learning platform.
        </p>
      </div>
    </main>
  );
}
