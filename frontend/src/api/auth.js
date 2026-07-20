import { api } from './client.js';

// ============================================
// Authentication API - Complete Enterprise Version
// ============================================

export const authAPI = {
  // ============================================
  // Core Authentication
  // ============================================
  
  /** Register new user */
  register: (data) => api.post('/auth/register', data),
  
  /** Login user */
  login: (data) => api.post('/auth/login', data),
  
  /** Logout user */
  logout: () => api.post('/auth/logout'),
  
  /** Refresh access token */
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  /** Verify email with token */
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  
  /** Resend verification email */
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),

  // ============================================
  // User Profile Management
  // ============================================
  
  /** Get current user profile */
  getMe: () => api.get('/auth/me'),
  
  /** Update user profile */
  updateProfile: (data) => api.put('/auth/profile', data),
  
  /** Change password */
  changePassword: (data) => api.put('/auth/change-password', data),
  
  /** Upload avatar */
  uploadAvatar: (formData) => api.upload('/auth/avatar', formData),
  
  /** Remove avatar */
  removeAvatar: () => api.delete('/auth/avatar'),

  // ============================================
  // Password Management
  // ============================================
  
  /** Request password reset */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  /** Verify reset token */
  verifyResetToken: (token) => api.get(`/auth/verify-reset-token/${token}`),
  
  /** Reset password with token */
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // ============================================
  // Two-Factor Authentication (2FA)
  // ============================================
  
  /** Enable 2FA - returns secret and backup codes */
  enable2FA: () => api.post('/auth/2fa/enable'),
  
  /** Verify 2FA code */
  verify2FA: (code, tempToken) => api.post('/auth/2fa/verify', { code, tempToken }),
  
  /** Disable 2FA */
  disable2FA: (code) => api.post('/auth/2fa/disable', { code }),
  
  /** Get 2FA status */
  get2FAStatus: () => api.get('/auth/2fa/status'),

  /** Generate new backup codes */
  generateBackupCodes: () => api.post('/auth/2fa/backup-codes'),

  // ============================================
  // Social Login
  // ============================================
  
  /** Social login with provider */
  socialLogin: (provider, token) => api.post(`/auth/social/${provider}`, { token }),
  
  /** Get social login URL */
  getSocialLoginUrl: (provider) => api.get(`/auth/social/${provider}/url`),

  // ============================================
  // Session Management
  // ============================================
  
  /** Check session status */
  checkSession: () => api.get('/auth/session'),
  
  /** Extend session */
  extendSession: () => api.post('/auth/session/extend'),
  
  /** Terminate all sessions */
  terminateAllSessions: () => api.post('/auth/session/terminate-all'),

  // ============================================
  // Account Management
  // ============================================
  
  /** Deactivate account */
  deactivateAccount: (password) => api.post('/auth/account/deactivate', { password }),
  
  /** Delete account */
  deleteAccount: (password) => api.post('/auth/account/delete', { password }),
  
  /** Reactivate account */
  reactivateAccount: (data) => api.post('/auth/account/reactivate', data),

  // ============================================
  // Audit & Security
  // ============================================
  
  /** Get login history */
  getLoginHistory: (params = {}) => api.get('/auth/login-history', { params }),
  
  /** Get security events */
  getSecurityEvents: (params = {}) => api.get('/auth/security-events', { params }),
  
  /** Report suspicious activity */
  reportActivity: (data) => api.post('/auth/report-activity', data),

  // ============================================
  // Device Management
  // ============================================
  
  /** Get all devices */
  getDevices: () => api.get('/auth/devices'),
  
  /** Revoke device */
  revokeDevice: (deviceId) => api.delete(`/auth/devices/${deviceId}`),

  // ============================================
  // User Preferences
  // ============================================
  
  /** Get user preferences */
  getPreferences: () => api.get('/auth/preferences'),
  
  /** Update user preferences */
  updatePreferences: (data) => api.put('/auth/preferences', data),
};