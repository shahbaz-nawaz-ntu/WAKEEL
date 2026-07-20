import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const CaseTabs = ({ activeTab, onTabChange, stats }) => {
  const tabs = [
    { id: 'all', label: 'All Cases', icon: Briefcase, count: stats.total },
    { id: 'pending', label: 'Pending', icon: AlertCircle, count: stats.pending },
    { id: 'in-progress', label: 'In Progress', icon: Clock, count: stats.inProgress },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: stats.completed }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${isActive ? 'bg-juris-700 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}
              border border-gray-200`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {tab.count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CaseTabs;