import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Camera,
  Pencil,
} from "lucide-react";

import ChangePasswordModal from "../components/ChangePasswordModal";


export default function Profile() {


  const defaultProfile = {
    fullName: "Afreen",
    email: "afreen@gmail.com",
    department: "Computer Science Engineering",
    year: "2nd Year",
    phone: "+91 9876543210",
  };


  const [profile, setProfile] = useState(defaultProfile);


  const [backupProfile, setBackupProfile] = useState(defaultProfile);


  const [isEditing, setIsEditing] = useState(false);


  const [showPasswordModal, setShowPasswordModal] = useState(false);



  // input change

  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]: e.target.value,

    });

  };




  // Start editing

  const handleEdit = () => {

    setBackupProfile(profile);

    setIsEditing(true);

  };




  // Save profile

  const handleSave = () => {

    alert("Profile Updated Successfully");

    setIsEditing(false);

  };




  // Cancel editing

  const handleCancel = () => {

    setProfile(backupProfile);

    setIsEditing(false);

  };





  return (

    <div className="min-h-screen bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 py-10 px-4">


      <div className="max-w-5xl mx-auto bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">



        {/* Header */}

        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-bold text-white">
              My Profile
            </h1>


            <p className="text-blue-100 mt-2">
              Manage your personal information
            </p>


          </div>




          <button

            onClick={handleEdit}

            className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100"

          >

            <Pencil size={18}/>

            Edit Profile

          </button>



        </div>





        {/* Profile Image */}


        <div className="flex flex-col items-center">


          <div className="relative">


            <img

              src="https://ui-avatars.com/api/?name=Afreen&background=ffffff&color=4f46e5&size=200"

              alt="profile"

              className="w-40 h-40 rounded-full border-4 border-white shadow-lg"

            />


            <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full">

              <Camera size={18}/>

            </button>


          </div>



          <h2 className="text-2xl text-white font-bold mt-5">

            {profile.fullName}

          </h2>



          <p className="text-blue-100">

            Student

          </p>


        </div>







        {/* Profile Fields */}


        <div className="grid md:grid-cols-2 gap-6 mt-10">


          <InputField

            icon={<User size={20}/>}

            label="Full Name"

            name="fullName"

            value={profile.fullName}

            disabled={!isEditing}

            onChange={handleChange}

          />




          <InputField

            icon={<Mail size={20}/>}

            label="Email"

            name="email"

            value={profile.email}

            disabled={!isEditing}

            onChange={handleChange}

          />





          <InputField

            icon={<GraduationCap size={20}/>}

            label="Department"

            name="department"

            value={profile.department}

            disabled={!isEditing}

            onChange={handleChange}

          />





          <InputField

            icon={<Calendar size={20}/>}

            label="Year"

            name="year"

            value={profile.year}

            disabled={!isEditing}

            onChange={handleChange}

          />





          <div className="md:col-span-2">


            <InputField

              icon={<Phone size={20}/>}

              label="Phone Number"

              name="phone"

              value={profile.phone}

              disabled={!isEditing}

              onChange={handleChange}

            />


          </div>



        </div>







        {/* Buttons */}



        <div className="flex justify-center gap-4 mt-10">



          <button

            onClick={handleSave}

            disabled={!isEditing}

            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"

          >

            Save Changes

          </button>




          <button

            onClick={handleCancel}

            disabled={!isEditing}

            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"

          >

            Cancel

          </button>





          <button

            onClick={()=>setShowPasswordModal(true)}

            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"

          >

            Change Password

          </button>



        </div>





        {/* Password Component */}


        <ChangePasswordModal

          open={showPasswordModal}

          onClose={()=>setShowPasswordModal(false)}

        />



      </div>


    </div>

  );

}








function InputField({

icon,

label,

name,

value,

onChange,

disabled

}){


return (

<div>


<label className="text-white block mb-2">

{label}

</label>



<div className="relative">


<div className="absolute left-4 top-4 text-gray-500">

{icon}

</div>



<input

type="text"

name={name}

value={value}

disabled={disabled}

onChange={onChange}

className={`w-full pl-12 py-3 rounded-xl outline-none text-gray-800

${disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"}

`}

/>



</div>


</div>

);


}