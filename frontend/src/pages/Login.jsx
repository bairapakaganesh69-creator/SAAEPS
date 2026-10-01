import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { login } from "../services/authService";


export default function Login() {


const navigate = useNavigate();


const [showPassword,setShowPassword] = useState(false);

const [loading,setLoading] = useState(false);


const [formData,setFormData] = useState({

email:"",
password:"",
remember:false

});


const [error,setError] = useState("");

const [message,setMessage] = useState("");





const handleChange=(e)=>{


const {name,value,type,checked}=e.target;


setFormData({

...formData,

[name]: type==="checkbox" ? checked : value

});


};






const handleSubmit=async(e)=>{


e.preventDefault();


setError("");

setMessage("");

setLoading(true);



try{


const res = await login({

email:formData.email,

password:formData.password

});



localStorage.setItem(
"token",
res.data.token
);



localStorage.setItem(
"user",
JSON.stringify(res.data.user)
);



setMessage(
"Login successful"
);



setTimeout(()=>{


navigate("/dashboard");


},800);



}

catch(err){



const backendMessage =
err?.response?.data?.message;



switch(backendMessage){


case "Invalid password":

setError("Incorrect password");

break;



case "User not found":

setError("Email not registered");

break;



case "Please verify your email":

setError("Please verify your email first");

break;



case "Invalid credentials":

setError("Invalid email or password");

break;



default:

setError(
"Something went wrong. Please try again."
);



}



}

finally{


setLoading(false);


}



};






return(


<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 px-4">


<div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">



<div className="flex flex-col items-center">


<div className="bg-white p-4 rounded-full shadow-lg mb-4">


<GraduationCap

size={40}

className="text-indigo-600"

/>


</div>



<h1 className="text-3xl font-bold text-white">

Welcome Back

</h1>


<p className="text-blue-100 text-center mt-2">

Smart Academic Assistant & Exam Preparation Platform

</p>


</div>






<form
onSubmit={handleSubmit}
className="mt-8 space-y-5"
>



<div>


<label className="block text-white mb-2">

Email

</label>


<input

type="email"

name="email"

required

value={formData.email}

onChange={handleChange}

placeholder="Enter your email"

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none"

/>


</div>







<div>


<label className="block text-white mb-2">

Password

</label>



<div className="relative">


<input

type={showPassword ? "text":"password"}

name="password"

required

value={formData.password}

onChange={handleChange}

placeholder="Enter your password"

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none"

/>




<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="absolute right-4 top-3 text-gray-500"

>


{

showPassword ?

<EyeOff size={22}/>

:

<Eye size={22}/>

}


</button>



</div>



</div>







<div className="flex justify-between items-center">


<label className="flex gap-2 text-white items-center">


<input

type="checkbox"

name="remember"

checked={formData.remember}

onChange={handleChange}

/>


Remember Me


</label>





<Link

to="/forgot-password"

className="text-yellow-200"

>

Forgot Password?

</Link>



</div>






{
message &&

<div className="bg-green-500 text-white p-3 rounded-lg">

{message}

</div>

}





{
error &&

<div className="bg-red-500 text-white p-3 rounded-lg">

{error}

</div>

}







<button

disabled={loading}

className="w-full bg-white text-indigo-700 py-3 rounded-xl font-bold"

>


{

loading ?

"Logging in..."

:

"Login"

}



</button>





</form>





<div className="mt-6 text-center text-white">


Don't have an account?


<Link

to="/register"

className="ml-2 text-yellow-200 font-bold"

>

Register

</Link>


</div>



</div>


</div>


);


}