import React from "react";


function Notifications({ notifications = [] }) {


return (

<div className="bg-white rounded-xl shadow-lg p-5">


<h2 className="text-xl font-bold mb-4">
Notifications
</h2>


{
notifications.length === 0 ?

(
<p className="text-gray-500">
No notifications
</p>
)

:

(

<div className="space-y-3">

{
notifications.map((item,index)=>(

<div
key={index}
className="border-b pb-3"
>

<p className="text-gray-700">
{item.message}
</p>


</div>

))
}

</div>

)

}


</div>

);


}


export default Notifications;