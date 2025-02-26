import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { ResetPasswordFormData, FormErrors } from '../Types/index';

interface ResetPasswordFormProps {
  formData: ResetPasswordFormData;
  errors: FormErrors;
  successMessage: string | null;
  errorMessage: string | null;
  isSubmitting: boolean;
  showPassword: {
    password: boolean;
    confirmPassword: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  formData,
  errors,
  successMessage,
  errorMessage,
  isSubmitting,
  showPassword,
  handleChange,
  handleSubmit,
  togglePasswordVisibility,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword.password}
          toggleVisibility={() => togglePasswordVisibility('password')}
          placeholder="Enter your new password"
          errors={errors.password}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showPassword.confirmPassword}
          toggleVisibility={() => togglePasswordVisibility('confirmPassword')}
          placeholder="Confirm your new password"
          errors={errors.confirmPassword ? [errors.confirmPassword] : []}
        />
      </div>

      {successMessage && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200 flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Resetting Password...
          </span>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );
};