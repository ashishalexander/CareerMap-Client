// src/app/otp/page.tsx
"use client";
import React from "react";
import { OtpHeader } from "./components/OtpHeader";
import { OtpInput } from "./components/OtpInput";
import { useOtp } from "./hooks/useOtp";

const OtpPage: React.FC = () => {
  const {
    otp,
    timer,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleResend
  } = useOtp();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-2xl">
        <div className="max-w-md mx-auto space-y-8">
          <OtpHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <OtpInput
              otp={otp}
              timer={timer}
              inputRefs={inputRefs}
              handleChange={handleChange}
              handleKeyDown={handleKeyDown}
              handleResend={handleResend}
            />

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white text-lg font-semibold rounded-xl hover:bg-emerald-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Verify and Continue
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Having trouble?{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;