"use client";
import React from "react";
import { useFormValidation } from "@/app/user/signup/components/signupFormValid";
import { SignupInput } from "./components/Input";
import { RoleSelect } from "./components/RoleSelect";
import { WelcomeSection } from "./components/WelcomeSession";
import { useSignupSubmit } from "./Hooks/useSignupSubmit";
import { useFormFields } from "./Hooks/useFormField";
import { FormData } from "./Types/auth";

const SignupPage: React.FC = () => {
  const initialState: FormData = {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  };

  const { formData, errors, handleChange, validateForm } = useFormValidation(initialState);
  const { handleSubmit, isSubmitting } = useSignupSubmit();
  const { fields } = useFormFields();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(formData, validateForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Join CareerMap
                </h2>
                <p className="text-gray-600">
                  Start your professional journey today
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
                  {fields.slice(0, 2).map((field) => (
                    <SignupInput
                      key={field.name}
                      {...field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                    />
                  ))}
                </div>

                {fields.slice(2).map((field) => (
                  <SignupInput
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                  />
                ))}

                <RoleSelect
                  value={formData.role}
                  onChange={handleChange}
                  error={errors.role}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/user/signIn"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>

          <WelcomeSection />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;