// src/components/dashboard/RecentCases.jsx
import React from 'react';
import { FaEye, FaChevronRight, FaGavel, FaClock, FaCheckCircle } from 'react-icons/fa';

const RecentCases = ({ cases, onViewCase, limit = 5 }) => {
  const recentCases = cases?.slice(0, limit) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-amber-500';
      case 'closed':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (recentCases.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#BBE1FA] shadow-premium p-6">
        <h3 className="text-lg font-semibold text-[#1B262C] mb-4">Recent Cases</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-[#6B7280] text-sm">No cases yet</p>
          <p className="text-[#9CA3AF] text-xs mt-1">Create your first case to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#BBE1FA] shadow-premium p-6 hover:shadow-premium-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1B262C]">Recent Cases</h3>
        <span className="text-xs text-[#6B7280]">
          {recentCases.length} case{recentCases.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {recentCases.map((caseItem, index) => (
          <div
            key={caseItem.id || caseItem._id || index}
            className="flex items-center gap-3 p-3 bg-[#F0F4F8] rounded-xl hover:bg-[#D4AF37]/5 hover:border-[#3282B8] transition-all duration-200 cursor-pointer border border-transparent group"
            onClick={() => onViewCase?.(caseItem)}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 bg-gradient-to-br from-[#1B262C] to-[#0F4C75]">
              {getInitials(caseItem.party || caseItem.caseTitle || caseItem.title)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-medium text-[#1B262C] truncate">
                  {caseItem.caseTitle || caseItem.title || 'Untitled Case'}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(caseItem.status || 'active')}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${getStatusDot(caseItem.status || 'active')} mr-1 align-middle`}></span>
                  {caseItem.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-[#6B7280]">
                  {caseItem.caseNumber || 'No number'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                <span className="text-xs text-[#6B7280]">
                  {caseItem.amount || 'N/A'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                <span className="text-xs text-[#6B7280] truncate max-w-[120px]">
                  {caseItem.party || 'No party'}
                </span>
              </div>
            </div>

            {/* View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewCase?.(caseItem);
              }}
              className="p-2 text-[#6B7280] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <FaEye className="text-sm" />
            </button>

            <FaChevronRight className="text-[#9CA3AF] text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* View All Link */}
      {recentCases.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#BBE1FA]">
          <button
            onClick={() => window.location.href = '/cases'}
            className="text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium flex items-center gap-1"
          >
            View All Cases
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentCases;