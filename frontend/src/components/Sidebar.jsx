import React from "react";
import { Link } from "react-router-dom";


function Sidebar({ sidebarOpen, setSidebarOpen }) {


  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
    },

    {
      name: "Study Planner",
      path: "/planner",
    },

    {
      name: "Mock Tests",
      path: "/tests",
    },

    {
      name: "Subjects",
      path: "/subjects",
    },

    {
      name: "Performance",
      path: "/performance",
    },

    {
      name: "Notifications",
      path: "/notifications",
    },

    {
      name: "Profile",
      path: "/profile",
    },

    {
      name: "Settings",
      path: "/settings",
    },

  ];



  return (

    <aside
      className={`
        fixed
        md:static
        top-0
        left-0
        z-40
        w-64
        min-h-screen
        bg-blue-900
        text-white
        p-6
        transition-transform
        duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}

      `}
    >



      <div className="mb-10">


        <h1 className="text-2xl font-bold">
          SAAEPS
        </h1>


        <p className="text-blue-200 text-sm">
          Smart Academic Assistant
        </p>


      </div>





      <nav>


        <ul className="space-y-3">


          {
            menuItems.map((item)=>(


              <li key={item.name}>


                <Link

                  to={item.path}

                  onClick={() => setSidebarOpen && setSidebarOpen(false)}

                  className="
                    block
                    p-3
                    rounded-lg
                    hover:bg-blue-700
                    transition
                  "

                >

                  {item.name}

                </Link>


              </li>


            ))
          }


        </ul>


      </nav>





      <div className="absolute bottom-6 text-blue-300 text-sm">

        © 2026 SAAEPS

      </div>



    </aside>


  );

}


export default Sidebar;