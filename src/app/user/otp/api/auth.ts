import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const verifyOtp = async (otpCode: string, token: string) => {
  const response = await axios.post(
    `${API_URL}/api/users/verify-otp`, 
    { otpCode },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response;
};

export const resendOtp = async (token: string) => {
  const response = await axios.get(
    `${API_URL}/api/users/resend-otp`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response;
};