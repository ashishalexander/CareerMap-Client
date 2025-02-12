// services/metricsService.ts
import api from '../../../lib/axios-config';
import { JobMetrics, NetworkMetrics, UserGrowthMetrics } from '../Types/metrics';

export const jobMetricsService = {
  getJobMetrics: async (): Promise<JobMetrics> => {
    const response = await api.get<JobMetrics>('/api/admin/metrics/jobs');
    return response.data;
  }
};

export const networkMetricsService = {
  getNetworkMetrics: async (): Promise<NetworkMetrics> => {
    const response = await api.get<NetworkMetrics>('/api/admin/metrics/network');
    return response.data;
  }
};

export const userGrowthMetricsService = {
  getUserGrowthMetrics: async (): Promise<UserGrowthMetrics> => {
    const response = await api.get<UserGrowthMetrics>('/api/admin/metrics/users');
    return response.data;
  }
};