import React from "react";


function DashboardCards({ stats }) {


  const cards = [

    {
      title: "Subjects",
      value: stats?.subjects || 0,
      color: "bg-blue-600",
      icon: "📚"
    },


    {
      title: "Mock Tests",
      value: stats?.tests || 0,
      color: "bg-green-600",
      icon: "📝"
    },


    {
      title: "Average Score",
      value: `${stats?.score || 0}%`,
      color: "bg-purple-600",
      icon: "📊"
    },


    {
      title: "Study Hours",
      value: `${stats?.hours || 0} hrs`,
      color: "bg-orange-500",
      icon: "⏱️"
    }

  ];



  return (

    <section>


      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >


        {
          cards.map((card) => (

            <div
              key={card.title}
              className={`
                ${card.color}
                rounded-xl
                shadow-lg
                p-6
                text-white
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              `}
            >


              <div className="flex justify-between items-center">


                <h3 className="text-lg font-medium">
                  {card.title}
                </h3>


                <span className="text-3xl">
                  {card.icon}
                </span>


              </div>



              <p className="text-4xl font-bold mt-5">
                {card.value}
              </p>



            </div>


          ))
        }


      </div>


    </section>

  );

}


export default DashboardCards;