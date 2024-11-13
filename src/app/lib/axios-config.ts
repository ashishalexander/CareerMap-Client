import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

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
  withCredentials:true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url && !config.url.includes('/api/users/signIn')) {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    // This endpoint will use the HttpOnly cookie to refresh the access token
    const response = await apiClient.post('/api/users/refresh-token');
    const { accessToken } = response.data; // Get new access token
    sessionStorage.setItem('accesstoken', accessToken); // Store the new access token
  } catch (error) {
    // Handle refresh token failure
    sessionStorage.removeItem('accesstoken'); // Clear access token on failure
    return Promise.reject(new ApiError(0, 'Session expired. Please log in again.'));
  }
};


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
          try {
            await refreshAccessToken(); // Attempt to refresh the token
            const originalRequest = error.config; // Save the original request
  
            if (originalRequest) { // Check if originalRequest is defined
              const token = sessionStorage.getItem('accesstoken'); // Get new access token
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`; // Attach new access token
              }
              return apiClient(originalRequest); // Retry the original request
            } else {
              // Handle the case where originalRequest is undefined
              return Promise.reject(new ApiError(0, 'Original request is undefined.'));
            }
          } catch (refreshError) {
            // Handle refresh token failure
            sessionStorage.removeItem('accesstoken'); // Clear access token on failure
            return Promise.reject(new ApiError(0, 'Session expired. Please log in again.'));
          }
        case 403:
          break;
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
  data: any;
  message?: string;
  success?:boolean
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
};

export default api;