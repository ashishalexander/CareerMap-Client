  import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
  import { useRouter } from 'next/router';
  interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    [key: string]: any; 
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
      if (config.url ) {
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
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await apiClient.post('/api/users/refresh-token');
      const { accessToken } = response.data;
      sessionStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      sessionStorage.removeItem('accessToken');
      return null;
    }
  };


  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      console.log(error);
      if (error.response) {
        const status = error.response.status;
        const errorResponse = error.response.data;
        const message = errorResponse?.message || 'An error occurred';
  
        switch (status) {
          case 401:
            logout();
            return Promise.reject(new ApiError(status, 'Access token is missing. Please log in again.'));
          case 403: // Invalid token
            try {
              const originalRequest = error.config; // Save the original request
              if (originalRequest) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                  return apiClient(originalRequest); // Retry the original request
                } else {
                  // Token refresh failed, log out the user
                  logout();
                  return Promise.reject(new ApiError(0, 'Session expired. Please log in again.'));
                }
              } else {
                // originalRequest is undefined, cannot retry
                return Promise.reject(new ApiError(0, 'Original request is undefined.'));
              }
            } catch (refreshError:any) {
              // Token refresh failed, log out the user
              logout();
              return Promise.reject(new ApiError(0, 'Session expired. Please log in again.', refreshError));
            }
          case 404:
          case 500:
            return Promise.reject(new ApiError(status, message, errorResponse));
        }
      } else if (error.request) {
        return Promise.reject(new ApiError(0, 'No response received'));
      } else {
        return Promise.reject(new ApiError(0, error.message || 'Request failed'));
      }
    }
  );
  const logout =()=>{
    const router = useRouter();
    router.push('/user/signIn');
   }
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