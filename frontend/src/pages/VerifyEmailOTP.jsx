import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { verifyOtp, resendOtp } from "../services/authService";


export default function VerifyEmailOTP(){


const navigate = useNavigate();

const location = useLocation();


const email = location.state?.email || "";



const [otp,setOtp] = useState("");

const [loading,setLoading] = useState(false);

const [resendLoading,setResendLoading] = useState(false);

const [error,setError] = useState("");

const [message,setMessage] = useState("");





const handleVerify = async()=>{


if(!otp){

    setError("Please enter OTP");

    return;

}



try{


setLoading(true);

setError("");



await verifyOtp({

    email,

    otp

});



setMessage(
"Email verified successfully. You can now login."
);



setTimeout(()=>{

    navigate("/login");

},1500);



}
catch(err){


setError(

err?.response?.data?.message ||

"Invalid OTP"

);


}
finally{


setLoading(false);


}



};







const handleResend = async()=>{


try{


setResendLoading(true);

setError("");



await resendOtp({

    email

});



setMessage(
"OTP sent successfully."
);



}
catch(err){


setError(

err?.response?.data?.message ||

"Unable to resend OTP"

);


}
finally{


setResendLoading(false);


}


};





return(


<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-4">


<div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">



<div className="flex flex-col items-center">


<div className="bg-white p-4 rounded-full shadow-lg mb-4">

<GraduationCap

size={40}

className="text-indigo-600"

/>

</div>



<h1 className="text-3xl font-bold text-white">

Verify Email

</h1>



<p className="text-blue-100 mt-3 text-center">

OTP sent to:

<br/>

<span className="font-semibold">

{email || "your email"}

</span>

</p>


</div>





<input

type="text"

maxLength="6"

value={otp}

onChange={(e)=>setOtp(e.target.value)}

placeholder="Enter OTP"

className="mt-8 w-full text-center tracking-[10px] text-xl py-3 rounded-xl outline-none"

/>





{
message &&

<div className="bg-green-500 text-white rounded-lg p-3 mt-4 text-sm">

{message}

</div>

}






{
error &&

<div className="bg-red-500 text-white rounded-lg p-3 mt-4 text-sm">

{error}

</div>

}






<button

onClick={handleVerify}

disabled={loading}

className="w-full mt-5 bg-white text-indigo-700 py-3 rounded-xl font-bold"

>


{

loading ?

"Verifying..."

:

"Verify OTP"

}


</button>







<button

onClick={handleResend}

disabled={resendLoading}

className="w-full mt-4 text-yellow-200 font-semibold"

>


{

resendLoading ?

"Sending..."

:

"Resend OTP"

}


</button>






<button

onClick={()=>navigate("/login")}

className="w-full mt-4 text-white"

>

Back to Login

</button>





</div>


</div>


);


}