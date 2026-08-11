import React from "react";
import { Link } from "react-router-dom";


function QuickActions({ actions }) {


  const defaultActions = [
    {
      title: "Take Mock Test",
      path: "/tests",
      color: "bg-blue-600",
    },
    {
      title: "Study Planner",
      path: "/planner",
      color: "bg-green-600",
    },
    {
      title: "View Performance",
      path: "/performance",
      color: "bg-purple-600",
    },
    {
      title: "Update Profile",
      path: "/profile",
      color: "bg-orange-500",
    },
  ];


  const quickActions = actions || defaultActions;



  return (

    <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6">


      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">
        Quick Actions
      </h2>



      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
        "
      >


        {
          quickActions.map((action,index)=>(


            <Link
              key={index}
              to={action.path}
              className={`
                ${action.color}
                text-white
                rounded-xl
                p-5
                text-center
                font-semibold
                shadow-md
                transition
                hover:-translate-y-1
                hover:shadow-xl
              `}
            >

              {action.title}


            </Link>


          ))
        }


      </div>


    </section>

  );


}


export default QuickActions;