import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ApiError } from '@/app/lib/axios-config';
import { FormData } from '../Types/auth';

export const useSignupSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData, validateForm: () => boolean) => {
    setIsSubmitting(true);

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
      if (error instanceof ApiError) {
        console.error("Signup error:", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
