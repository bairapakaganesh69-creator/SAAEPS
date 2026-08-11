import {useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import {resetPassword} from "../services/authService";


export default function ResetPassword(){


const navigate = useNavigate();

const location = useLocation();


const email = location.state?.email || "";

const otp = location.state?.otp || "";



const [password,setPassword] = useState("");

const [confirmPassword,setConfirmPassword] = useState("");

const [loading,setLoading] = useState(false);

const [message,setMessage] = useState("");

const [error,setError] = useState("");





const handleReset=async()=>{


if(password !== confirmPassword){


setError("Passwords do not match.");

return;

}



try{


setLoading(true);

setError("");



await resetPassword({

email,

otp,

password

});



setMessage(

"Password changed successfully. Please login using your new password."

);



setTimeout(()=>{


navigate("/login");


},1500);



}

catch(err){


setError(

err?.response?.data?.message ||

"Unable to reset password"

);


}

finally{


setLoading(false);


}



};







return(


<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 px-4">


<div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">



<h1 className="text-3xl text-white font-bold text-center">

Create New Password

</h1>




<input

type="password"

placeholder="New Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="mt-8 w-full py-3 px-4 rounded-xl"

/>





<input

type="password"

placeholder="Confirm Password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

className="mt-4 w-full py-3 px-4 rounded-xl"

/>







{
message &&

<div className="bg-green-500 text-white p-3 rounded mt-4">

{message}

</div>

}





{
error &&

<div className="bg-red-500 text-white p-3 rounded mt-4">

{error}

</div>

}





<button

onClick={handleReset}

disabled={loading}

className="mt-5 w-full bg-white text-indigo-700 py-3 rounded-xl font-bold"

>


{

loading ?

"Updating Password..."

:

"Reset Password"

}


</button>




</div>


</div>


);


}