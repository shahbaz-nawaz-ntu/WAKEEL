// src/components/cases/CaseTabs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  Activity,
  FileText,
  Users,
  Calendar,
  Star,
  TrendingUp,
  BarChart,
  Filter
} from 'lucide-react';
import { FaGavel, FaBalanceScale, FaFileAlt } from 'react-icons/fa';

const CaseTabs = ({ activeTab, onTabChange, stats, className = '' }) => {
  const tabs = [
    { 
      id: 'all', 
      label: 'All Cases', 
      icon: Briefcase, 
      count: stats.total || 0,
      color: 'from-[#1B262C] to-[#0F4C75]',
      bgColor: 'bg-[#1B262C]',
      description: 'All cases overview'
    },
    { 
      id: 'pending', 
      label: 'Pending', 
      icon: AlertCircle, 
      count: stats.pending || 0,
      color: 'from-[#F59E0B] to-[#D97706]',
      bgColor: 'bg-[#F59E0B]',
      description: 'Awaiting action'
    },
    { 
      id: 'in-progress', 
      label: 'In Progress', 
      icon: Clock, 
      count: stats.inProgress || 0,
      color: 'from-[#3282B8] to-[#0F4C75]',
      bgColor: 'bg-[#3282B8]',
      description: 'Active cases'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: CheckCircle, 
      count: stats.completed || 0,
      color: 'from-[#22C55E] to-[#16A34A]',
      bgColor: 'bg-[#22C55E]',
      description: 'Resolved cases'
    },
    { 
      id: 'urgent', 
      label: 'Urgent', 
      icon: Star, 
      count: stats.urgent || 0,
      color: 'from-[#EF4444] to-[#DC2626]',
      bgColor: 'bg-[#EF4444]',
      description: 'High priority'
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      icon: FileText, 
      count: stats.archived || 0,
      color: 'from-[#6B7280] to-[#4B5563]',
      bgColor: 'bg-[#6B7280]',
      description: 'Closed cases'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tabs Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0F4C75]/10 border border-[#3282B8]/20">
            <Filter className="w-5 h-5 text-[#0F4C75]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1B262C]">Filter Cases</h3>
            <p className="text-xs text-[#6B7280]">Select a category to filter cases</p>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-[#6B7280]">
            <Activity className="w-3 h-3" />
            <span>Total: <span className="font-semibold text-[#1B262C]">{stats.total || 0}</span></span>
          </div>
          <div className="w-px h-4 bg-[#BBE1FA]"></div>
          <div className="flex items-center gap-1 text-[#22C55E]">
            <TrendingUp className="w-3 h-3" />
            <span>Active: <span className="font-semibold">{stats.inProgress || 0}</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isUrgent = tab.id === 'urgent';
          
          return (
            <motion.button
              key={tab.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl 
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-[${tab.bgColor}/25]` 
                  : 'bg-white text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#1B262C]'
                }
                border ${isActive ? 'border-transparent' : 'border-[#BBE1FA]'}
                group
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-100"
                  style={{ background: `linear-gradient(to right, ${tab.color})` }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#0F4C75]'}`} />
                <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
                
                {/* Count Badge */}
                <span className={`
                  text-xs px-2.5 py-0.5 rounded-full font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[#F0F4F8] text-[#6B7280] group-hover:bg-[#3282B8]/10 group-hover:text-[#0F4C75]'
                  }
                `}>
                  {tab.count}
                </span>

                {/* Urgent Pulse */}
                {isUrgent && tab.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]"></span>
                  </span>
                )}
              </div>

              {/* Tooltip */}
              <div className={`
                absolute -bottom-8 left-1/2 -translate-x-1/2 
                px-2 py-0.5 rounded text-[9px] font-medium
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                ${isActive ? 'text-white/80' : 'text-[#6B7280]'}
                whitespace-nowrap pointer-events-none
              `}>
                {tab.description}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Active Tab Info */}
      {activeTab && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-xs text-[#6B7280] pt-1 border-t border-[#BBE1FA]/50"
        >
          <span className="font-medium text-[#1B262C]">
            {tabs.find(t => t.id === activeTab)?.label || 'All Cases'}
          </span>
          <span className="text-[#9CA3AF]">•</span>
          <span>
            Showing {tabs.find(t => t.id === activeTab)?.count || 0} cases
          </span>
          {tabs.find(t => t.id === activeTab)?.description && (
            <>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-[#6B7280]">
                {tabs.find(t => t.id === activeTab)?.description}
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CaseTabs;