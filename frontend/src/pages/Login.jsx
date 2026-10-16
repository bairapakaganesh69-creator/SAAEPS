
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";
import { login } from "../services/authservice";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth:changed"));

      if (res.data.user.role === "admin") {
        navigate("/Dashboard", { replace: true });
      } else if (res.data.user.role === "student") {
        navigate("/student-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const backendMessage = err?.response?.data?.message;

      switch (backendMessage) {
        case "Invalid Password":
          setError("Incorrect password. Please try again.");
          break;
        case "User not found":
          setError("This email is not registered.");
          break;
        case "Please verify your email":
          setError("Please verify your email before logging in.");
          break;
        case "Invalid credentials":
          setError("Invalid email or password.");
          break;
        default:
          setError(
            backendMessage || "Something went wrong. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-orb auth-orb-three" />

      <section className="auth-card auth-card-login">
        <Link to="/" className="auth-brand">
          <img src="/saaeps-logo.png" alt="SAAEPS logo" />
          <span>SAAEPS</span>
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">STUDENT PORTAL</p>
          <h1>
            Sign in to <span>your account</span>
          </h1>
          <p className="auth-description">
            Enter your details to continue your preparation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap">
              <Mail aria-hidden="true" size={21} />
              <input
                id="login-email"
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

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={21} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="auth-icon-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="auth-remember">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link
  to="/forgot-password"
  state={{
    backgroundLocation:
      location.state?.backgroundLocation || { pathname: "/" },
  }}
>
  Forgot password?
</Link>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-primary-button"
          >
            {loading ? "Signing in..." : "Login to SAAEPS"}
            {!loading && <ArrowRight size={21} />}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

        <p className="auth-footer">
          By signing in, you continue to your SAAEPS learning account.
        </p>
      </section>
    </main>
  );
}
