import React from "react";


function Header({ user = {}, setSidebarOpen }) {


  return (

    <header className="
      bg-white
      shadow-md
      px-4
      sm:px-8
      py-4
      flex
      justify-between
      items-center
    ">


      {/* Mobile Menu Button */}

      <button
        className="md:hidden text-2xl mr-3"
        onClick={() => setSidebarOpen && setSidebarOpen(true)}
      >
        ☰
      </button>




      {/* Left Section */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">

          Dashboard

        </h2>


        <p className="text-gray-500 text-sm">

          Welcome back to SAAEPS

        </p>

      </div>






      {/* Right Section */}

      <div className="
        flex
        items-center
        gap-4
      ">



        {/* Search */}

        <input

          type="text"

          placeholder="Search..."

          className="
            hidden
            sm:block
            border
            border-gray-300
            rounded-lg
            px-4
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "

        />





        {/* Notification */}

        <button className="relative text-2xl">

          🔔

          <span className="
            absolute
            -top-2
            -right-2
            bg-red-500
            text-white
            text-xs
            rounded-full
            px-1
          ">
            3
          </span>

        </button>






        {/* User */}

        <div className="flex items-center gap-3">


          <img

            src="https://ui-avatars.com/api/?name=Student&background=1E3A8A&color=fff"

            alt="Profile"

            className="
              w-10
              h-10
              rounded-full
            "

          />



          <div className="hidden sm:block">


            <h3 className="font-semibold text-gray-800">

              {user.name || "Student"}

            </h3>


            <p className="text-xs text-gray-500">

              {user.email || "student@example.com"}

            </p>


          </div>



        </div>



      </div>


    </header>

  );

}


export default Header;