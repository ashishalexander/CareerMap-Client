"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Timer, Send, CheckCircle2 } from "lucide-react";
import Swal from 'sweetalert2';
import axios from "axios";


const AlternateOtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [timer, setTimer] = useState<number>(30);
  const [isResendVisible, setIsResendVisible] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        setIsResendVisible(true);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (
    element: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = element.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
   
    try {
      const token =sessionStorage.getItem('signupToken')
      if (!token) {
        console.error("No access token found in session storage.");
        return;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-otp`, { otpCode },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );  
      console.log(response)
      Swal.fire({
        title: 'OTP Verified!',
        text: 'You have successfully verified your OTP.',
        icon: 'success',
        confirmButtonText: 'Proceed'
      }).then(() => {
        // Navigate to the Feed page after the user confirms the alert
        router.push("/user/signIn");
      });
  } catch (error) {
      console.error('Error verifying OTP:', error);
      // Optionally show an error message to the user
      Swal.fire({
        title: 'Verification Failed!',
        text: 'The OTP code is incorrect. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
  }
  };

  const handleResend = async() => {
    setOtp(new Array(4).fill(""));
    setTimer(30);
    setIsResendVisible(false);
    inputRefs.current[0]?.focus();
    const token = sessionStorage.getItem('signupToken')
    if (!token) {
      console.error("No access token found in session storage");
      return;
    }
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/resend-otp`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      console.log('Resend OTP Response:', response);
      Swal.fire({
        title: 'OTP Sent!',
        text: 'A new OTP has been sent to your phone.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    }catch(error){
      console.error('Error resending otp:',error)
      Swal.fire({
        title: 'Error!',
        text: 'There was an error resending the OTP. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-2xl">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Authentication Required
            </h1>
            <p className="mt-3 text-gray-600">
              We&apos;ve sent a 4-digit code to your registered email. Please
              enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <label className="text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-4">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              {timer > 0 ? (
                <div className="flex items-center text-gray-600 space-x-2">
                  <Timer className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">
                    Resend available in{" "}
                    <span className="font-bold">{timer}s</span>
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Resend Code
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white text-lg font-semibold rounded-xl hover:bg-emerald-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Verify and Continue
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Having trouble?{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlternateOtpPage;


