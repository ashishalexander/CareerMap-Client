import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig to include `_retry` property
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean; 
}

// Define the structure of your API error response
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  [key: string]: any; // for any additional fields
}

// Create a custom error type
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create and configure the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
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

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.log(error)
    return null;
  }
}

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;
      const errorResponse = error.response.data;
      const message = errorResponse?.message || 'An error occurred';

      // Handle specific status codes
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          break;
        case 403:
          try {
            const originalRequest = error.config as AxiosRequestConfigWithRetry;
            
            if (originalRequest) {
              // Prevent retrying the same request more than once
              if (originalRequest._retry) {
                return Promise.reject(error); 
              }
              
              originalRequest._retry = true; // Mark the request as retrying
              
              // Attempt to refresh the token
              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                // Set the new token in the request headers
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                // Retry the original request with the new token
                return apiClient(originalRequest);
              } else {
                logout();
                return Promise.reject(new ApiError(0, 'Session expired. Please log in again.'));
              }
            } else {
              // originalRequest is undefined, cannot retry
              return Promise.reject(new ApiError(0, 'Original request is undefined.'));
            }
          } catch (refreshError: any) {
            // Token refresh failed, log out the user
            logout();
            return Promise.reject(new ApiError(0, 'Session expired. Please log in again.', refreshError));
          }
        case 404:
          break;
        case 500:
          break;
      }

      return Promise.reject(new ApiError(status, message, errorResponse));
    } else if (error.request) {
      return Promise.reject(new ApiError(0, 'No response received'));
    } else {
      return Promise.reject(new ApiError(0, error.message || 'Request failed'));
    }
  }
);

// Define response types for API methods
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API methods with proper typing
export const api = {
  get: <T>(url: string, config = {}) => 
    apiClient.get<ApiResponse<T>>(url, config).then(response => response.data),
  
  post: <T>(url: string, data = {}, config = {}) =>
    apiClient.post<ApiResponse<T>>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data = {}, config = {}) =>
    apiClient.put<ApiResponse<T>>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config = {}) =>
    apiClient.delete<ApiResponse<T>>(url, config).then(response => response.data),
  
  patch: <T>(url: string, data = {}, config = {}) =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then(response => response.data),
  
};

export default api;

function logout() {
  sessionStorage.removeItem('adminAccessToken');
  window.location.href = 'admin/signIn'; 
}
