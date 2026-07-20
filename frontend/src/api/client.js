import axios from 'axios';
import toast from 'react-hot-toast';
import { config } from '../config';

// ============================================
// API Configuration
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// ============================================
// Create axios instance
// ============================================
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': APP_VERSION,
    'X-App-Env': APP_ENV,
    'X-Platform': 'web',
  },
  withCredentials: true,
});

// ============================================
// Request Interceptor - Add Token & Logging
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add device info
    config.headers['X-Device'] = navigator.userAgent || 'Unknown';

    // Log requests in development
    if (APP_ENV === 'development') {
      console.log(`🌐 ${config.method.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor - Handle All Responses
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (APP_ENV === 'development') {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // ============================================
    // Network Error
    // ============================================
    if (!error.response) {
      toast.error('Network error. Please check your connection.', {
        duration: 5000,
        icon: '📡',
      });
      return Promise.reject({
        message: 'Network error',
        type: 'network',
        original: error,
      });
    }

    // ============================================
    // Handle 401 Unauthorized - Token Refresh
    // ============================================
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('token', token);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        toast.error('Session expired. Please login again.', {
          duration: 5000,
          icon: '🔒',
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);

        return Promise.reject({
          message: 'Session expired',
          type: 'session_expired',
          original: refreshError,
        });
      }
    }

    // ============================================
    // Handle 403 Forbidden
    // ============================================
    if (error.response.status === 403) {
      const message = error.response.data?.message || 'You do not have permission to perform this action.';
      toast.error(message, {
        duration: 4000,
        icon: '🚫',
      });
      return Promise.reject({
        message,
        status: 403,
        type: 'forbidden',
        data: error.response.data,
      });
    }

    // ============================================
    // Handle 404 Not Found
    // ============================================
    if (error.response.status === 404) {
      toast.error('Resource not found.', {
        duration: 3000,
        icon: '🔍',
      });
      return Promise.reject({
        message: 'Resource not found',
        status: 404,
        type: 'not_found',
        data: error.response.data,
      });
    }

    // ============================================
    // Handle 422 Validation Error
    // ============================================
    if (error.response.status === 422) {
      const errors = error.response.data.errors || {};
      const errorList = [];

      if (typeof errors === 'object') {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              errorList.push(msg);
              toast.error(`${field}: ${msg}`, {
                duration: 4000,
                icon: '⚠️',
              });
            });
          } else {
            errorList.push(messages);
            toast.error(`${field}: ${messages}`, {
              duration: 4000,
              icon: '⚠️',
            });
          }
        });
      }

      return Promise.reject({
        message: 'Validation error',
        status: 422,
        type: 'validation',
        errors: errorList,
        data: error.response.data,
      });
    }

    // ============================================
    // Handle 429 Rate Limit
    // ============================================
    if (error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      toast.error(`Too many requests. Please wait ${retryAfter} seconds.`, {
        duration: 5000,
        icon: '⏳',
      });
      return Promise.reject({
        message: 'Rate limit exceeded',
        status: 429,
        type: 'rate_limit',
        retryAfter: parseInt(retryAfter),
      });
    }

    // ============================================
    // Handle 500+ Server Errors
    // ============================================
    if (error.response.status >= 500) {
      const message = error.response.data?.message || 'Server error. Please try again later.';
      toast.error(message, {
        duration: 5000,
        icon: '💥',
      });

      console.error('Server Error:', {
        status: error.response.status,
        url: error.config.url,
        data: error.response.data,
      });

      return Promise.reject({
        message,
        status: error.response.status,
        type: 'server_error',
        data: error.response.data,
      });
    }

    // ============================================
    // Default Error
    // ============================================
    const message = error.response.data?.message || 'An error occurred. Please try again.';
    toast.error(message, {
      duration: 4000,
      icon: '❌',
    });

    return Promise.reject({
      message,
      status: error.response?.status || 500,
      type: 'unknown',
      data: error.response?.data,
      original: error,
    });
  }
);

// ============================================
// API Methods with Enhanced Features
// ============================================
export const api = {
  // Standard HTTP methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  head: (url, config = {}) => apiClient.head(url, config),
  options: (url, config = {}) => apiClient.options(url, config),

  // ============================================
  // File Upload with Progress
  // ============================================
  upload: (url, formData, onProgress, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // ============================================
  // File Download
  // ============================================
  download: (url, filename, config = {}) => {
    return apiClient.get(url, {
      ...config,
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return response;
    });
  },

  // ============================================
  // Cancelable Request
  // ============================================
  cancelable: () => {
    const source = axios.CancelToken.source();
    return {
      cancel: source.cancel,
      token: source.token,
    };
  },

  // ============================================
  // Multiple Requests
  // ============================================
  all: (requests) => Promise.all(requests),

  // ============================================
  // Retry Request
  // ============================================
  retry: async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return api.retry(fn, retries - 1, delay * 2);
    }
  },

  // ============================================
  // Request with Cache
  // ============================================
  cached: (url, config = {}) => {
    const cacheKey = `${url}-${JSON.stringify(config.params || {})}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheDuration = config.cacheDuration || 5 * 60 * 1000; // 5 minutes

      if (Date.now() - timestamp < cacheDuration) {
        return Promise.resolve(data);
      }
    }

    return apiClient.get(url, config).then((data) => {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      return data;
    });
  },
};

// ============================================
// Cancel all pending requests
// ============================================
let pendingRequests = [];

apiClient.interceptors.request.use((config) => {
  if (config.cancelToken) {
    pendingRequests.push(config.cancelToken);
  }
  return config;
});

export const cancelAllRequests = () => {
  pendingRequests.forEach((cancelToken) => {
    if (cancelToken && typeof cancelToken.cancel === 'function') {
      cancelToken.cancel('Request canceled by user');
    }
  });
  pendingRequests = [];
};

// ============================================
// Health Check
// ============================================
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return { status: 'healthy', data: response };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// ============================================
// API Error Types
// ============================================
export const APIErrorTypes = {
  NETWORK: 'network',
  SESSION_EXPIRED: 'session_expired',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  RATE_LIMIT: 'rate_limit',
  SERVER_ERROR: 'server_error',
  UNKNOWN: 'unknown',
};

// ============================================
// API Status Codes
// ============================================
export const APIStatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// ============================================
// Export default
// ============================================
export default apiClient;