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
  activeJobs: number;
  completedJobs: number;
  averageCompletionTime: number;
  jobSuccessRate: number;
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