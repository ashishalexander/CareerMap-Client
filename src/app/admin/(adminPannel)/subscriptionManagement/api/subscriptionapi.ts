import api from '../../../lib/axios-config';

export interface   FilterOptions {
  search?: string;
  status?: string;
}

export interface SubscriptionAnalytics {
  activeSubscriptions: number;
  totalRevenue: number;
  planCounts: {
    professional: number;
    recruiterPro: number;
  };
  revenueByPlan?: {
    professional: number;
    recruiterPro: number;
  };
  monthlyGrowth?: number;
  churnRate?: number;
}

class SubscriptionService {
  async getSubscriptions(filters?: FilterOptions): Promise<any> {
    try {
      const response = await api.get('/api/admin/subscriptions', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error(error)
      throw new Error('Failed to fetch subscriptions');
    }
  }

  async getAnalytics(timeframe: 'All Time'|'Yearly' | 'weekly' | 'monthly' = 'monthly'): Promise<SubscriptionAnalytics> {
    try {
      const response = await api.get<SubscriptionAnalytics>('/api/admin/subscriptions/analytics', {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error(error)
      throw new Error('Failed to fetch analytics');
    }
  }
  
}

export const subscriptionService = new SubscriptionService();