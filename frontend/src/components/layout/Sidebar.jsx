import React, { useState } from 'react';
import { 
  FaHome, 
  FaGavel, 
  FaUsers, 
  FaCalendarAlt, 
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';

const Sidebar = ({ isOpen, onClose, onNavigate, activePage, stats }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      icon: FaHome,
      label: 'Dashboard',
      count: stats?.total || 0,
    },
    {
      id: 'cases',
      icon: FaGavel,
      label: 'Cases',
      count: stats?.total || 0,
    },
    {
      id: 'clients',
      icon: FaUsers,
      label: 'Clients',
      count: 24,
    },
    {
      id: 'calendar',
      icon: FaCalendarAlt,
      label: 'Calendar',
      count: 8,
    },
    {
      id: 'reports',
      icon: FaChartBar,
      label: 'Reports',
      count: 12,
    },
  ];

  const bottomItems = [
    {
      id: 'settings',
      icon: FaCog,
      label: 'Settings',
    },
    {
      id: 'logout',
      icon: FaSignOutAlt,
      label: 'Logout',
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full z-50 
          bg-[#0a0a0f] border-r border-[rgba(79,70,229,0.1)]
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[rgba(255,255,255,0.05)]">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] p-2 rounded-xl">
                <GiScales className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">JurisFlow</h2>
                <p className="text-[10px] text-gray-500 tracking-wider">LEGAL MANAGEMENT</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] p-2.5 rounded-xl">
              <GiScales className="text-white text-2xl" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all duration-200 hidden lg:block"
          >
            {collapsed ? <FaBars className="text-sm" /> : <FaTimes className="text-sm" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${activePage === item.id 
                    ? 'bg-[rgba(79,70,229,0.15)] border border-[rgba(79,70,229,0.2)] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`text-lg ${activePage === item.id ? 'text-[#818cf8]' : ''}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.count > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded-full text-gray-400">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-[rgba(255,255,255,0.05)]"></div>

          {/* Bottom Items */}
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    if (window.confirm('Are you sure you want to logout?')) {
                      console.log('Logging out...');
                    }
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className="text-lg" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        {!collapsed && (
          <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-[#4f46e5]/30">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400">Senior Attorney</p>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;