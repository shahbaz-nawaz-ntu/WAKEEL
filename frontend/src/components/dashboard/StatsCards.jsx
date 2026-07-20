// src/components/dashboard/StatsCards.jsx
import React from 'react';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaUsers, 
  FaArrowUp, 
  FaArrowDown,
  FaGavel,
  FaCalendarAlt
} from 'react-icons/fa';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Cases',
      value: stats?.total || 0,
      icon: FaFileAlt,
      color: '#3282B8',
      bg: 'bg-[#3282B8]/10',
      border: 'border-[#3282B8]/20',
      trend: '+12%',
      up: true,
    },
    {
      title: 'Active Cases',
      value: stats?.active || 0,
      icon: FaGavel,
      color: '#22C55E',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      trend: '+8%',
      up: true,
    },
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      icon: FaClock,
      color: '#F59E0B',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      trend: '-3%',
      up: false,
    },
    {
      title: 'Closed Cases',
      value: stats?.closed || 0,
      icon: FaCheckCircle,
      color: '#6B7280',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      trend: '+24%',
      up: true,
    },
    {
      title: 'Total Clients',
      value: stats?.clients || 0,
      icon: FaUsers,
      color: '#8B5CF6',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      trend: '+5%',
      up: true,
    },
    {
      title: 'Upcoming Events',
      value: stats?.events || 0,
      icon: FaCalendarAlt,
      color: '#EC4899',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      trend: '+2%',
      up: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl border ${card.border} shadow-premium p-5 hover:shadow-premium-lg hover:border-[#3282B8] transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider truncate">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-[#1B262C] mt-1.5">
                {card.value}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-xs font-medium ${card.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {card.up ? <FaArrowUp className="inline mr-0.5 text-[10px]" /> : <FaArrowDown className="inline mr-0.5 text-[10px]" />}
                  {card.trend}
                </span>
                <span className="text-[10px] text-[#9CA3AF]">vs last month</span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0 ml-3`}>
              <card.icon className="text-lg" style={{ color: card.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;