import React from "react";


function RecentTests({ tests=[] }) {


return (

<div className="bg-white rounded-xl shadow-lg p-5">


<h2 className="text-xl font-bold mb-4">
Recent Tests
</h2>



<div className="overflow-x-auto">


<table className="min-w-full">

<thead>

<tr className="border-b">

<th className="text-left p-3">
Test
</th>

<th className="text-left p-3">
Score
</th>

<th className="text-left p-3">
Date
</th>

</tr>

</thead>



<tbody>


{
tests.length === 0 ?

(
<tr>
<td className="p-3">
No tests found
</td>
</tr>
)

:

tests.map((test,index)=>(

<tr key={index}
className="border-b"
>

<td className="p-3">
{test.name}
</td>


<td className="p-3">
{test.score}%
</td>


<td className="p-3">
{test.date}
</td>


</tr>


))

}


</tbody>


</table>


</div>


</div>


);


}


export default RecentTests;