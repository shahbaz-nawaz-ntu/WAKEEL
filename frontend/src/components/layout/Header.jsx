// src/components/layout/Header.jsx - Updated with Real-time Notifications
import React, { useState, useRef, useEffect } from 'react';
import { 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt, 
  FaSearch, 
  FaBell, 
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaFileAlt,
  FaPlusCircle,
  FaGavel,
  FaBars,
  FaCheckDouble,
  FaBook,
  FaChevronDown,
  FaExternalLinkAlt,
  FaList,
  FaFolderOpen,
  FaTimes
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import LogoutModal from '../common/LogoutModal';
import { useNotifications } from '../../contexts/NotificationContext';

const Header = ({ 
  onAddClick, 
  stats, 
  cases, 
  onNavigate, 
  activePage, 
  onMenuClick,
  user: propUser = null,
  onLogout = () => {},
  solvedCases = [],
  referenceCases = []
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCasesDropdownOpen, setIsCasesDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHoveringCases, setIsHoveringCases] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  
  // ✅ Get real-time notifications from context
  const { 
    notifications: realNotifications, 
    unreadCount, 
    isConnected, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const casesDropdownRef = useRef(null);
  let hoverTimeout = null;

  // ============================================
  // ✅ Get notification icon based on type
  // ============================================
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

  // ============================================
  // ✅ FIXED: Format time for display
  // ============================================
  const formatTime = (date) => {
    if (!date) return 'Just now';
    
    try {
      const now = new Date();
      const past = new Date(date);
      
      // Check if date is valid
      if (isNaN(past.getTime())) {
        return 'Just now';
      }
      
      const diff = Math.floor((now - past) / 1000);
      
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
      if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
      return `${Math.floor(diff / 31536000)}y ago`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Just now';
    }
  };

  // ============================================
  // LOAD USER FROM PROPS OR LOCAL STORAGE
  // ============================================
  useEffect(() => {
    if (propUser) {
      setLocalUser(propUser);
      return;
    }

    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setLocalUser(parsed);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    };

    loadUser();

    const handleUserUpdate = (event) => {
      console.log('🔄 Header received user update:', event.detail);
      setLocalUser(event.detail);
      localStorage.setItem('user', JSON.stringify(event.detail));
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          setLocalUser(newUser);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [propUser]);

  // ============================================
  // DISPLAY USER
  // ============================================
  const displayUser = localUser || propUser || {
    name: 'John Doe',
    email: 'john.doe@jurisflow.com',
    role: 'Senior Attorney'
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', icon: FaHome, label: 'Dashboard' },
    { 
      id: 'cases-dropdown', 
      icon: FaGavel, 
      label: 'Cases', 
      count: stats?.total || 0,
      isDropdown: true
    },
    { id: 'clients', icon: FaUsers, label: 'Clients' },
    { id: 'calendar', icon: FaCalendarAlt, label: 'Calendar' },
    { id: 'reports', icon: FaChartBar, label: 'Reports' },
  ];

  // ✅ Use real notifications from context
  const notifications = realNotifications.map(n => ({
    id: n._id,
    title: n.title,
    time: n.createdAt || n.time || new Date().toISOString(),
    read: n.read,
    icon: getNotificationIcon(n.type),
    message: n.message,
    data: n.data
  }));

  const getUserInitials = () => {
    const name = displayUser?.name || 'User';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    return displayUser?.name || displayUser?.email || 'User';
  };

  const handleNavClick = (itemId) => {
    console.log('🔘 Header nav clicked:', itemId);
    setIsProfileOpen(false);
    setIsCasesDropdownOpen(false);
    
    if (itemId === 'profile') {
      if (onNavigate) onNavigate('profile');
      return;
    }
    if (itemId === 'settings') {
      if (onNavigate) onNavigate('settings');
      return;
    }
    if (onNavigate) onNavigate(itemId);
  };

  const handleDropdownItemClick = (itemId) => {
    if (onNavigate) onNavigate(itemId);
    setIsCasesDropdownOpen(false);
  };

  // ============================================
  // LOGOUT HANDLER
  // ============================================
  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) await onLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  // ============================================
  // ✅ MARK NOTIFICATION AS READ
  // ============================================
  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  // ============================================
  // ✅ MARK ALL AS READ
  // ============================================
  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // ============================================
  // ✅ DELETE NOTIFICATION
  // ============================================
  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsCasesDropdownOpen(true);
    setIsHoveringCases(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsCasesDropdownOpen(false);
      setIsHoveringCases(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (casesDropdownRef.current && !casesDropdownRef.current.contains(event.target)) {
        setIsCasesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(hoverTimeout);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onNavigate) onNavigate('search', { query: searchQuery });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isCaseActive = () => {
    return activePage === 'cases' || 
           activePage === 'reference-cases' || 
           activePage === 'solved-cases' ||
           activePage === 'active' ||
           activePage === 'pending' ||
           activePage === 'closed';
  };

  return (
    <>
      {/* Premium Top Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>

      <header className="sticky top-0 z-50 bg-[#1B262C] border-b border-[#3282B8]/20 shadow-xl shadow-[#1B262C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Menu Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                onClick={onMenuClick}
                className="lg:hidden p-2 text-[#BBE1FA]/60 hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
              >
                <FaBars className="text-lg" />
              </button>

              <div className="flex items-center gap-3 group" onClick={() => handleNavClick('dashboard')}>
                <div className="gradient-accent p-2 rounded-xl group-hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg shadow-[#0F4C75]/25">
                  <GiScales className="text-white text-xl" />
                </div>
                <div className="hidden sm:block cursor-pointer">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Juris<span className="text-[#3282B8]">Flow</span>
                  </h1>
                  <p className="text-[8px] text-[#BBE1FA]/60 font-medium tracking-[0.2em] uppercase">Legal Case Management</p>
                </div>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#3282B8]/10 rounded-xl p-1 border border-[#3282B8]/20">
              {navItems.map((item) => {
                if (item.isDropdown) {
                  return (
                    <div 
                      key={item.id} 
                      className="relative" 
                      ref={casesDropdownRef}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          isCaseActive()
                            ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/30' 
                            : 'text-[#BBE1FA]/60 hover:text-white hover:bg-[#3282B8]/20'
                        }`}
                      >
                        <item.icon className="text-sm" />
                        {item.label}
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                            isCaseActive()
                              ? 'bg-white/20 text-white' 
                              : 'bg-[#3282B8]/30 text-[#BBE1FA]'
                          }`}>
                            {item.count}
                          </span>
                        )}
                        <FaChevronDown className={`text-[10px] ml-0.5 transition-transform duration-200 ${isCasesDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCasesDropdownOpen && (
                        <div 
                          className="absolute left-0 mt-2 w-64 bg-[#1B262C] border border-[#3282B8]/30 rounded-xl shadow-2xl shadow-[#0F4C75]/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-[#3282B8]/20 bg-[#1B262C]/80">
                            <div className="flex items-center gap-2">
                              <FaGavel className="text-[#3282B8] text-sm" />
                              <span className="text-xs font-semibold text-white uppercase tracking-wider">Cases</span>
                              <span className="ml-auto text-[10px] px-2 py-0.5 gradient-accent text-white rounded-full font-medium">
                                {stats?.total || 0} Total
                              </span>
                            </div>
                          </div>

                          <div className="py-1 max-h-[400px] overflow-y-auto bg-[#1B262C]">
                            <button
                              onClick={() => handleDropdownItemClick('cases')}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group ${
                                activePage === 'cases'
                                  ? 'bg-[#3282B8]/20 text-white border-r-3 border-r-[#3282B8]'
                                  : 'text-[#BBE1FA]/70 hover:bg-[#3282B8]/10 hover:text-white'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                activePage === 'cases'
                                  ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                                  : 'bg-[#3282B8]/10 group-hover:bg-[#3282B8]/20'
                              }`}>
                                <FaList className="text-sm text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-white">All Cases</div>
                                <div className="text-[10px] text-[#BBE1FA]/50">View all cases</div>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-[#3282B8]/20 text-[#3282B8] rounded-full font-medium">
                                {stats?.total || 0}
                              </span>
                            </button>

                            {solvedCases?.length > 0 && (
                              <>
                                <div className="px-4 py-1">
                                  <div className="border-t border-[#3282B8]/20"></div>
                                </div>
                                <button
                                  onClick={() => handleDropdownItemClick('solved-cases')}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group ${
                                    activePage === 'solved-cases'
                                      ? 'bg-[#3282B8]/20 text-white border-r-3 border-r-[#3282B8]'
                                      : 'text-[#BBE1FA]/70 hover:bg-[#3282B8]/10 hover:text-white'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    activePage === 'solved-cases'
                                      ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                                      : 'bg-[#3282B8]/20 group-hover:bg-[#3282B8]/30'
                                  }`}>
                                    <FaCheckDouble className={`text-sm ${activePage === 'solved-cases' ? 'text-white' : 'text-[#3282B8]'}`} />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-sm font-medium text-white">Solved Cases</div>
                                    <div className="text-[10px] text-[#BBE1FA]/50">Resolved cases</div>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 bg-[#3282B8]/20 text-[#3282B8] rounded-full font-medium">
                                    {solvedCases.length}
                                  </span>
                                </button>
                              </>
                            )}

                            <div className="px-4 py-1">
                              <div className="border-t border-[#3282B8]/20"></div>
                            </div>
                            <button
                              onClick={() => handleDropdownItemClick('reference-cases')}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group ${
                                activePage === 'reference-cases'
                                  ? 'bg-[#3282B8]/20 text-white border-r-3 border-r-[#3282B8]'
                                  : 'text-[#BBE1FA]/70 hover:bg-[#3282B8]/10 hover:text-white'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                activePage === 'reference-cases'
                                  ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                                  : 'bg-[#3282B8]/20 group-hover:bg-[#3282B8]/30'
                              }`}>
                                <FaBook className={`text-sm ${activePage === 'reference-cases' ? 'text-white' : 'text-[#3282B8]'}`} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-medium text-white">Reference Cases</div>
                                <div className="text-[10px] text-[#BBE1FA]/50">Legal precedents & research</div>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-[#3282B8]/20 text-[#3282B8] rounded-full font-medium">
                                {referenceCases?.length || 0}
                              </span>
                            </button>
                          </div>

                          <div className="px-4 py-2 border-t border-[#3282B8]/20 bg-[#1B262C]/80">
                            <button
                              onClick={() => handleDropdownItemClick('cases')}
                              className="w-full flex items-center justify-center gap-2 text-xs text-[#3282B8] hover:text-[#BBE1FA] transition-colors py-1"
                            >
                              <FaExternalLinkAlt className="text-[10px]" />
                              View All Cases
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      activePage === item.id 
                        ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/30' 
                        : 'text-[#BBE1FA]/60 hover:text-white hover:bg-[#3282B8]/20'
                    }`}
                  >
                    <item.icon className="text-sm" />
                    {item.label}
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                        activePage === item.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#3282B8]/30 text-[#BBE1FA]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-[#BBE1FA]/60 hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
                >
                  <FaSearch className="text-sm" />
                </button>

                {isSearchOpen && (
                  <form 
                    onSubmit={handleSearch}
                    className="absolute right-0 mt-2 w-80 bg-white border border-[#3282B8] rounded-xl p-2 shadow-premium-lg"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search cases, clients, documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#F0F4F8] text-[#1B262C] placeholder:text-[#9CA3AF] rounded-lg border border-[#BBE1FA] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 gradient-accent text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/30 transition-all font-medium"
                      >
                        <FaSearch className="text-sm" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-[#6B7280] flex items-center gap-1">
                      <span className="text-[#0F4C75]">⌘</span> Press Enter to search
                    </div>
                  </form>
                )}
              </div>
              
              {/* ✅ Notifications - Real-time */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-[#BBE1FA]/60 hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
                >
                  <FaBell className="text-sm" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse ring-2 ring-[#1B262C]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {/* Connection status dot */}
                  <span className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ring-1 ring-[#1B262C]`}></span>
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-[#1B262C] border border-[#3282B8]/30 rounded-xl shadow-2xl shadow-[#0F4C75]/20 overflow-hidden max-h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-[#3282B8]/20 bg-[#1B262C]/80 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isConnected ? '🟢 Live' : '🔴 Offline'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button 
                              onClick={handleMarkAllRead}
                              className="text-xs text-[#3282B8] hover:text-[#BBE1FA] transition-colors font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                          <button 
                            onClick={() => setIsNotificationsOpen(false)}
                            className="text-[#BBE1FA]/50 hover:text-white transition-colors"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 hover:bg-[#3282B8]/10 transition-colors cursor-pointer border-b border-[#3282B8]/10 ${!notif.read ? 'bg-[#3282B8]/5 border-l-2 border-l-[#3282B8]' : ''}`}
                            onClick={() => {
                              if (!notif.read) {
                                handleMarkAsRead(notif.id);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl flex-shrink-0">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-[#BBE1FA]/70'}`}>
                                  {notif.title}
                                </p>
                                <p className="text-xs text-[#BBE1FA]/50 mt-0.5 truncate">
                                  {notif.message || notif.time}
                                </p>
                                <p className="text-[10px] text-[#BBE1FA]/30 mt-1">
                                  {formatTime(notif.time)}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleDeleteNotification(notif.id, e)}
                                className="flex-shrink-0 text-[#BBE1FA]/20 hover:text-red-400 transition-colors"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">🔕</div>
                          <p className="text-[#BBE1FA]/60 text-sm">No notifications</p>
                          <p className="text-[#BBE1FA]/30 text-xs mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-[#3282B8]/20 bg-[#1B262C]/80 flex-shrink-0 text-center">
                        <button 
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-xs text-[#3282B8] hover:text-[#BBE1FA] transition-colors font-medium"
                        >
                          View all ({notifications.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg shadow-[#0F4C75]/25">
                    {getUserInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-medium text-[#BBE1FA]">{getDisplayName()}</p>
                    <p className="text-[10px] text-[#3282B8]">{displayUser?.role || 'User'}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1B262C] border border-[#3282B8]/30 rounded-xl shadow-2xl shadow-[#0F4C75]/20 overflow-hidden">
                    <div className="p-4 border-b border-[#3282B8]/20 bg-[#1B262C]/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-[#0F4C75]/25">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{getDisplayName()}</p>
                          <p className="text-xs text-[#3282B8]">{displayUser?.role || 'User'}</p>
                          <p className="text-[10px] text-[#BBE1FA]/50">{displayUser?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1 bg-[#1B262C]">
                      <button 
                        onClick={() => handleNavClick('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 group ${
                          activePage === 'profile'
                            ? 'bg-[#3282B8]/20 text-white'
                            : 'text-[#BBE1FA]/70 hover:bg-[#3282B8]/10 hover:text-white'
                        }`}
                      >
                        <FaUserCircle className="text-[#3282B8] text-sm" />
                        Profile
                        {activePage === 'profile' && (
                          <span className="ml-auto w-1.5 h-1.5 bg-[#3282B8] rounded-full animate-pulse"></span>
                        )}
                      </button>
                      <button 
                        onClick={() => handleNavClick('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 group ${
                          activePage === 'settings'
                            ? 'bg-[#3282B8]/20 text-white'
                            : 'text-[#BBE1FA]/70 hover:bg-[#3282B8]/10 hover:text-white'
                        }`}
                      >
                        <FaCog className="text-[#3282B8] text-sm" />
                        Settings
                        {activePage === 'settings' && (
                          <span className="ml-auto w-1.5 h-1.5 bg-[#3282B8] rounded-full animate-pulse"></span>
                        )}
                      </button>
                    </div>
                    
                    <div className="border-t border-[#3282B8]/20 py-1 bg-[#1B262C]">
                      <button 
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors group"
                      >
                        <FaSignOutAlt className="text-sm group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Case Button */}
              <button
                onClick={onAddClick}
                className="btn-primary text-sm py-1.5 px-4 flex items-center gap-1.5"
              >
                <FaPlusCircle className="text-xs" />
                <span className="hidden sm:inline">New Case</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Header;