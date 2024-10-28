"use client"
import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import axios from 'axios'
import { useRouter } from 'next/navigation';


const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        // Send POST request to sign in the admin (NO token is needed here)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/signIn`,
          { email, password },
          { headers: { 'Content-Type': 'application/json' } }
        );
        // Assuming the response contains a token if sign-in is successful
        const  token  = response.data.accessToken;
  
        if (token) {
          // Store the admin token after sign-in
          sessionStorage.setItem('adminAccessToken', token);
          router.push('/admin/adminPannel/dashboard')
        } else {
          throw new Error('Sign-in failed: No token received');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Sign-in error: ${error.message}`);
          console.error('Error:', error.message);
        } else {
          setError('An unexpected error occurred.');
          console.error('Unexpected error:', error);
        }
        setTimeout(() => {
          setError('');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row" style={{ minHeight: '650px' }}>
          {/* Left side - Sign In Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-10">
                <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                  Admin Sign In
                </h2>
                <p className="text-sm text-gray-600">
                  Please sign in to access admin features
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className='text-sm'>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                  </div>
                  <div className="text-sm">
                    <a href="/admin/forgotPassword" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Right side - Content and background */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white items-center justify-center p-12">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-6">Welcome Back, Admin</h2>
              <p className="text-xl mb-8 opacity-90">Access your dashboard to manage and oversee all aspects of your application.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  View real-time analytics
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  Manage user accounts
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Update system settings
                </li>
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Generate reports
                </li>
              </ul>
              <p className="text-sm opacity-80">Secure access for authorized personnel only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;