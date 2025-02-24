"use client";
import { Shield } from "lucide-react";
import { AdminSignInForm } from "./components/AdminSignInForm";
import { useAdminAuth } from "./hooks/useAdminAuth";

const AdminSignIn: React.FC = () => {
  const { handleLogin, isLoading, error } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <Shield className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h2>
            <p className="text-sm text-gray-600">Access your admin dashboard</p>
          </div>
          
          <AdminSignInForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;