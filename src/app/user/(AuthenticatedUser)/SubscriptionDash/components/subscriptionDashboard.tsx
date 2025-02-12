'use client'
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, CreditCard, AlertCircle } from 'lucide-react';
import api from '@/app/lib/axios-config';
import { SubscriptionData } from '../Types/Subscription';
import { RootState, useAppSelector } from '@/app/store/store';

const SubscriptionDashboard: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = React.useState<SubscriptionData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const{user} = useAppSelector((state:RootState)=>state.auth)

  React.useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await api.get<SubscriptionData>(`/api/users/subscriptionData/${user?._id}`);
        setSubscriptionData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load subscription data');
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const calculateDaysLeft = (endDate: string): number => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-gray-500">Current Plan</div>
              <div className="text-xl font-semibold">
                {subscriptionData?.planType || 'No Active Plan'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-500">Billing Cycle</div>
              <div className="text-xl font-semibold">
                {subscriptionData?.billingCycle || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-500">Status</div>
              <div className="text-xl font-semibold">
                {subscriptionData?.isActive ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {subscriptionData?.isActive && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" />
              Time Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {calculateDaysLeft(subscriptionData.endDate)} days
            </div>
            <div className="text-gray-500 mt-2">
              Until {new Date(subscriptionData.endDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Transaction ID</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-left p-3">Billing Cycle</th>
                  <th className="text-right p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionData?.paymentHistory?.map((transaction) => (
                  <tr key={transaction.transactionId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-mono">{transaction.transactionId}</td>
                    <td className="p-3">{transaction.planType}</td>
                    <td className="p-3 capitalize">{transaction.billingCycle}</td>
                    <td className="p-3 text-right">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionDashboard;