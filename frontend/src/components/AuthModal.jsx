
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyEmailOTP from "../pages/VerifyEmailOTP";

export default function AuthModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const modalPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
  ];

  const isOpen = modalPages.includes(location.pathname);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  const closeModal = () => {
  const background = location.state?.backgroundLocation;

  navigate(
    background
      ? `${background.pathname || "/"}${background.search || ""}${background.hash || ""}`
      : "/",
    { replace: true }
  );
};
  const pages = {
    "/login": <Login />,
    "/register": <Register />,
    "/forgot-password": <ForgotPassword />,
    "/verify-otp": (
      <VerifyEmailOTP key={location.key} />
    ),
  };

  return (
    <div
      className="auth-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <section
        className="auth-modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeModal}
          aria-label="Close authentication"
        >
          <X size={21} />
        </button>

        {pages[location.pathname]}
      </section>
    </div>
  );
}
