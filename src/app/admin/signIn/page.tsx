"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { RootState,useAppDispatch,useAppSelector } from "../../store/store"; // Update to your store's root reducer path
import { adminLogin } from "../../store/slices/adminSlice"; // Update path as necessary

// Zod schema for validation
const adminSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;

const AdminSignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignInFormValues>({
    resolver: zodResolver(adminSignInSchema),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const useSelector = useAppSelector
  // Select necessary state from Redux store
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.admin
  );
  // useEffect(() => {
  //   if (isAuthenticated ) {
  //     router.push("/admin/adminPannel/dashboard"); // Redirect to dashboard if already logged in
  //   }
  // }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<AdminSignInFormValues> = async (data) => {
    try {
      // Dispatch admin login action
      await dispatch(adminLogin(data)).unwrap();
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <Shield className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h2>
            <p className="text-sm text-gray-600">Access your admin dashboard</p>
          </div>

          {/* Display error message if login fails */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Signing in..." : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
