'use client'
import React from 'react';
import MetricsDashboard from './components/MetricCard';
import UserGrowthMetrics from './components/userGrowthMetric';
import NetworkActivityMetrics from './components/networkMetrics';
import JobMarketMetrics from './components/jobMetrics';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Key Metrics Cards */}
          <div className="mt-8">
            <MetricsDashboard />
          </div>
          
          {/* Main Dashboard Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Section */}
            <div className="col-span-1">
              <UserGrowthMetrics />
            </div>
            
            {/* Network Activity Section */}
            <div className="col-span-1">
              <NetworkActivityMetrics />
            </div>
            
            {/* Job Market Section */}
            <div className="col-span-2">
              <JobMarketMetrics />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;