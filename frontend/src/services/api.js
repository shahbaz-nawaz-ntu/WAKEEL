// src/services/api.js
import axios from 'axios';

// ✅ FIX: Use relative URL for development with proxy
// The proxy will forward /api to http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // ✅ Add this for cookies if needed
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const tokenKey = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
    const refreshTokenKey = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
    
    // Handle token refresh (if implemented)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem(tokenKey, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(refreshTokenKey);
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        // No refresh token - logout
        localStorage.removeItem(tokenKey);
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('📡 Network error - check if backend is running');
      // Don't redirect on network errors, just log
    }
    
    // Debug logging for errors
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;