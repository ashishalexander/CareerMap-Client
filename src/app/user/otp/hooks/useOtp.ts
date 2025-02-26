import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { verifyOtp, resendOtp } from '../api/auth';

export const useOtp = () => {
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
      const token = sessionStorage.getItem('signupToken');
      if (!token) {
        console.error("No access token found in session storage.");
        return;
      }
      
      await verifyOtp(otpCode, token);
      
      await Swal.fire({
        title: 'OTP Verified!',
        text: 'You have successfully verified your OTP.',
        icon: 'success',
        confirmButtonText: 'Proceed'
      });
      
      router.push("/user/signIn");
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.fire({
        title: 'Verification Failed!',
        text: 'The OTP code is incorrect. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  const handleResend = async () => {
    setOtp(new Array(4).fill(""));
    setTimer(30);
    setIsResendVisible(false);
    inputRefs.current[0]?.focus();

    const token = sessionStorage.getItem('signupToken');
    if (!token) {
      console.error("No access token found in session storage");
      return;
    }

    try {
      await resendOtp(token);
      Swal.fire({
        title: 'OTP Sent!',
        text: 'A new OTP has been sent to your phone.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error resending otp:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error resending the OTP. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    }
  };

  return {
    otp,
    timer,
    isResendVisible,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleResend
  };
};