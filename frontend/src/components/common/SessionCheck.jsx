import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const SessionCheck = ({ children }) => {
  const { checkSession, isSessionExpiringSoon, getSessionTimeRemaining, logout } = useAuthStore();

  useEffect(() => {
    // Check session every 5 minutes
    const interval = setInterval(async () => {
      await checkSession();
    }, 5 * 60 * 1000);

    // Check if session is expiring soon
    const checkExpiry = setInterval(() => {
      if (isSessionExpiringSoon()) {
        const time = getSessionTimeRemaining();
        if (time) {
          toast.warning(
            `Your session will expire in ${time.hours}h ${time.minutes}m. Please save your work.`,
            {
              duration: 10000,
              icon: '⏰',
            }
          );
        }
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(checkExpiry);
    };
  }, [checkSession, isSessionExpiringSoon, getSessionTimeRemaining]);

  return children;
};

export default SessionCheck;