// hooks/useSubscriptions.ts
import { useState } from 'react';
import { subscriptionService, SubscriptionAnalytics } from '../api/subscriptionapi';
import { TimeframeType, User } from '../Types/subscription';


export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);


  const fetchSubscriptions = async (filters?: any) => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getSubscriptions(filters);
      setSubscriptions(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async (timeframe: TimeframeType = 'monthly') => {
    try {
      setIsAnalyticsLoading(true);
      const data = await subscriptionService.getAnalytics(timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  const filterSubscriptions = (filters: any) => {
    fetchSubscriptions(filters);
  };

  
  return {
    subscriptions,
    isLoading,
    analytics,
    isAnalyticsLoading,
    fetchAnalytics,
    filterSubscriptions,
  };
}