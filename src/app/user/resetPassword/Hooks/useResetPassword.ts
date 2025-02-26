import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '../api/auth';
import { ResetPasswordFormData, FormErrors } from '../Types/index';

export const useResetPassword = (token: string | null) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({ password: [], confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const validatePassword = (value: string): string[] => {
    const errors: string[] = [];

    if (!value) errors.push('Password is required');
    if (value.length < 8) errors.push('Password must be at least 8 characters');
    if (!/\d/.test(value)) errors.push('One number');
    if (!/[a-z]/.test(value)) errors.push('One lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('One uppercase letter needed');
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const passwordErrors = validatePassword(formData.password);
    const confirmPasswordError = formData.confirmPassword !== formData.password 
      ? 'Passwords do not match' 
      : '';

    if (passwordErrors.length > 0 || confirmPasswordError) {
      setErrors({ password: passwordErrors, confirmPassword: confirmPasswordError });
      setIsSubmitting(false);
      return;
    }

    setErrors({ password: [], confirmPassword: '' });

    if (!token) {
      setErrorMessage('Missing reset token. Please request a new password reset link.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword(token, formData.password);
      if (response.success === true) {
        setSuccessMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/user/signIn');
        }, 2000);
      } else {
        setErrorMessage(response.message || 'Password reset failed. Please try again.');
      }
    } catch (error) {
        console.error(error)
      setErrorMessage('An error occurred during password reset. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    successMessage,
    errorMessage,
    isSubmitting,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};