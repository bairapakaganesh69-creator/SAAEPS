import { useEffect, useState } from "react";
import api from "../services/api";
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
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    department: "",
    year: "",
    phone: "",
  });

  const [backupProfile, setBackupProfile] = useState(profile);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // GET LOGGED-IN USER PROFILE
  // --------------------------------

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/profile");

        if (response.data?.success) {
          const user = response.data.user;

         const loadedProfile = {
  fullName: user.fullName || "",
  email: user.email || "",
  department: user.department || "",
  year: user.year || "",
  phone: user.phone || "",
};

          setProfile(loadedProfile);
          setBackupProfile(loadedProfile);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --------------------------------
  // INPUT CHANGE
  // --------------------------------

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------
  // START EDITING
  // --------------------------------

  const handleEdit = () => {
    setBackupProfile(profile);
    setError("");
    setIsEditing(true);
  };

  // --------------------------------
  // SAVE PROFILE
  // --------------------------------

 const handleSave = async () => {
  try {
    setSaving(true);
    setError("");

    const response = await api.put("/auth/profile", {
      fullName: profile.fullName,
      email: profile.email,
      department: profile.department,
      year: profile.year,
      phone: profile.phone,
    });

    if (response.data?.success) {
      const updatedUser = response.data.user;

      const updatedProfile = {
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        department: updatedUser.department || "",
        year: updatedUser.year || "",
        phone: updatedUser.phone || "",
      };

      setProfile(updatedProfile);
      setBackupProfile(updatedProfile);

      // Keep localStorage synchronized
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedProfile,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
        })
      );

      setIsEditing(false);

      alert("Profile Updated Successfully");
    }
  } catch (error) {
    console.error("Profile Update Error:", error);

    setError(
      error.response?.data?.message ||
        "Failed to update profile"
    );
  } finally {
    setSaving(false);
  }
};
  // --------------------------------
  // CANCEL EDITING
  // --------------------------------

  const handleCancel = () => {
    setProfile(backupProfile);
    setError("");
    setIsEditing(false);
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500">
        <div className="bg-white/20 backdrop-blur-xl px-8 py-6 rounded-2xl text-white text-lg font-semibold">
          Loading Profile...
        </div>
      </div>
    );
  }

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
            disabled={isEditing}
            className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50"
          >
            <Pencil size={18} />
            Edit Profile
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-500/90 text-white px-5 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Profile Image */}

        <div className="flex flex-col items-center">

          <div className="relative">

            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile.fullName || "Student"
              )}&background=ffffff&color=4f46e5&size=200`}
              alt="profile"
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
            />

            <button
              type="button"
              className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full"
            >
              <Camera size={18} />
            </button>

          </div>

          <h2 className="text-2xl text-white font-bold mt-5">
            {profile.fullName || "Student"}
          </h2>

          <p className="text-blue-100">
            Student
          </p>

        </div>

        {/* Profile Fields */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <InputField
            icon={<User size={20} />}
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <InputField
            icon={<Mail size={20} />}
            label="Email"
            name="email"
            value={profile.email}
              disabled={!isEditing}
            onChange={handleChange}
          />

          <InputField
            icon={<GraduationCap size={20} />}
            label="Department"
            name="department"
            value={profile.department}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <InputField
            icon={<Calendar size={20} />}
            label="Year"
            name="year"
            value={profile.year}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <div className="md:col-span-2">

            <InputField
              icon={<Phone size={20} />}
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
            disabled={!isEditing || saving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={handleCancel}
            disabled={!isEditing || saving}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
          >
            Change Password
          </button>

        </div>

        {/* Password Component */}

        <ChangePasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

      </div>

    </div>
  );
}


// --------------------------------
// INPUT FIELD COMPONENT
// --------------------------------

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  disabled,
}) {
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
          className={`w-full pl-12 py-3 rounded-xl outline-none text-gray-800 ${
            disabled
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white"
          }`}
        />

      </div>

    </div>
  );
}