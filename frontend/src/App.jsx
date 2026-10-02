import { BrowserRouter, Routes, Route } from "react-router-dom";


// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import VerifyEmailOTP from "./pages/VerifyEmailOTP";
import VerifyResetOTP from "./pages/VerifyResetOTP";
import ResetPassword from "./pages/ResetPassword";


// Protected Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StudyPlanner from "./pages/StudyPlanner";
import MockTests from "./pages/MockTests";
import Subjects from "./pages/Subjects";
import Performance from "./pages/Performance";
import NotificationsPage from "./pages/NotificationsPage";


// Protection
import ProtectedRoute from "./components/ProtectedRoute";



function App(){


return(

<BrowserRouter>


<Routes>



{/* =====================
    AUTHENTICATION ROUTES
===================== */}



<Route

path="/"

element={<Login/>}

/>



<Route

path="/login"

element={<Login/>}

/>



<Route

path="/register"

element={<Register/>}

/>



{/* Register OTP Verification */}

<Route

path="/verify-otp"

element={<VerifyEmailOTP/>}

/>



{/* Forgot Password */}

<Route

path="/forgot-password"

element={<ForgotPassword/>}

/>



{/* Password Reset OTP */}

<Route

path="/verify-reset-otp"

element={<VerifyResetOTP/>}

/>



{/* Create New Password */}

<Route

path="/reset-password"

element={<ResetPassword/>}

/>






{/* =====================
    PROTECTED ROUTES
===================== */}




<Route

path="/dashboard"

element={

<ProtectedRoute>

<Dashboard/>

</ProtectedRoute>

}

/>





<Route

path="/profile"

element={

<ProtectedRoute>

<Profile/>

</ProtectedRoute>

}

/>





<Route

path="/settings"

element={

<ProtectedRoute>

<Settings/>

</ProtectedRoute>

}

/>





<Route

path="/planner"

element={

<ProtectedRoute>

<StudyPlanner/>

</ProtectedRoute>

}

/>





<Route

path="/tests"

element={

<ProtectedRoute>

<MockTests/>

</ProtectedRoute>

}

/>





<Route

path="/subjects"

element={

<ProtectedRoute>

<Subjects/>

</ProtectedRoute>

}

/>





<Route

path="/performance"

element={

<ProtectedRoute>

<Performance/>

</ProtectedRoute>

}

/>





<Route

path="/notifications"

element={

<ProtectedRoute>

<NotificationsPage/>

</ProtectedRoute>

}

/>




</Routes>


</BrowserRouter>


);


}


export default App;