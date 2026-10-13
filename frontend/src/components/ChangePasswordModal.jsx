import { useState } from "react";
import { X, Lock } from "lucide-react";
import api from "../services/api";

export default function ChangePasswordModal({ open, onClose }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPasswordData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must differ from your current password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to change password.");
        return;
      }

      alert(response.data.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (err) {
      console.error("Change Password Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="change-password-title"
            className="text-2xl font-bold text-indigo-700"
          >
            Change Password
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close change password dialog"
            className="disabled:opacity-50"
          >
            <X size={25} />
          </button>
        </div>

        <form onSubmit={updatePassword}>
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            show={showCurrentPassword}
            setShow={setShowCurrentPassword}
            disabled={loading}
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            show={showNewPassword}
            setShow={setShowNewPassword}
            disabled={loading}
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            disabled={loading}
          />

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  disabled,
}) {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="block font-semibold mb-2 text-gray-800">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={20}
          className="absolute left-3 top-4 text-gray-500"
        />

        <input
          id={name}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          disabled={disabled}
          required
          minLength={name === "currentPassword" ? undefined : 6}
          className="w-full border rounded-xl pl-10 pr-12 py-3 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-3 text-xl disabled:opacity-50"
        >
          {show ? "👁️" : "🙈"}
        </button>
      </div>
    </div>
  );
}
