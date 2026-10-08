import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { register } from "../services/authService";


export default function Register() {


const navigate = useNavigate();


const [showPassword, setShowPassword] = useState(false);

const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [loading, setLoading] = useState(false);


const [formData, setFormData] = useState({

    fullName: "",

    email: "",

    password: "",

    confirmPassword: "",

});


const [error, setError] = useState("");



// Input change

const handleChange = (e)=>{


    setFormData({

        ...formData,

        [e.target.name]: e.target.value

    });


};




// Register Submit

const handleSubmit = async(e)=>{


    e.preventDefault();


    setError("");



    if(formData.password !== formData.confirmPassword){


        setError("Passwords do not match.");

        return;


    }



    setLoading(true);



    try{


        await register({

            fullName: formData.fullName,

            email: formData.email,

            password: formData.password,

        });



        // Move to OTP verification page

        navigate("/verify-otp",{

            state:{

                email: formData.email

            }

        });



    }
    catch(err){


        setError(

            err?.response?.data?.message ||

            "Registration failed"

        );


    }
    finally{


        setLoading(false);


    }



};





return (


<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-4">



<div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">



<div className="flex flex-col items-center">


<div className="bg-white p-4 rounded-full shadow-lg mb-4">

<GraduationCap
className="text-indigo-600"
size={40}
/>

</div>



<h1 className="text-3xl font-bold text-white">

Create Account

</h1>


<p className="text-blue-100 mt-2 text-center">

Join Smart Academic Assistant

</p>


</div>





<form
onSubmit={handleSubmit}
className="mt-8 space-y-5"
>



<div>

<label className="text-white block mb-2">

Full Name

</label>


<input

type="text"

name="fullName"

placeholder="Enter your full name"

value={formData.fullName}

onChange={handleChange}

required

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"

/>


</div>





<div>

<label className="text-white block mb-2">

Email

</label>


<input

type="email"

name="email"

placeholder="Enter your email"

value={formData.email}

onChange={handleChange}

required

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"

/>


</div>






<div>


<label className="text-white block mb-2">

Password

</label>



<div className="relative">


<input

type={showPassword ? "text" : "password"}

name="password"

placeholder="Enter password"

value={formData.password}

onChange={handleChange}

required

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"

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







<div>


<label className="text-white block mb-2">

Confirm Password

</label>



<div className="relative">


<input

type={showConfirmPassword ? "text" : "password"}

name="confirmPassword"

placeholder="Confirm password"

value={formData.confirmPassword}

onChange={handleChange}

required

className="w-full rounded-xl px-4 py-3 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"

/>



<button

type="button"

onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

className="absolute right-4 top-3 text-gray-500"

>


{
showConfirmPassword ?

<EyeOff size={22}/>

:

<Eye size={22}/>

}


</button>



</div>


</div>







{
error &&

<div className="bg-red-500 text-white rounded-lg p-3 text-sm">

{error}

</div>

}







<button

type="submit"

disabled={loading}

className="w-full bg-white text-indigo-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition"

>


{
loading ?

"Creating Account..."

:

"Register"

}


</button>





</form>







<div className="text-center text-white mt-6">


Already have an account?


<Link

to="/login"

className="ml-2 font-bold text-yellow-200 hover:text-white"

>

Login

</Link>


</div>




</div>


</div>


);


}