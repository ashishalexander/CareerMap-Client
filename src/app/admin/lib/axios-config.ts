// axios-config.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store/store';
import { signOut } from '../../store/slices/authSlice';

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('adminAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const logout = async () => {
  sessionStorage.removeItem('adminAccessToken');
  store.dispatch(signOut());
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/signIn';
  }
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Check if there's a new access token in the response headers
    const newAccessToken = response.headers['new-access-token'];
    if (newAccessToken) {
      sessionStorage.setItem('adminAccessToken', newAccessToken);
    }
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const errorResponse = error.response.data as ApiErrorResponse;
      const message = errorResponse?.message || 'An error occurred';

      switch (status) {
        case 401:
          await logout();
          return Promise.reject(new ApiError(status, 'Session expired. Please login again.'));
        case 498:
          window.location.href = '/Unauthorized';
          return Promise.reject(new ApiError(status, 'Unauthorized access', errorResponse));
        case 450:
          await logout();
          return Promise.reject(new ApiError(status, 'Your account is blocked.', errorResponse));
        default:
          return Promise.reject(new ApiError(status, message, errorResponse));
      }
    }

    return Promise.reject(new ApiError(0, error.message || 'Request failed'));
  }
);

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const api = {
  get: <T>(url: string, config = {}) =>
    apiClient.get<ApiResponse<T>>(url, config).then((response) => response.data),
  post: <T>(url: string, data = {}, config = {}) =>
    apiClient.post<ApiResponse<T>>(url, data, config).then((response) => response.data),
  put: <T>(url: string, data = {}, config = {}) =>
    apiClient.put<ApiResponse<T>>(url, data, config).then((response) => response.data),
  patch: <T>(url: string, data = {}, config = {}) =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then((response) => response.data),
  delete: <T>(url: string, config = {}) =>
    apiClient.delete<ApiResponse<T>>(url, config).then((response) => response.data),
};

export default api;
