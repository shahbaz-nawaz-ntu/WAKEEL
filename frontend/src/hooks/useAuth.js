// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      // ✅ Check localStorage directly
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Try API first
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          console.log('👤 User loaded from API:', response.data.data);
        } catch (err) {
          console.log('⚠️ API failed, using stored user');
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            console.log('👤 User loaded from localStorage:', parsedUser);
          } catch (parseErr) {
            console.error('Failed to parse stored user:', parseErr);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } else if (storedToken) {
        // Token exists but no user
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          console.log('👤 User loaded from API:', response.data.data);
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ============================================
  // REGISTER
  // ============================================
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      const { token, data } = response.data;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(token);
      setUser(data);
      
      toast.success('Account created successfully! 🎉');
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      toast.error(errorMsg || 'Registration failed');
      return { success: false, error: errorMsg };
    }
  };

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('user', JSON.stringify(data));
      setToken(token);
      setUser(data);
      
      toast.success(`Welcome back, ${data.name}! 👋`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      toast.error(errorMsg || 'Login failed');
      return { success: false, error: errorMsg };
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    return { success: true };
  };

  // ============================================
  // UPDATE PROFILE
  // ============================================
  const updateProfile = async (data) => {
    try {
      setError(null);
      const response = await api.put('/auth/profile', data);
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      toast.success('Profile updated successfully! ✅');
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      toast.error(errorMsg || 'Failed to update profile');
      return { success: false, error: errorMsg };
    }
  };

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await api.put('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully! 🔒');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      toast.error(errorMsg || 'Failed to change password');
      return { success: false, error: errorMsg };
    }
  };

  // ============================================
  // ✅ ADD THIS FUNCTION
  // ============================================
  const setUserDirectly = (userData, tokenData) => {
    console.log('🔧 setUserDirectly called with:', { userData, tokenData });
    if (tokenData) {
      localStorage.setItem(TOKEN_KEY, tokenData);
      setToken(tokenData);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    setLoading(false);
  };

  return {
    user,
    loading,
    setLoading,
    error,
    token,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    setUserDirectly, // ✅ Expose this
    isAuthenticated: !!user,
  };
};