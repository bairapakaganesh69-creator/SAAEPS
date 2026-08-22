import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white fixed left-0 top-0">

      <div className="px-6 py-6">
        <h2 className="text-xl font-bold">
          SAAEPS Admin
        </h2>
      </div>

      <nav className="mt-4">

        <Link to="/Dashboard" className="block px-7 py-4 hover:bg-blue-800">
          Dashboard
        </Link>

        <Link to="/students" className="block px-7 py-4 hover:bg-blue-800">
          Students
        </Link>

        <Link to="/faculty" className="block px-7 py-4 hover:bg-blue-800">
          Faculty
        </Link>

        <Link to="/courses" className="block px-7 py-4 hover:bg-blue-800">
          Courses
        </Link>

        <Link to="/exams" className="block px-7 py-4 hover:bg-blue-800">
          Exams
        </Link>

        <Link to="/results" className="block px-7 py-4 hover:bg-blue-800">
          Results
        </Link>

        <Link to="/notifications" className="block px-7 py-4 hover:bg-blue-800">
          Notifications
        </Link>

        <Link to="/profile" className="block px-7 py-4 hover:bg-blue-800">
          Profile
        </Link>

        <Link to="/settings" className="block px-7 py-4 hover:bg-blue-800">
          Settings
        </Link>

      </nav>

    </div>
  );
}

export default Sidebar;

