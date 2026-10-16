
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, ShieldCheck } from "lucide-react";
import { verifyOtp, resendOtp } from "../services/authservice";

export default function VerifyEmailOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email details are missing. Please start again.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await verifyOtp({
        email,
        otp: otp.trim(),
      });

      if (location.state?.authFlow === "google") {
        const credential = location.state?.credential;

        if (!credential) {
          setError(
            "Google verification details are missing. Please start Google registration again."
          );
          return;
        }

        navigate("/google-set-password", {
          state: {
            email,
            credential,
          },
        });
        return;
      }

      setMessage("Email verified successfully. You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email details are missing. Please start registration again.");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setMessage("");

      await resendOtp({ email });

      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
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
          <p className="auth-eyebrow">ACCOUNT VERIFICATION</p>
          <h1>
            Verify your <span>email</span>
          </h1>
          <p className="auth-description">
            Enter the one-time password we sent to your email address.
          </p>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <div className="min-w-0">
            <p className="text-sm text-slate-500">OTP sent to</p>
            <p className="break-all font-semibold text-slate-800">
              {email || "Your email address"}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="auth-field">
            <label htmlFor="verify-otp">One-time password</label>
            <input
              id="verify-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter OTP"
              className="auth-otp-input"
              required
            />
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="auth-secondary-link"
          >
            {resendLoading ? "Sending OTP..." : "Resend OTP"}
          </button>
        </div>

        <hr className="auth-divider" />

        <Link
  to="/register"
  state={{
    backgroundLocation:
      location.state?.backgroundLocation || { pathname: "/" },
  }}
  replace
  className="auth-back-link"
>
  <ArrowLeft size={18} />
  Back to Register
</Link>
        <p className="auth-footer">
          Smart Academic Assistant &amp; Exam Preparation Platform
        </p>
      </section>
    </main>
  );
}
