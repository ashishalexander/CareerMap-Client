"use client";
import React, { useState } from 'react';
import { SignInForm } from './components/SignInForm';
import { WelcomeSection } from './components/WelcomeSession';
import { useAuth } from './hooks/useAuth';
import { useGoogleAuth } from './hooks/useGoogleAuth';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading: emailLoading, error: emailError, handleEmailSignIn } = useAuth();
  const { loading: googleLoading, error: googleError, handleGoogleSignIn } = useGoogleAuth();

  // Combined loading and error states
  const loading = emailLoading || googleLoading;
  const error = emailError || googleError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEmailSignIn({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <SignInForm
            email={email}
            password={password}
            loading={loading}
            error={error}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
          />
          <WelcomeSection />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;