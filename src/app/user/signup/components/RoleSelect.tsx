import React from 'react';
import { Briefcase } from 'lucide-react';
import { FormData } from '../Types/auth';

interface RoleSelectProps {
  value: FormData['role'];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, error }) => (
  <div>
    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
      I am a
    </label>
    <div className="relative">
      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <select
        id="role"
        name="role"
        value={value}
        onChange={onChange}
        className={`pl-10 w-full py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="user">User</option>
        <option value="recruiter">Recruiter</option>
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);