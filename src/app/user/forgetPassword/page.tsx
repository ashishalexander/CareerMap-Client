"use client";
import { useState, FormEvent } from "react";
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import api from '../../lib/axios-config'; // Update this path accordingly

const ForgotPassword: React.FC = () => {
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
      const response = await api.post('/api/users/forget-password', { email });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <button 
            onClick={() => window.history.back()}
            className="self-start mb-4 text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </button>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out sm:text-sm"
                placeholder="Enter your email address"
                required
              />
            </div>
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
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
                Sending Reset Link...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
