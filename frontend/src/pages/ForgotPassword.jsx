
import { useState } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { Mail, ArrowLeft, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { forgotPassword } from "../services/authservice";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await forgotPassword({ email: email.trim() });

      setMessage("Reset OTP has been sent to your email.");

      setTimeout(() => {
        navigate("/verify-reset-otp", {
          state: { email: email.trim() },
        });
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <section className="auth-card">
        <Link to="/" className="auth-brand">
          <img src="/saaeps-logo.png" alt="SAAEPS logo" />
          <span>SAAEPS</span>
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">ACCOUNT RECOVERY</p>
          <h1>
            Forgot <span>password?</span>
          </h1>
          <p className="auth-description">
            No worries. Enter your registered email address and we'll send you
            an OTP to reset your password.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <p className="text-sm leading-6 text-slate-600">
            Use the email address linked to your SAAEPS account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="forgot-email">Email address</label>

            <div className="auth-input-wrap">
              <Mail size={19} />

              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {message && (
            <div
              className="auth-alert auth-alert-success"
              role="status"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className="auth-alert auth-alert-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-primary-button"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <hr className="auth-divider" />

       <Link
  to="/login"
  state={{
    backgroundLocation:
      location.state?.backgroundLocation || { pathname: "/" },
  }}
  replace
  className="auth-back-link"
>
  <ArrowLeft size={18} />
  Back to Login
</Link>

        <p className="auth-footer">
          Smart Academic Assistant &amp; Exam Preparation Platform
        </p>
      </section>
    </main>
  );
}
