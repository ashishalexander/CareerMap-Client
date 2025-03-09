import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ApiError } from '@/app/lib/axios-config';
import { FormData } from '../Types/auth';

export const useSignupSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError(null);
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const handleSubmit = async (formData: FormData, validateForm: () => boolean) => {
    setIsSubmitting(true);
    setServerError(null); // Clear previous errors

    try {
      if (validateForm()) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...dataToSubmit } = formData;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
          dataToSubmit
        );

        if (response.status === 200) {
          const token = response.data.token;
          sessionStorage.setItem("signupToken", token);
          router.push("/user/otp");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract error message from response
        const errorMessage = error.response.data?.message || "An error occurred during signup";
        setServerError(errorMessage);
        console.error("Signup error:", errorMessage);
      } else if (error instanceof ApiError) {
        setServerError(error.message);
        console.error("Signup error:", error.message);
      } else {
        setServerError("An unexpected error occurred");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, serverError };
};