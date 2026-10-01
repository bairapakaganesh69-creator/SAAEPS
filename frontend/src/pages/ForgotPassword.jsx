import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, GraduationCap, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../services/authService";


export default function ForgotPassword(){


const navigate = useNavigate();


const [email,setEmail] = useState("");

const [loading,setLoading] = useState(false);

const [message,setMessage] = useState("");

const [error,setError] = useState("");





const handleSubmit = async(e)=>{


e.preventDefault();


setLoading(true);

setMessage("");

setError("");



try{


await forgotPassword({

email

});



setMessage(
"Reset OTP has been sent to your email."
);



setTimeout(()=>{


navigate("/verify-reset-otp",{

state:{
email
}

});


},1200);



}

catch(err){


setError(

err?.response?.data?.message ||

"Unable to send OTP"

);


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

Forgot Password

</h1>



<p className="text-blue-100 text-center mt-2">

Enter your email to receive password reset OTP.

</p>



</div>







<form

onSubmit={handleSubmit}

className="mt-8 space-y-5"

>




<div>


<label className="block text-white mb-2">

Email Address

</label>



<div className="relative">


<Mail

size={20}

className="absolute left-4 top-4 text-gray-500"

/>



<input


type="email"

required

value={email}

onChange={(e)=>setEmail(e.target.value)}

placeholder="Enter your email"

className="w-full pl-12 py-3 rounded-xl bg-white text-gray-800"

/>



</div>



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

"Sending..."

:

"Send OTP"

}


</button>



</form>







<div className="mt-6 text-center">


<Link

to="/login"

className="inline-flex items-center gap-2 text-yellow-200 font-semibold"

>


<ArrowLeft size={18}/>

Back to Login


</Link>



</div>





</div>


</div>


);


}