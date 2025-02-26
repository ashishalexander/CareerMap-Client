import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleVisibility: () => void;
  placeholder: string;
  errors?: string[];
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  showPassword,
  toggleVisibility,
  placeholder,
  errors,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {name === 'password' ? 'New Password' : 'Confirm New Password'}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out sm:text-sm"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={toggleVisibility}
        >
          {showPassword ? 
            <EyeOff className="h-5 w-5 text-gray-400" /> : 
            <Eye className="h-5 w-5 text-gray-400" />
          }
        </button>
      </div>
      {errors && errors.length > 0 && (
        <p className="mt-2 text-sm text-red-600">{errors.join(', ')}</p>
      )}
    </div>
  );
};