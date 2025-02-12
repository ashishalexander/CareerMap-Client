import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
