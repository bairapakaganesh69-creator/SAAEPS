import {useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import {GraduationCap} from "lucide-react";
import {verifyResetOtp} from "../services/authService";


export default function VerifyResetOTP(){


const navigate = useNavigate();

const location = useLocation();


const email = location.state?.email || "";



const [otp,setOtp] = useState("");

const [loading,setLoading] = useState(false);

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



await verifyResetOtp({

email,

otp

});



setMessage(
"OTP verified successfully."
);



setTimeout(()=>{


navigate("/reset-password",{

state:{
email,
otp
}

});


},1000);



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






return(


<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 px-4">



<div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">


<div className="flex flex-col items-center">


<div className="bg-white p-4 rounded-full mb-4">


<GraduationCap

size={40}

className="text-indigo-600"

/>


</div>



<h1 className="text-3xl text-white font-bold">

Verify Reset OTP

</h1>


<p className="text-blue-100 mt-3 text-center">

OTP sent to

<br/>

{email}

</p>


</div>





<input


value={otp}

onChange={(e)=>setOtp(e.target.value)}

maxLength="6"

placeholder="Enter OTP"

className="mt-8 w-full py-3 rounded-xl text-center text-xl tracking-[10px]"

/>





{
message &&

<div className="bg-green-500 text-white p-3 mt-4 rounded">

{message}

</div>

}





{
error &&

<div className="bg-red-500 text-white p-3 mt-4 rounded">

{error}

</div>

}





<button

onClick={handleVerify}

disabled={loading}

className="mt-5 w-full bg-white text-indigo-700 py-3 rounded-xl font-bold"

>


{

loading ?

"Verifying..."

:

"Verify OTP"

}


</button>



</div>


</div>


);


}