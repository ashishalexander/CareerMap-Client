import { useState, FormEvent } from 'react';
import { sendPasswordResetLink } from '../api/index';

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await sendPasswordResetLink(email);
      setSuccessMessage("Password reset link has been sent to your email address.");
      setEmail('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to send reset password link. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    successMessage,
    errorMessage,
    isSubmitting,
    emailError,
    handleChange,
    handleSubmit
  };
};