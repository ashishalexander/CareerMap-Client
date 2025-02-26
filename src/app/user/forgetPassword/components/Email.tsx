import { Mail } from 'lucide-react';

interface EmailInputProps {
  email: string;
  emailError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({ email, emailError, onChange }) => {
  return (
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
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out sm:text-sm"
          placeholder="Enter your email address"
          required
        />
      </div>
      {emailError && (
        <p className="mt-2 text-sm text-red-600">{emailError}</p>
      )}
    </div>
  );
};