// src/components/Dashboard/ResponsiveDashboard.jsx
import React, { useState } from 'react';
import { FaGavel, FaUsers, FaCalendarAlt, FaChartBar, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import '../../styles/responsive.css';

const ResponsiveDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = [
    { icon: FaGavel, value: '8', label: 'Cases', color: 'from-[#0F4C75] to-[#3282B8]' },
    { icon: FaUsers, value: '1', label: 'Clients', color: 'from-[#22C55E] to-[#16A34A]' },
    { icon: FaCalendarAlt, value: '1', label: 'Calendar', color: 'from-[#F59E0B] to-[#D97706]' },
    { icon: FaChartBar, value: '1', label: 'Reports', color: 'from-[#EF4444] to-[#DC2626]' },
  ];

  const statusTabs = [
    { label: 'All', count: 8 },
    { label: 'Active', count: 6 },
    { label: 'Pending', count: 1 },
    { label: 'Closed', count: 1 },
  ];

  const cases = [
    {
      id: 1,
      title: 'zee VS dain',
      number: '#321',
      type: 'Suit for recovery',
      status: 'Active',
      division: 'Rawalpindi',
      district: 'Nankana Sahib',
      court: 'Civil Judge 3rd Class',
      nextHearing: 'Jun 18, 2023',
      lawOfficer: 'Department Representative',
      hasDocuments: true,
      isNew: true,
    },
    {
      id: 2,
      title: 'Ahmed VS Company',
      number: '#2026-CV-0801',
      type: 'Civil',
      status: 'Closed',
      division: 'Lahore',
      district: 'Lahore',
      court: 'District Court',
      nextHearing: 'N/A',
      lawOfficer: 'Department Representative',
      hasDocuments: false,
      isNew: false,
    },
    {
      id: 3,
      title: 'shan VS ali',
      number: '#876543',
      type: 'Suit for recovery',
      status: 'Active',
      division: 'Faisalabad',
      district: 'Nankana Sahib',
      court: 'Civil Judge 3rd Class',
      nextHearing: 'May 3, 2021',
      lawOfficer: 'Department Representative',
      hasDocuments: true,
      isNew: true,
    },
    {
      id: 4,
      title: 'john VS jon',
      number: '#85432',
      type: 'Suit for damages',
      status: 'Active',
      division: 'Lahore',
      district: 'Lahore',
      court: 'High Court',
      nextHearing: 'Dec 15, 2024',
      lawOfficer: 'Department Representative',
      hasDocuments: false,
      isNew: true,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Active: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
      Pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      Closed: 'bg-[#9CA3AF]/10 text-[#6B7280] border-[#9CA3AF]/20',
    };
    return colors[status] || colors.Active;
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.number.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="responsive-grid responsive-grid-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between">
                <div className={`stat-icon bg-gradient-to-r ${stat.color} text-white`}>
                  <Icon />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-[#1B262C]">{stat.value}</span>
              </div>
              <p className="stat-label mt-2">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-[#1B262C]">Cases</h3>
          <span className="text-sm text-[#6B7280] bg-[#F0F4F8] px-2 py-0.5 rounded-full border border-[#BBE1FA]/30">
            {filteredCases.length}
          </span>
        </div>
        <button className="btn btn-primary btn-block sm:w-auto">
          <FaPlus className="text-xs sm:text-sm" />
          New Case
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs sm:text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases..."
              className="pl-8 sm:pl-9"
            />
          </div>
        </div>
        <div className="filter-group">
          <FaFilter className="text-[#9CA3AF] text-xs sm:text-sm" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="All">All Status</option>
          </select>
        </div>
        <div className="filter-group">
          <input type="date" className="min-w-[120px]" />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.label)}
            className={`status-tab ${statusFilter === tab.label ? 'active' : ''}`}
          >
            {tab.label}
            <span className="count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Case List */}
      <div className="case-list-container">
        {filteredCases.map((caseItem) => (
          <div key={caseItem.id} className="case-item">
            <div className="case-header">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="case-title">{caseItem.title}</h3>
                <span className="text-xs text-[#6B7280] font-mono">{caseItem.number}</span>
                {caseItem.isNew && (
                  <span className="text-[8px] sm:text-[10px] font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status}
                </span>
                <span className="text-xs text-[#6B7280]">{caseItem.type}</span>
              </div>
            </div>

            <div className="case-meta">
              <div className="case-meta-item">
                <span className="case-meta-label">Division</span>
                <span className="case-meta-value">{caseItem.division}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">District</span>
                <span className="case-meta-value">{caseItem.district}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Court</span>
                <span className="case-meta-value text-truncate">{caseItem.court}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Next Hearing</span>
                <span className="case-meta-value">{caseItem.nextHearing}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Law Officer</span>
                <span className="case-meta-value">{caseItem.lawOfficer}</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Documents</span>
                <span className="case-meta-value">
                  {caseItem.hasDocuments ? '📎 Has attachments' : '📄 No documents'}
                </span>
              </div>
            </div>

            <div className="case-actions">
              <button className="btn btn-primary btn-sm">
                View
              </button>
              <button className="btn btn-secondary btn-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveDashboard;