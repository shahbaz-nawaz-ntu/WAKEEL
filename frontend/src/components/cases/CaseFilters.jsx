import React from 'react';
import { FaFilter, FaTimes, FaCalendarAlt, FaTag } from 'react-icons/fa';

const CaseFilters = ({ onStatusFilter, onDateFilter, onReset, activeFilters = {} }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (onStatusFilter) onStatusFilter(value);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    if (onDateFilter) onDateFilter(value);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setDateFilter('all');
    if (onReset) onReset();
  };

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* ===== FILTER TOGGLE ===== */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isExpanded || hasActiveFilters
            ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
            : 'bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] hover:bg-[#3282B8]/10 hover:border-[#3282B8]/30'
        }`}
      >
        <FaFilter className="text-xs" />
        Filters
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        )}
      </button>

      {/* ===== FILTER OPTIONS ===== */}
      {(isExpanded || hasActiveFilters) && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="pl-9 pr-8 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all appearance-none cursor-pointer hover:border-[#3282B8]/50"
            >
              <option value="all">All Status</option>
              <option value="active">● Active</option>
              <option value="pending">● Pending</option>
              <option value="closed">● Closed</option>
            </select>
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={handleDateChange}
              className="pl-9 pr-8 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all appearance-none cursor-pointer hover:border-[#3282B8]/50"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              hasActiveFilters
                ? 'text-[#0F4C75] bg-[#3282B8]/10 hover:bg-[#3282B8]/20 border border-[#3282B8]/30'
                : 'text-[#9CA3AF] bg-[#F0F4F8] border border-[#BBE1FA] hover:text-[#1B262C] hover:bg-[#3282B8]/10'
            }`}
          >
            <FaTimes className="text-xs" />
            Reset
          </button>

          {/* Active Filters Count */}
          {hasActiveFilters && (
            <span className="text-xs text-[#6B7280] bg-[#F0F4F8] px-2 py-1 rounded-full border border-[#BBE1FA]">
              {statusFilter !== 'all' ? `Status: ${statusFilter}` : ''}
              {statusFilter !== 'all' && dateFilter !== 'all' ? ' · ' : ''}
              {dateFilter !== 'all' ? `Date: ${dateFilter}` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseFilters;