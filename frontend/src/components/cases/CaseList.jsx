import React from 'react';
import CaseCard from './CaseCard';
import SearchBar from '../common/SearchBar';
import TabNavigation from '../common/TabNavigation';
import { FaFileAlt, FaGavel, FaClock, FaCheckCircle } from 'react-icons/fa';

const CaseList = ({
  cases,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onViewCase,
  onStatusChange,
  onDeleteCase,
  stats,
}) => {
  const tabs = [
    { id: 'all', label: 'All Cases', count: stats?.total || 0 },
    { id: 'active', label: 'Active', count: stats?.active || 0 },
    { id: 'pending', label: 'Pending', count: stats?.pending || 0 },
    { id: 'closed', label: 'Closed', count: stats?.closed || 0 },
  ];

  // Stats icons for summary
  const statItems = [
    { label: 'Total', value: stats?.total || 0, icon: FaFileAlt, color: 'text-[#1B262C]', bg: 'bg-[#1B262C]/10', border: 'border-[#1B262C]/20' },
    { label: 'Active', value: stats?.active || 0, icon: FaGavel, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/20' },
    { label: 'Pending', value: stats?.pending || 0, icon: FaClock, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' },
    { label: 'Closed', value: stats?.closed || 0, icon: FaCheckCircle, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10', border: 'border-[#6B7280]/20' },
  ];

  return (
    <div className="w-full">
      {/* ===== STATS BAR ===== */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${item.bg} ${item.border} shadow-sm`}
          >
            <item.icon className={`text-sm ${item.color}`} />
            <span className="text-xs text-[#6B7280] font-medium">{item.label}</span>
            <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ===== FILTERS & SEARCH ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <div className="w-full sm:w-auto">
          <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search cases..." />
        </div>
      </div>

      {/* ===== CASE COUNT ===== */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6B7280]">
          Showing <span className="font-semibold text-[#1B262C]">{cases.length}</span> case{cases.length !== 1 ? 's' : ''}
          {searchQuery && (
            <span className="ml-1">
              for "<span className="font-medium text-[#0F4C75]">{searchQuery}</span>"
            </span>
          )}
        </p>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-xs text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
          >
            Clear search
          </button>
        )}
      </div>

      {/* ===== CASE GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            case={caseItem}
            onView={onViewCase}
            onStatusChange={onStatusChange}
            onDelete={onDeleteCase}
          />
        ))}
      </div>

      {/* ===== EMPTY STATE ===== */}
      {cases.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl border border-[#BBE1FA] shadow-premium p-10 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-[#1B262C] mb-2">No cases found</h3>
            <p className="text-sm text-[#6B7280]">
              {searchQuery 
                ? `No results found for "${searchQuery}"` 
                : 'Start by adding a new case'}
            </p>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="mt-4 text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseList;