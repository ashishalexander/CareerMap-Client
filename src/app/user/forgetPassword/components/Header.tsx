import { Mail, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  return (
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
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
    </div>
  );
};
