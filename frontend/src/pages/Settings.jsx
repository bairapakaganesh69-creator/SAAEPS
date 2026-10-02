import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  LogOut,
  Lock,
  User
} from "lucide-react";

import { useTheme } from "../context/ThemeContext.jsx";


export default function Settings() {

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();


  const [emailNotification,setEmailNotification] = useState(true);
  const [pushNotification,setPushNotification] = useState(false);
  const [examReminder,setExamReminder] = useState(true);

  const [language,setLanguage] = useState("English");



  const logout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){

      localStorage.removeItem("token");

      navigate("/login");

    }

  };



  return (

<div
className="
min-h-screen p-6
bg-gray-100
dark:bg-gray-950
text-gray-900
dark:text-white
transition-all
duration-300
"
>


<div className="max-w-4xl mx-auto">


<h1 className="
text-4xl
font-bold
mb-8
text-gray-900
dark:text-white
">
Settings
</h1>



{/* ACCOUNT */}

<section
className="
bg-white
dark:bg-gray-800
rounded-2xl
p-6
mb-6
shadow
"
>


<h2 className="
text-2xl
font-bold
mb-5
text-gray-900
dark:text-white
">
Account
</h2>



<button

onClick={()=>navigate("/profile")}

className="
flex items-center gap-3
bg-indigo-600
hover:bg-indigo-700
text-white
px-5 py-3
rounded-xl
"

>

<User size={20}/>

Edit Profile

</button>



<button

className="
flex items-center gap-3
mt-4
bg-green-600
hover:bg-green-700
text-white
px-5 py-3
rounded-xl
"

>

<Lock size={20}/>

Change Password

</button>


</section>





{/* NOTIFICATIONS */}


<section

className="
bg-white
dark:bg-gray-800
rounded-2xl
p-6
mb-6
shadow
"

>


<h2 className="
text-2xl
font-bold
mb-5
text-gray-900
dark:text-white
">
Notifications
</h2>



<Toggle

title="Email Notifications"

value={emailNotification}

setValue={setEmailNotification}

/>



<Toggle

title="Push Notifications"

value={pushNotification}

setValue={setPushNotification}

/>



<Toggle

title="Exam Reminder"

value={examReminder}

setValue={setExamReminder}

/>


</section>






{/* APPEARANCE */}


<section

className="
bg-white
dark:bg-gray-800
rounded-2xl
p-6
mb-6
shadow
"

>


<h2 className="
text-2xl
font-bold
mb-5
text-gray-900
dark:text-white
">
Appearance
</h2>



<button

onClick={toggleTheme}

className="
flex items-center gap-3
bg-indigo-600
hover:bg-indigo-700
text-white
px-5 py-3
rounded-xl
"

>


{
darkMode ?

<>

<Moon size={20}/>
Dark Theme

</>

:

<>

<Sun size={20}/>
Light Theme

</>

}


</button>


</section>







{/* LANGUAGE */}


<section

className="
bg-white
dark:bg-gray-800
rounded-2xl
p-6
mb-6
shadow
"

>


<h2 className="
text-2xl
font-bold
mb-5
text-gray-900
dark:text-white
">
Language
</h2>



<select

value={language}

onChange={(e)=>setLanguage(e.target.value)}

className="
p-3
rounded-xl
border
bg-white
dark:bg-gray-700
text-gray-900
dark:text-white
"

>

<option>
English
</option>

<option>
తెలుగు (Telugu)
</option>

<option>
हिन्दी (Hindi)
</option>


</select>


</section>






{/* LOGOUT */}


<section

className="
bg-white
dark:bg-gray-800
rounded-2xl
p-6
shadow
"

>


<button

onClick={logout}

className="
flex items-center gap-3
bg-red-600
hover:bg-red-700
text-white
px-6
py-3
rounded-xl
"

>

<LogOut size={20}/>

Logout

</button>


</section>



</div>


</div>

  );
}





function Toggle({title,value,setValue}){


return(

<div className="
flex
justify-between
items-center
mb-5
">


<p className="
text-lg
text-gray-900
dark:text-white
">

{title}

</p>



<button

onClick={()=>setValue(!value)}

className={`
w-14
h-7
rounded-full
transition

${value
?
"bg-indigo-600"
:
"bg-gray-400"
}

`}

>


<div

className={`
w-6
h-6
bg-white
rounded-full
transform
transition

${value
?
"translate-x-7"
:
"translate-x-1"
}

`}

/>


</button>



</div>


)

}