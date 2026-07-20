import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // State
      // ============================================
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      permissions: [],
      twoFactorEnabled: false,
      twoFactorRequired: false,
      tempToken: null,
      sessionExpiry: null,
      loginAttempts: 0,
      isLocked: false,
      lockUntil: null,
      lastActivity: null,
      deviceInfo: null,

      // ============================================
      // Initialize - Check existing session
      // ============================================
      initialize: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          await get().getMe();
        }
        set({ isLoading: false });
      },

      // ============================================
      // Login with Rate Limiting
      // ============================================
      login: async (email, password, deviceInfo = null) => {
        // Check if account is locked
        const { isLocked, lockUntil, loginAttempts } = get();
        if (isLocked && lockUntil && new Date() < new Date(lockUntil)) {
          const remainingMinutes = Math.ceil(
            (new Date(lockUntil) - new Date()) / (1000 * 60)
          );
          toast.error(`Account locked. Try again in ${remainingMinutes} minutes.`);
          return {
            success: false,
            error: `Account locked. Try again in ${remainingMinutes} minutes.`,
          };
        }

        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password, deviceInfo });
          const { user, token, refreshToken, requires2FA } = response;

          // Reset login attempts on success
          set({
            loginAttempts: 0,
            isLocked: false,
            lockUntil: null,
          });

          // Handle 2FA requirement
          if (requires2FA) {
            set({
              isLoading: false,
              twoFactorRequired: true,
              tempToken: token,
              user: user,
            });
            return {
              success: true,
              requires2FA: true,
              message: 'Please enter your 2FA code',
            };
          }

          // Store tokens
          localStorage.setItem('token', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }

          // Calculate session expiry (7 days default)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            permissions: user.permissions || [],
            twoFactorEnabled: user.twoFactorEnabled || false,
            twoFactorRequired: false,
            tempToken: null,
            sessionExpiry: expiryDate.toISOString(),
            lastActivity: new Date().toISOString(),
            deviceInfo: deviceInfo || navigator.userAgent,
          });

          toast.success(`Welcome back, ${user.name}! 👋`);
          
          // Track login activity
          get().trackActivity('login');
          
          return { success: true, user };
        } catch (error) {
          // Increment login attempts
          const newAttempts = get().loginAttempts + 1;
          set({ loginAttempts: newAttempts });

          // Lock account after 5 failed attempts
          if (newAttempts >= 5) {
            const lockTime = new Date();
            lockTime.setMinutes(lockTime.getMinutes() + 15);
            set({
              isLocked: true,
              lockUntil: lockTime.toISOString(),
            });
            toast.error('Account locked due to multiple failed attempts. Try again in 15 minutes.');
            return {
              success: false,
              error: 'Account locked. Try again in 15 minutes.',
            };
          }

          const message = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: message });
          toast.error(`${message} (Attempts: ${newAttempts}/5)`);
          return { success: false, error: message };
        }
      },

      // ============================================
      // 2FA Verification
      // ============================================
      verify2FA: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const { tempToken, user } = get();
          const response = await authAPI.verify2FA({ code, tempToken });
          const { token, refreshToken } = response;

          localStorage.setItem('token', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }

          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);

          set({
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            twoFactorRequired: false,
            tempToken: null,
            sessionExpiry: expiryDate.toISOString(),
            lastActivity: new Date().toISOString(),
          });

          toast.success('2FA verified successfully! 🛡️');
          get().trackActivity('2fa_verified');
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.message || 'Invalid 2FA code';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Register
      // ============================================
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, token, refreshToken } = response;

          localStorage.setItem('token', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }

          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);

          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            permissions: user.permissions || [],
            sessionExpiry: expiryDate.toISOString(),
            lastActivity: new Date().toISOString(),
          });

          toast.success('Registration successful! Welcome aboard! 🎉');
          get().trackActivity('register');
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: message });
          
          // Handle validation errors
          if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            Object.values(errors).forEach((err) => {
              if (Array.isArray(err)) {
                err.forEach((msg) => toast.error(msg));
              } else {
                toast.error(err);
              }
            });
          } else {
            toast.error(message);
          }
          
          return { success: false, error: message };
        }
      },

      // ============================================
      // Logout
      // ============================================
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          // Ignore logout errors
        }
        
        // Clear all storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          permissions: [],
          twoFactorEnabled: false,
          twoFactorRequired: false,
          tempToken: null,
          sessionExpiry: null,
          lastActivity: null,
        });
        
        toast.success('Logged out successfully');
        get().trackActivity('logout');
        
        // Redirect to login
        window.location.href = '/login';
      },

      // ============================================
      // Get Current User
      // ============================================
      getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return null;
        }

        set({ isLoading: true });
        try {
          const user = await authAPI.getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            permissions: user.permissions || [],
            twoFactorEnabled: user.twoFactorEnabled || false,
            lastActivity: new Date().toISOString(),
          });
          return user;
        } catch (error) {
          if (error.response?.status === 401) {
            // Token expired - try refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await authAPI.refreshToken(refreshToken);
                const { token } = response;
                localStorage.setItem('token', token);
                const user = await authAPI.getMe();
                set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                  permissions: user.permissions || [],
                  lastActivity: new Date().toISOString(),
                });
                return user;
              } catch (refreshError) {
                // Refresh failed - logout
                get().logout();
                return null;
              }
            }
          }
          
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return null;
        }
      },

      // ============================================
      // Session Management
      // ============================================
      checkSession: async () => {
        const { sessionExpiry, isAuthenticated } = get();
        if (!isAuthenticated || !sessionExpiry) return false;

        const expiry = new Date(sessionExpiry);
        const now = new Date();
        const diffHours = (expiry - now) / (1000 * 60 * 60);

        // Session expires in less than 1 hour - extend
        if (diffHours < 1 && diffHours > 0) {
          try {
            const response = await authAPI.extendSession();
            const newExpiry = new Date();
            newExpiry.setDate(newExpiry.getDate() + 7);
            set({ 
              sessionExpiry: newExpiry.toISOString(),
              lastActivity: new Date().toISOString(),
            });
            toast.success('Session extended');
            return true;
          } catch (error) {
            return false;
          }
        }

        // Session expired
        if (diffHours <= 0) {
          get().logout();
          toast.error('Session expired. Please login again.');
          return false;
        }

        return true;
      },

      // ============================================
      // Update Profile
      // ============================================
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const user = await authAPI.updateProfile(data);
          set({ user, isLoading: false, lastActivity: new Date().toISOString() });
          toast.success('Profile updated successfully');
          get().trackActivity('profile_updated');
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to update profile';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Change Password
      // ============================================
      changePassword: async (data) => {
        set({ isLoading: true });
        try {
          await authAPI.changePassword(data);
          set({ isLoading: false, lastActivity: new Date().toISOString() });
          toast.success('Password changed successfully');
          get().trackActivity('password_changed');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to change password';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Upload Avatar
      // ============================================
      uploadAvatar: async (formData) => {
        set({ isLoading: true });
        try {
          const user = await authAPI.uploadAvatar(formData);
          set({ user, isLoading: false, lastActivity: new Date().toISOString() });
          toast.success('Avatar updated successfully');
          get().trackActivity('avatar_updated');
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to upload avatar';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Remove Avatar
      // ============================================
      removeAvatar: async () => {
        set({ isLoading: true });
        try {
          const user = await authAPI.removeAvatar();
          set({ user, isLoading: false, lastActivity: new Date().toISOString() });
          toast.success('Avatar removed successfully');
          get().trackActivity('avatar_removed');
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to remove avatar';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Forgot Password
      // ============================================
      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          await authAPI.forgotPassword(email);
          set({ isLoading: false });
          toast.success('Password reset email sent. Please check your inbox.');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to send reset email';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Reset Password
      // ============================================
      resetPassword: async (data) => {
        set({ isLoading: true });
        try {
          await authAPI.resetPassword(data);
          set({ isLoading: false });
          toast.success('Password reset successfully. Please login.');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to reset password';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Enable 2FA
      // ============================================
      enable2FA: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.enable2FA();
          set({ 
            isLoading: false,
            twoFactorEnabled: true,
            twoFactorSecret: response.secret,
            backupCodes: response.backupCodes,
            lastActivity: new Date().toISOString(),
          });
          toast.success('2FA enabled successfully');
          get().trackActivity('2fa_enabled');
          return { success: true, data: response };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to enable 2FA';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Disable 2FA
      // ============================================
      disable2FA: async (code) => {
        set({ isLoading: true });
        try {
          await authAPI.disable2FA(code);
          set({ 
            isLoading: false,
            twoFactorEnabled: false,
            twoFactorSecret: null,
            backupCodes: null,
            lastActivity: new Date().toISOString(),
          });
          toast.success('2FA disabled successfully');
          get().trackActivity('2fa_disabled');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to disable 2FA';
          set({ isLoading: false, error: message });
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // ============================================
      // Activity Tracking
      // ============================================
      trackActivity: (action) => {
        const { user } = get();
        if (user) {
          // Log activity for analytics
          console.log(`📊 User Activity: ${action} - ${user.email}`);
          
          // Send to analytics if enabled
          if (window.gtag) {
            window.gtag('event', action, {
              'user_id': user.id,
              'user_email': user.email,
            });
          }
        }
      },

      // ============================================
      // Clear Error
      // ============================================
      clearError: () => set({ error: null }),

      // ============================================
      // Permission Check
      // ============================================
      hasPermission: (permission) => {
        const { permissions, user } = get();
        if (user?.role === 'admin') return true;
        return permissions.includes(permission);
      },

      // ============================================
      // Role Check
      // ============================================
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // ============================================
      // Get User Display Name
      // ============================================
      getDisplayName: () => {
        const { user } = get();
        if (!user) return 'Guest';
        return user.name || user.email || 'User';
      },

      // ============================================
      // Get User Initials
      // ============================================
      getUserInitials: () => {
        const { user } = get();
        if (!user) return 'G';
        if (user.name) {
          const parts = user.name.split(' ');
          if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
          }
          return user.name.substring(0, 2).toUpperCase();
        }
        return user.email?.substring(0, 2).toUpperCase() || 'U';
      },

      // ============================================
      // Is Session Expiring Soon
      // ============================================
      isSessionExpiringSoon: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return false;
        const expiry = new Date(sessionExpiry);
        const now = new Date();
        const diffHours = (expiry - now) / (1000 * 60 * 60);
        return diffHours < 24 && diffHours > 0;
      },

      // ============================================
      // Get Session Time Remaining
      // ============================================
      getSessionTimeRemaining: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry) return null;
        const expiry = new Date(sessionExpiry);
        const now = new Date();
        const diffMs = expiry - now;
        if (diffMs <= 0) return null;
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days: diffDays, hours: diffHours, minutes: diffMinutes };
      },

      // ============================================
      // Reset State (for testing)
      // ============================================
      reset: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          permissions: [],
          twoFactorEnabled: false,
          twoFactorRequired: false,
          tempToken: null,
          sessionExpiry: null,
          loginAttempts: 0,
          isLocked: false,
          lockUntil: null,
          lastActivity: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        twoFactorEnabled: state.twoFactorEnabled,
        sessionExpiry: state.sessionExpiry,
      }),
    }
  )
);