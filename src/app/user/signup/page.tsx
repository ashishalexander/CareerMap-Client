"use client";
import React, { useState } from "react";
import { User, Mail, Phone, Lock, Briefcase } from "lucide-react";
import axios from "axios";
import api, { ApiError } from "@/app/lib/axios-config";
import { useRouter } from "next/navigation";
import { useFormValidation } from "@/app/utils/signupFormVald";

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: "user" | "recruiter";
  password: string;
  confirmPassword: string;
}

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

  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    setIsSubmitting,
  } = useFormValidation(initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm()) {
        const { confirmPassword, ...dataToSubmit } = formData;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
          dataToSubmit
        );
        console.log("Form submitted successfully:", response);
        if (response.status == 200) {
          const token = response.data.token; 
          console.log(token)
          sessionStorage.setItem("signupToken",token);
          router.push("/user/otp");
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Signup error:", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    type: string,
    placeholder: string,
    Icon: React.FC<any>
  ) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`pl-10 w-full py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
                  {renderInput("firstName", "First Name", "text", "John", User)}
                  {renderInput("lastName", "Last Name", "text", "Doe", User)}
                </div>

                {renderInput(
                  "email",
                  "Email Address",
                  "email",
                  "john.doe@example.com",
                  Mail
                )}
                {renderInput(
                  "mobile",
                  "Mobile Number",
                  "tel",
                  "+1 (555) 000-0000",
                  Phone
                )}

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    I am a
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`pl-10 w-full py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                  </div>
                </div>

                {renderInput(
                  "password",
                  "Password",
                  "password",
                  "••••••••",
                  Lock
                )}
                {renderInput(
                  "confirmPassword",
                  "Confirm Password",
                  "password",
                  "••••••••",
                  Lock
                )}

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

          {/* Content Section */}
          <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-400 to-indigo-700 p-12 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Welcome to CareerMap
                </h2>
                <p className="text-lg mb-8">
                  Your journey to professional success starts here. Join
                  thousands of professionals who've found their dream careers
                  through CareerMap.
                </p>
                <ul className="space-y-4">
                  {[
                    "Personalized job recommendations",
                    "Network with industry leaders",
                    "Access exclusive career resources",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-6 w-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <p className="text-sm opacity-80">
                  "CareerMap transformed my job search. I found my dream role
                  within weeks!" - Sarah Johnson, Software Engineer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
