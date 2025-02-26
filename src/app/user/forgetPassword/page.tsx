// src/app/forgot-password/page.tsx
"use client";
import { Header } from "./components/Header";
import { EmailInput } from "./components/Email";
import { StatusMessage } from "./components/StatusMessage";
import { SubmitButton } from "./components/SubmitButton";
import { useForgotPassword } from "./hooks/useForgetPassword";

const ForgotPassword: React.FC = () => {
  const {
    email,
    successMessage,
    errorMessage,
    isSubmitting,
    emailError,
    handleChange,
    handleSubmit
  } = useForgotPassword();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <Header />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <EmailInput 
            email={email}
            emailError={emailError}
            onChange={handleChange}
          />

          <StatusMessage 
            successMessage={successMessage}
            errorMessage={errorMessage}
          />

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;