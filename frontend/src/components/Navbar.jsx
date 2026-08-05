function Navbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8">

      <h2 className="text-xl font-bold text-blue-900">
        Admin Panel
      </h2>

      <div className="flex items-center gap-5">
        <span className="text-gray-600">
          Welcome, Admin
        </span>

        <button className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;