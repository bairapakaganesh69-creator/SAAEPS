import { useState } from "react";
import { X, Lock } from "lucide-react";


export default function ChangePasswordModal({ open, onClose }) {


  const [passwordData, setPasswordData] = useState({

    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

  });



  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);





  const handleChange = (e) => {

    setPasswordData({

      ...passwordData,

      [e.target.name]: e.target.value,

    });

  };





  const updatePassword = () => {


    if(passwordData.newPassword !== passwordData.confirmPassword){

      alert("Passwords do not match");

      return;

    }



    alert("Password Updated Successfully");



    setPasswordData({

      currentPassword:"",
      newPassword:"",
      confirmPassword:"",

    });



    onClose();

  };





  if(!open) return null;





  return (

    <div className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
      p-4
    ">



      <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        p-8
        w-full
        max-w-lg
      ">



        <div className="
          flex
          justify-between
          items-center
          mb-6
        ">


          <h2 className="
            text-2xl
            font-bold
            text-indigo-700
          ">
            Change Password
          </h2>



          <button onClick={onClose}>
            <X size={25}/>
          </button>


        </div>





        <PasswordInput

          label="Current Password"

          name="currentPassword"

          value={passwordData.currentPassword}

          onChange={handleChange}

          show={showCurrentPassword}

          setShow={setShowCurrentPassword}

        />





        <PasswordInput

          label="New Password"

          name="newPassword"

          value={passwordData.newPassword}

          onChange={handleChange}

          show={showNewPassword}

          setShow={setShowNewPassword}

        />





        <PasswordInput

          label="Confirm Password"

          name="confirmPassword"

          value={passwordData.confirmPassword}

          onChange={handleChange}

          show={showConfirmPassword}

          setShow={setShowConfirmPassword}

        />






        <button

          onClick={updatePassword}

          className="
            w-full
            mt-6
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-xl
            font-semibold
          "

        >

          Update Password

        </button>



      </div>


    </div>

  );

}







function PasswordInput({

  label,

  name,

  value,

  onChange,

  show,

  setShow

}) {


  return (

    <div className="mb-5">


      <label className="block font-semibold mb-2">

        {label}

      </label>




      <div className="relative">



        <Lock

          size={20}

          className="
            absolute
            left-3
            top-4
            text-gray-500
          "

        />





        <input

          type={show ? "text" : "password"}

          name={name}

          value={value}

          onChange={onChange}

          className="
            w-full
            border
            rounded-xl
            pl-10
            pr-12
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "

        />






        <button

          type="button"

          onClick={() => setShow(!show)}

          className="
            absolute
            right-3
            top-3
            text-xl
          "

        >

          {
            show ? "👁️" : "🙈"
          }


        </button>




      </div>


    </div>

  );

}