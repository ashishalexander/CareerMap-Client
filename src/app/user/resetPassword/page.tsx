// src/app/user/reset-password/page.tsx
"use client"

import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { ResetPasswordForm } from './components/ResetPassword';
import { useResetPassword } from './Hooks/useResetPassword';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const {
    formData,
    errors,
    successMessage,
    errorMessage,
    isSubmitting,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useResetPassword(token);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
            Please enter your new password below. Make sure it&apos;s secure and easy to remember.
          </p>
        </div>
        
        <ResetPasswordForm
          formData={formData}
          errors={errors}
          successMessage={successMessage}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          showPassword={showPassword}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;