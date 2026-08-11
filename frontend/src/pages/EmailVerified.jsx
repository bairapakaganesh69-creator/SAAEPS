import { useNavigate } from "react-router-dom";

function EmailVerified() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Email Verified Successfully
        </h1>

        <p className="mt-3 text-gray-600">
          Your email has been verified successfully.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default EmailVerified;