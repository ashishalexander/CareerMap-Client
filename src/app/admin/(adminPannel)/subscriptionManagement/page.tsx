"use client"
import React from 'react';
import AdminSubscriptionDashboard from './components/dashboard';

const AdminSubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Subscription Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage user subscriptions, revenue, and subscription analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AdminSubscriptionDashboard />
      </main>
    </div>
  );
};

export default AdminSubscriptionPage; 