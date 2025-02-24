'use client'
import React from 'react';
import MetricsDashboard from './components/MetricCard';
import UserGrowthMetrics from './components/userGrowthMetric';
import NetworkActivityMetrics from './components/networkMetrics';
import JobMarketMetrics from './components/jobMetrics';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-2">
        
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mt-8">
            <MetricsDashboard />
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="col-span-1">
              <UserGrowthMetrics />
            </div>
            
            <div className="col-span-1">
              <NetworkActivityMetrics />
            </div>
            
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