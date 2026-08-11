import api from "./api";


// REGISTER
export const register = async (data) => {
    return await api.post("/auth/register", data);
};


// LOGIN
export const login = async (data) => {
    return await api.post("/auth/login", data);
};


// FORGOT PASSWORD
export const forgotPassword = async (data) => {
    return await api.post("/auth/forgot-password", data);
};


// VERIFY EMAIL OTP
export const verifyOtp = async (data) => {
    return await api.post("/auth/verify-otp", data);
};


// RESEND EMAIL OTP
export const resendOtp = async (data) => {
    return await api.post("/auth/resend-otp", data);
};


// VERIFY RESET OTP
export const verifyResetOtp = async (data) => {
    return await api.post("/auth/verify-reset-otp", data);
};


// RESET PASSWORD
export const resetPassword = async (data) => {
    return await api.post("/auth/reset-password", data);
};