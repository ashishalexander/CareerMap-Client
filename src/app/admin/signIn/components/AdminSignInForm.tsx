import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSignInSchema, AdminSignInFormValues } from "../schema/adminSignIn";
import { Mail, Lock, ArrowRight } from "lucide-react";

interface AdminSignInFormProps {
  onSubmit: SubmitHandler<AdminSignInFormValues>;
  isLoading: boolean;
  error?: string|null;
}

export const AdminSignInForm: React.FC<AdminSignInFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-indigo-500 focus:border-indigo-500"
            } transition duration-150 ease-in-out sm:text-sm`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-indigo-500 focus:border-indigo-500"
            } transition duration-150 ease-in-out sm:text-sm`}
            placeholder="Enter your password"
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        disabled={isLoading}
      >
        {isLoading ? "Signing in" : "Sign in"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
};