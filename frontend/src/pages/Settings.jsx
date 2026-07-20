import React, { useState } from 'react';
import { 
  FaPalette, FaBell, FaLock, FaLanguage, 
  FaUserCog, FaShieldAlt, FaSave, FaTimes,
  FaMoon, FaSun, FaGlobe, FaEnvelope, FaPhone,
  FaKey, FaDesktop, FaMobile, FaDatabase,
  FaUser, FaCog, FaArrowLeft, FaCheckCircle,
  FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = ({ onNavigate }) => {
  const { user, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    caseUpdates: true,
    hearingReminders: true,
    weeklyReports: false,
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactMode: false,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUserCog },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
  ];

  // Go back
  const goBack = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (result.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success('✅ Password updated successfully!');
      }
    } catch (error) {
      toast.error('❌ Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success(`🔔 ${key} ${!notificationSettings[key] ? 'enabled' : 'disabled'}`);
  };

  const handleThemeChange = (key, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    toast.success('🎨 Theme settings updated');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B262C]">Profile Settings</h3>
            <p className="text-sm text-[#6B7280]">Manage your profile information</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-xs text-[#6B7280] block mb-1">Display Name</label>
                <p className="text-sm font-medium text-[#1B262C]">{user?.name || 'N/A'}</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-xs text-[#6B7280] block mb-1">Email</label>
                <p className="text-sm font-medium text-[#1B262C]">{user?.email || 'N/A'}</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-xs text-[#6B7280] block mb-1">Role</label>
                <p className="text-sm font-medium text-[#1B262C]">{user?.role || 'User'}</p>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-xs text-[#6B7280] block mb-1">Member Since</label>
                <p className="text-sm font-medium text-[#1B262C]">{user?.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                if (onNavigate) onNavigate('profile');
              }}
              className="px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-xl hover:bg-[#3282B8]/20 transition-all duration-200 font-medium"
            >
              <FaUserCog className="inline mr-2" /> Edit Profile
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#1B262C]">Security Settings</h3>
            <p className="text-sm text-[#6B7280]">Change your password and security preferences</p>

            {/* Change Password */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-medium text-[#1B262C] mb-3 flex items-center gap-2">
                <FaKey className="text-[#0F4C75]" />
                Change Password
              </h4>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 btn-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="inline mr-2" /> {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* 2FA Toggle */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-[#1B262C] flex items-center gap-2">
                    <FaShieldAlt className="text-[#0F4C75]" />
                    Two-Factor Authentication
                  </h4>
                  <p className="text-xs text-[#6B7280]">Add an extra layer of security</p>
                </div>
                <button className="px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-xl hover:bg-[#22C55E]/20 transition-all duration-200 text-sm font-medium">
                  Enable
                </button>
              </div>
            </div>

            {/* Sessions */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-medium text-[#1B262C] flex items-center gap-2">
                <FaDesktop className="text-[#0F4C75]" />
                Active Sessions
              </h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#BBE1FA]">
                  <div>
                    <p className="text-sm font-medium text-[#1B262C]">Chrome on Windows</p>
                    <p className="text-xs text-[#6B7280]">Current session</p>
                  </div>
                  <span className="text-xs text-[#22C55E] font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#BBE1FA]">
                  <div>
                    <p className="text-sm font-medium text-[#1B262C]">Safari on iPhone</p>
                    <p className="text-xs text-[#6B7280]">2 days ago</p>
                  </div>
                  <button className="text-xs text-[#EF4444] hover:text-[#EF4444]/80 font-medium transition-colors">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B262C]">Notification Settings</h3>
            <p className="text-sm text-[#6B7280]">Manage how you receive notifications</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Email Notifications</p>
                  <p className="text-xs text-[#6B7280]">Receive updates via email</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('emailNotifications')}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notificationSettings.emailNotifications
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Push Notifications</p>
                  <p className="text-xs text-[#6B7280]">Receive push notifications</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('pushNotifications')}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notificationSettings.pushNotifications
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {notificationSettings.pushNotifications ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Case Updates</p>
                  <p className="text-xs text-[#6B7280]">Get notified about case changes</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('caseUpdates')}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notificationSettings.caseUpdates
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {notificationSettings.caseUpdates ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Hearing Reminders</p>
                  <p className="text-xs text-[#6B7280]">Get reminded about hearings</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('hearingReminders')}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notificationSettings.hearingReminders
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {notificationSettings.hearingReminders ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Weekly Reports</p>
                  <p className="text-xs text-[#6B7280]">Receive weekly summary reports</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('weeklyReports')}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    notificationSettings.weeklyReports
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {notificationSettings.weeklyReports ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1B262C]">Appearance Settings</h3>
            <p className="text-sm text-[#6B7280]">Customize how the app looks</p>

            <div className="space-y-3">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-sm font-medium text-[#1B262C] block mb-2">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleThemeChange('theme', 'dark')}
                    className={`flex-1 p-2 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                      themeSettings.theme === 'dark'
                        ? 'border-[#3282B8] bg-[#3282B8]/10'
                        : 'border-[#BBE1FA] hover:border-[#3282B8]/50'
                    }`}
                  >
                    <FaMoon className="text-[#0F4C75]" />
                    <span className="text-sm text-[#1B262C]">Dark</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('theme', 'light')}
                    className={`flex-1 p-2 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                      themeSettings.theme === 'light'
                        ? 'border-[#3282B8] bg-[#3282B8]/10'
                        : 'border-[#BBE1FA] hover:border-[#3282B8]/50'
                    }`}
                  >
                    <FaSun className="text-[#F59E0B]" />
                    <span className="text-sm text-[#1B262C]">Light</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <label className="text-sm font-medium text-[#1B262C] block mb-2">Font Size</label>
                <div className="flex gap-3">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleThemeChange('fontSize', size)}
                      className={`flex-1 p-2 rounded-xl border transition-all duration-200 ${
                        themeSettings.fontSize === size
                          ? 'border-[#3282B8] bg-[#3282B8]/10'
                          : 'border-[#BBE1FA] hover:border-[#3282B8]/50'
                      }`}
                    >
                      <span className={`${
                        size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'
                      } text-[#1B262C] font-medium`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
                <div>
                  <p className="text-sm font-medium text-[#1B262C]">Compact Mode</p>
                  <p className="text-xs text-[#6B7280]">Reduce spacing for more content</p>
                </div>
                <button
                  onClick={() => handleThemeChange('compactMode', !themeSettings.compactMode)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    themeSettings.compactMode
                      ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                      : 'bg-[#F0F4F8] text-[#6B7280] border border-[#BBE1FA] hover:bg-[#3282B8]/10'
                  }`}
                >
                  {themeSettings.compactMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-[#6B7280]">Coming soon...</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#0F4C75] transition-colors mb-4 group"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl border border-[#BBE1FA] shadow-premium overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1B262C]">Settings</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Manage your account preferences</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex-1 min-w-[80px] justify-center ${
                  activeTab === tab.id
                    ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                    : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'
                }`}
              >
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="mt-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;