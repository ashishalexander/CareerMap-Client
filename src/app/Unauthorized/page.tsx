import React from 'react';
import { Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Lock className="text-blue-600 w-16 h-16" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have the required permissions to view this page. 
          This could be due to your current access level or role.
        </p>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            Need help? Contact your organization&apos;s admin or 
            CareerMap support to request access.
          </p>
        </div>
      </div>
    </div>
  );
}