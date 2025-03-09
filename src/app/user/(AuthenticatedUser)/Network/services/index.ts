import api from "@/app/lib/axios-config";

export const networkApi = {
  getSuggestions: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/network/suggestions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/network/requests');
    return response.data;
  },

  sendConnectionRequest: async (userId: string) => {
    const response = await api.post('/network/connect', { userId });
    return response.data;
  },

  handleRequest: async (requestId: string, action: 'accept' | 'reject') => {
    const response = await api.post(`/network/requests/${requestId}/${action}`);
    return response.data;
  },
};
