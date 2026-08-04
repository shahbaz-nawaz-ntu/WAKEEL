// frontend/src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes, FaTrash } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isConnected } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      'case_created': '📋',
      'case_updated': '✏️',
      'case_status_changed': '🔄',
      'comment_added': '💬',
      'proceeding_added': '⚖️',
      'party_added': '👤',
      'attachment_uploaded': '📎',
      'case_assigned': '👨‍⚖️',
      'reminder': '⏰',
      'case_closed': '✅',
      'hearing_scheduled': '📅',
      'document_uploaded': '📄'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'case_created': 'bg-green-100 text-green-600',
      'case_updated': 'bg-blue-100 text-blue-600',
      'case_status_changed': 'bg-yellow-100 text-yellow-600',
      'comment_added': 'bg-purple-100 text-purple-600',
      'proceeding_added': 'bg-indigo-100 text-indigo-600',
      'party_added': 'bg-pink-100 text-pink-600',
      'attachment_uploaded': 'bg-orange-100 text-orange-600',
      'case_assigned': 'bg-teal-100 text-teal-600',
      'reminder': 'bg-red-100 text-red-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {isConnected ? '🟢 Live' : '🔴 Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification._id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-3">🔕</div>
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-gray-400 text-sm">You're all caught up!</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                View all ({notifications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;