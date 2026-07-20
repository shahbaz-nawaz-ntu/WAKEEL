import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-1.5 p-1 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm relative ${
            activeTab === tab.id
              ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
              : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'
          }`}
        >
          {tab.label}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-[#3282B8]/10 text-[#0F4C75]'
          }`}>
            {tab.count}
          </span>
          
          {/* Active Indicator - Blue Dot */}
          {activeTab === tab.id && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#3282B8] rounded-full shadow-lg shadow-[#0F4C75]/30"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;