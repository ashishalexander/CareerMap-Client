// types/metrics.ts

export interface JobMetrics {
  jobPostingTrends: Array<{
    month: string;
    postings: number;
  }>;
  jobTypeDistribution: Array<{
    name: string;
    value: number;
  }>;
  totalJobs: number;
}
  
  export interface NetworkMetrics {
    connectionActivity: Array<{
      month: string;
      connections: number;
      requestsSent: number;
      requestsReceived: number;
    }>;
    connectionStatus: Array<{
      name: string;
      value: number;
    }>;
  }
  
  export interface UserGrowthMetrics {
    monthlyUserGrowth: Array<{
      month: string;
      totalUsers: number;
      recruiters: number;
      regularUsers: number;
    }>;
    userDistribution: Array<{
      type: string;
      count: number;
    }>;
  }


  export interface MetricTrend {
    type: 'increase' | 'decrease';
    value: string;
  }
  
  interface MetricData {
    value: string;
    trend: MetricTrend;
  }
  
  export interface DashboardMetrics {
    totalUsers: MetricData;
    activeUsers: MetricData;
    revenue: MetricData;
    growthRate: MetricData;
  }

  export interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend: MetricTrend;
    format: (val: number) => string;
  }