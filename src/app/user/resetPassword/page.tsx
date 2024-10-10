"use client"
import { useState, FormEvent } from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/axios-config'

interface FormErrors {
  password: string[];
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router =useRouter()

  const [formData, setFormData] = useState({
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

  const validatePassword = (value: string): string [] => {
    const errors: string[] = [];

    if (!value) errors.push('Password is required');
    if (value.length < 8) errors.push('Password must be at least 8 characters');
    if (!/\d/.test(value)) errors.push(' one number');
    if (!/[a-z]/.test(value)) errors.push(' one lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push(' one uppercase letter needed.');
    return errors;
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('form submitted')
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.confirmPassword !== formData.password 
      ? 'Passwords do not match' 
      : '';

    if (passwordError.length>0 || confirmPasswordError) {
      setErrors({ password: passwordError, confirmPassword: confirmPasswordError });
      setIsSubmitting(false);
      return;
    }

    setErrors({ password: [], confirmPassword:'' });

    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`, {
        token,
        newPassword:formData.password
      });
      console.log(response)
      if(response.data="true"){
        router.push('/user/signIn')
      }
    } catch (error) {
      setErrorMessage('An error occurred during password reset. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Please enter your new password below. Make sure it's secure and easy to remember.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out sm:text-sm"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                >
                  {showPassword.password ? 
                    <EyeOff className="h-5 w-5 text-gray-400" /> : 
                    <Eye className="h-5 w-5 text-gray-400" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out sm:text-sm"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                >
                  {showPassword.confirmPassword ? 
                    <EyeOff className="h-5 w-5 text-gray-400" /> : 
                    <Eye className="h-5 w-5 text-gray-400" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;