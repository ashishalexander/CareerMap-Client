"use client";
import React, { useState,useEffect} from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { getSession, signIn,signOut,useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import { emailSignIn,googleSignIn } from "@/app/store/slices/authSlice";
import { useAppDispatch,useAppSelector } from "@/app/store/store";


const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch()
  const router = useRouter()
  const {loading,error,user} = useSelector((state:any)=>state.auth)

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    dispatch(emailSignIn({email,password}))
    
  };

  const handleGoogleSignIn = async () => {
    dispatch(googleSignIn())
  };

  useEffect(()=>{
    console.log(user)
    if(user){
      router.push('/user/AuthenticatedUser/Home')
    }
  },[user,router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Sign In Form */}
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please sign in to your account
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1 relative">
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
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
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
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
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
                    <a
                      
                      href="/user/forgetPassword"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                  </div>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/user/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up now
                </a>
              </p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 p-12">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Welcome to CareerMap
                </h2>
                <p className="text-white text-lg mb-8">
                  Sign in to access your personalized career dashboard and
                  continue your professional journey.
                </p>
                <ul className="space-y-4 text-white">
                  {[
                    "Access your saved job searches",
                    "Track your application status",
                    "Connect with recruiters",
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
                <p className="italic text-white opacity-80">
                  "CareerMap has revolutionized how I approach my job search.
                  The personalized recommendations are spot-on!" - Michael Chen,
                  Product Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
