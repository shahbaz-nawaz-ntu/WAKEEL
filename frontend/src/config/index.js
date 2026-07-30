// ============================================
// Application Configuration
// ============================================

const environment = import.meta.env.VITE_APP_ENV || 'development';

export const config = {
  // ============================================
  // App Configuration
  // ============================================
  app: {
    name: import.meta.env.VITE_APP_NAME || 'JurisFlow',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: environment,
    isProduction: environment === 'production',
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
  },

  // ============================================
  // API Configuration
  // ============================================
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'https://e4dc-2400-adc7-2918-d000-2c7c-f0e5-1ef4-f4d4.ngrok-free.app/api',
    wsURL: import.meta.env.VITE_WS_URL || 'wss://e4dc-2400-adc7-2918-d000-2c7c-f0e5-1ef4-f4d4.ngrok-free.app/ws',
    timeout: 30000,
    retryCount: 3,
    retryDelay: 1000,
    cacheDuration: 5 * 60 * 1000, // 5 minutes
  },

  // ============================================
  // Authentication
  // ============================================
  auth: {
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
    sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // ============================================
  // Features
  // ============================================
  features: {
    chat: import.meta.env.VITE_ENABLE_CHAT === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // ============================================
  // Analytics
  // ============================================
  analytics: {
    enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    gaId: import.meta.env.VITE_GA_ID,
  },

  // ============================================
  // Pagination
  // ============================================
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  // ============================================
  // Upload
  // ============================================
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  },
};

// ============================================
// Log configuration in development
// ============================================
if (config.app.isDevelopment) {
  console.log('🚀 App Configuration:', config);
}

export default config;