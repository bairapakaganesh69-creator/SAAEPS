import React from "react";


function UpcomingExams({ exams=[] }) {


return (

<div className="bg-white rounded-xl shadow-lg p-5">


<h2 className="text-xl font-bold mb-4">
Upcoming Exams
</h2>



<div className="space-y-3">


{
exams.length === 0 ?

<p className="text-gray-500">
No upcoming exams
</p>

:

exams.map((exam,index)=>(


<div
key={index}
className="border rounded-lg p-3"
>

<h3 className="font-semibold">
{exam.subject}
</h3>


<p className="text-sm text-gray-500">
{exam.date}
</p>


</div>


))

}


</div>


</div>


);


}


export default UpcomingExams;