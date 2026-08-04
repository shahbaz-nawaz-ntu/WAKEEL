// frontend/src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

// Hook as named export
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider as default export
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const isInitializedRef = useRef(false);
  const reconnectAttempts = useRef(0);

  const getUserId = useCallback((user) => {
    if (!user) return null;
    return user._id || user.id || user.userId || null;
  }, []);

  const getUser = useCallback(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing user:', error);
    }
    return null;
  }, []);

  const fetchNotifications = useCallback(async () => {
    const user = getUser();
    const userId = getUserId(user);
    if (!userId) {
      console.log('⚠️ No user ID, skipping fetch');
      return;
    }

    try {
      console.log('📥 Fetching notifications for user:', userId);
      const response = await fetch(`http://localhost:5000/api/notifications/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Notifications fetched:', data.data?.length || 0, 'items');
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        console.error('❌ Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    }
  }, [getUser, getUserId]);

  const initSocket = useCallback(() => {
    const user = getUser();
    const userId = getUserId(user);
    
    if (!userId) {
      console.log('⚠️ No user found, skipping socket connection');
      return;
    }

    // If socket already exists and connected
    if (socketRef.current && socketRef.current.connected) {
      console.log('✅ Socket already connected, re-joining room:', userId);
      socketRef.current.emit('join-user', userId);
      return;
    }

    console.log('🔌 Initializing Socket.IO connection for user:', userId);
    console.log('📡 Connecting to http://localhost:5000');

    // Close existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io('http://localhost:5000', {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 30000,
      forceNew: true,
    });

    socketRef.current = socket;
    window.socket = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected! ID:', socket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
      
      const currentUserId = getUserId(getUser());
      if (currentUserId) {
        console.log('👤 Emitting join-user for:', currentUserId);
        socket.emit('join-user', currentUserId);
        console.log('👤 Joined user room:', currentUserId);
      }
      
      fetchNotifications();
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected. Reason:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
      reconnectAttempts.current += 1;
      
      if (reconnectAttempts.current > 5) {
        console.log('🔄 Too many reconnect attempts, trying polling only...');
        if (socketRef.current) {
          socketRef.current.io.opts.transports = ['polling'];
          socketRef.current.connect();
        }
      }
    });

    socket.on('reconnect', (attempt) => {
      console.log('🔄 Socket reconnected after', attempt, 'attempts');
      setIsConnected(true);
      const currentUserId = getUserId(getUser());
      if (currentUserId) {
        socket.emit('join-user', currentUserId);
      }
    });

    socket.on('new-notification', (notification) => {
      console.log('📨 New notification received:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">🔔</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title || 'New Notification'}
                </p>
                <p className="text-sm text-gray-500">
                  {notification.message || 'You have a new notification'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000, position: 'top-right' });
    });

    socket.on('notification-count', (count) => {
      console.log('🔔 Notification count updated:', count);
      setUnreadCount(count);
    });
  }, [getUser, getUserId, fetchNotifications]);

  // Initialize on mount and when user changes
  useEffect(() => {
    const user = getUser();
    const userId = getUserId(user);
    
    if (userId) {
      console.log('👤 User found:', userId);
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        setTimeout(() => initSocket(), 500);
      }
    } else {
      console.log('👤 No user found, waiting for login...');
    }

    // Listen for user updates
    const handleUserUpdate = (event) => {
      console.log('🔄 User update event received');
      const newUser = event.detail || getUser();
      const newUserId = getUserId(newUser);
      
      if (newUserId) {
        console.log('👤 User ID found in update:', newUserId);
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        isInitializedRef.current = false;
        setTimeout(() => initSocket(), 300);
      }
    };

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('🔄 localStorage user changed');
        const newUser = getUser();
        const newUserId = getUserId(newUser);
        
        if (newUserId) {
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          isInitializedRef.current = false;
          setTimeout(() => initSocket(), 300);
        } else {
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          setIsConnected(false);
        }
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      window.socket = null;
    };
  }, [getUser, getUserId, initSocket]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId) => {
    const user = getUser();
    const userId = getUserId(user);
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  }, [getUser, getUserId]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const user = getUser();
    const userId = getUserId(user);
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
    }
  }, [getUser, getUserId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    const user = getUser();
    const userId = getUserId(user);
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
    }
  }, [getUser, getUserId]);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    socket: socketRef.current,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;