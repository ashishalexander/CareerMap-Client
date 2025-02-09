"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Search,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useSubscriptions } from '../hooks/subscriptions';
import { User } from '../Types/subscription';
import { debounce } from 'lodash';
import TransactionHistoryModal from './TransactionHistory';

const PLAN_OPTIONS = {
  ALL: 'all',
  PROFESSIONAL: 'Professional',
  RECRUITER_PRO: 'recruiter-pro'
} as const;

const TIMEFRAME_OPTIONS = {
  All :'All Time',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'Yearly'
} as const;

type PlanType = typeof PLAN_OPTIONS[keyof typeof PLAN_OPTIONS];
type TimeframeType = typeof TIMEFRAME_OPTIONS[keyof typeof TIMEFRAME_OPTIONS];

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PLAN_OPTIONS.ALL);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>(TIMEFRAME_OPTIONS.All);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    subscriptions, 
    analytics,
    isLoading,
    isAnalyticsLoading,
    filterSubscriptions,
    fetchAnalytics
  } = useSubscriptions();

  // Debounced filter function
  const debouncedFilter = useCallback(
    debounce((query: string) => {
      filterSubscriptions({
        search: query,
        planType: selectedPlan === PLAN_OPTIONS.ALL ? undefined : selectedPlan,
        startDate: dateRange.start,
      });
    }, 500),
    [selectedPlan, dateRange]
  );

  useEffect(() => {
    debouncedFilter(searchQuery);
    return () => debouncedFilter.cancel();
  }, [searchQuery, debouncedFilter]);

  useEffect(() => {
    fetchAnalytics(selectedTimeframe);
  }, [selectedTimeframe]);

  const renderMetricCard = (
    icon: React.ReactNode,
    label: string,
    value: number | string,
    bgColor: string,
    textColor: string
  ) => (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${bgColor} rounded-full`}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: `w-6 h-6 ${textColor}` 
            })}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold">
              {isAnalyticsLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : value}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Timeframe Filter */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-gray-500" />
            <Select
              value={selectedTimeframe}
              onValueChange={(value: TimeframeType) => setSelectedTimeframe(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TIMEFRAME_OPTIONS.All}>All Time</SelectItem>
                <SelectItem value={TIMEFRAME_OPTIONS.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={TIMEFRAME_OPTIONS.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={TIMEFRAME_OPTIONS.YEARLY}>Yearly</SelectItem>

              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          <Users />,
          "Active Subscriptions",
          analytics?.activeSubscriptions || 0,
          "bg-blue-100",
          "text-blue-600"
        )}
        {renderMetricCard(
          <DollarSign />,
          "Total Revenue",
          `$${analytics?.totalRevenue?.toLocaleString() || 0}`,
          "bg-green-100",
          "text-green-600"
        )}
        {renderMetricCard(
          <TrendingUp />,
          "Professional Plans",
          analytics?.planCounts?.professional || 0,
          "bg-purple-100",
          "text-purple-600"
        )}
        {renderMetricCard(
          <Users />,
          "Recruiter Pro Plans",
          analytics?.planCounts?.recruiterPro || 0,
          "bg-orange-100",
          "text-orange-600"
        )}
      </div>

      {/* Filters and Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <div className="relative">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
            
            <Select
              value={selectedPlan}
              onValueChange={(value: PlanType) => setSelectedPlan(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PLAN_OPTIONS.ALL}>All Plans</SelectItem>
                <SelectItem value={PLAN_OPTIONS.PROFESSIONAL}>Professional</SelectItem>
                <SelectItem value={PLAN_OPTIONS.RECRUITER_PRO}>Recruiter Pro</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment History</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading subscriptions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : subscriptions.map((sub: User) => (
                  <TableRow key={sub._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.firstName} {sub.lastName}</p>
                        <p className="text-sm text-gray-500">{sub.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.subscription?.planType}</p>
                        <p className="text-sm text-gray-500">
                          {sub.subscription?.billingCycle} billing
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sub.subscription?.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.subscription?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        {sub.subscription?.paymentHistory?.[0] && (
                          <>
                            <p className="font-medium">
                              ${sub.subscription.paymentHistory[0].amount}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(sub.subscription.paymentHistory[0].date).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(sub);
                          setIsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedUser && (
                  <TransactionHistoryModal
                    user={selectedUser}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                  />
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;