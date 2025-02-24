import React from 'react';
import { FormData } from '../Types/auth';
import { LucideIcon } from 'lucide-react';

interface SignupInputProps {
  name: keyof FormData;
  label: string;
  type: string;
  placeholder: string;
  Icon: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const SignupInput: React.FC<SignupInputProps> = ({
  name,
  label,
  type,
  placeholder,
  Icon,
  value,
  onChange,
  error
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`pl-10 w-full py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);