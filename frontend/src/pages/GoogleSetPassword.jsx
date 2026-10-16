
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { googleSetPassword } from "../services/authservice";

export default function GoogleSetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const credential = location.state?.credential || "";

  const [examType, setExamType] = useState("ECET");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !credential) {
      setError(
        "Google verification details are missing. Please start Google registration again."
      );
      return;
    }

    if (examType === "ECET" && !branch) {
      setError("Please select your branch.");
      return;
    }

    // Password can be any non-empty length.
    if (password.length === 0) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await googleSetPassword({
        email,
        credential,
        newPassword: password,
        examType,
        branch: examType === "ECET" ? branch : null,
      });

      const data = response.data;

      if (!data.token || !data.user) {
        setError("The server did not return a complete login response.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth:changed"));

      if (data.user.role === "admin") {
        navigate("/Dashboard", { replace: true });
      } else if (data.user.role === "student") {
        navigate("/student-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to complete registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-800 to-violet-700 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-blue-50 p-4">
            <ShieldCheck size={38} className="text-blue-700" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Complete your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Choose your exam preparation details and create a password for
            your SAAEPS account.
          </p>

          <p className="mt-3 break-all text-sm font-semibold text-blue-700">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="google-examType"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Exam preparation type
            </label>

            <div className="relative">
              <GraduationCap
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="google-examType"
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  setBranch("");
                }}
                className={`${selectClass} pl-11`}
                required
              >
                <option value="ECET">ECET</option>
                <option value="POLYCET">POLYCET</option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {examType === "ECET" && (
            <div>
              <label
                htmlFor="google-branch"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Branch selection
              </label>

              <div className="relative">
                <select
                  id="google-branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select your branch</option>
                  <option value="CSE">
                    CSE — Computer Science and Engineering
                  </option>
                  <option value="ECE">
                    ECE — Electronics and Communication Engineering
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="google-new-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Create password
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="google-new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                required
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="google-confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm password
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="google-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-violet-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-blue-800 hover:to-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Set password and continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need to restart?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-700 hover:text-violet-700"
          >
            Return to registration
          </Link>
        </p>
      </section>
    </main>
  );
}
