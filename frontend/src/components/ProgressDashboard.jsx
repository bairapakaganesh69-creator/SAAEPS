import React from "react";


function ProgressDashboard({ progressData = [] }) {


  return (

    <section className="bg-white shadow-lg rounded-xl p-4 sm:p-6">


      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl sm:text-2xl font-bold">
          Learning Progress
        </h2>


        <button className="text-blue-600 hover:underline">
          View Report
        </button>

      </div>



      <div className="space-y-6">


        {progressData.length === 0 ? (

          <p className="text-gray-500">
            No progress data available
          </p>

        ) : (

          progressData.map((item,index)=>(

            <div key={index}>


              <div className="flex justify-between mb-2">

                <span className="text-gray-700 font-medium">
                  {item.subject}
                </span>


                <span>
                  {item.progress}%
                </span>

              </div>



              <div className="bg-gray-200 rounded-full h-3">

                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width:`${item.progress}%`
                  }}
                >

                </div>

              </div>


            </div>


          ))

        )}


      </div>


    </section>

  );

}


export default ProgressDashboard;