// src/components/reports/ReportsDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaChartBar, FaChartLine, FaChartPie, 
  FaFileDownload, FaCalendarAlt, FaUsers,
  FaGavel, FaCheckCircle, FaClock,
  FaFilePdf, FaFileExcel, FaPrint, FaTimes,
  FaEye, FaShareAlt, FaCopy, FaInfoCircle,
  FaEnvelope, FaWhatsapp, FaTwitter, FaArrowUp, FaArrowDown,
  FaBuilding, FaUser, FaBriefcase, FaBalanceScale,
  FaFileInvoice, FaCalendarCheck, FaUserTie, FaHome,
  FaList, FaChartArea, FaDollarSign, FaPercent,
  FaTachometerAlt, FaLayerGroup, FaTags, FaStar,
  FaRegStar, FaRegCalendarAlt, FaRegClock, FaRegFileAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ReportsDashboard = ({ cases = [], clients = [], events = [] }) => {
  const [reportType, setReportType] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

  // ============================================
  // GENERATE REPORT FROM BACKEND DATA
  // ============================================
  const generateReportData = useMemo(() => {
    const stats = {
      // Case Stats
      totalCases: cases?.length || 0,
      activeCases: cases?.filter(c => c.status === 'active').length || 0,
      pendingCases: cases?.filter(c => c.status === 'pending').length || 0,
      closedCases: cases?.filter(c => c.status === 'closed').length || 0,
      
      // Priority Stats
      urgentCases: cases?.filter(c => c.priority === 'Urgent' || c.priority === 'urgent').length || 0,
      highPriority: cases?.filter(c => c.priority === 'High' || c.priority === 'high').length || 0,
      mediumPriority: cases?.filter(c => c.priority === 'Medium' || c.priority === 'medium').length || 0,
      lowPriority: cases?.filter(c => c.priority === 'Low' || c.priority === 'low').length || 0,
      
      // Case Type Stats
      caseTypes: {},
      departments: {},
      
      // Client Stats
      totalClients: clients?.length || 0,
      activeClients: clients?.filter(c => c.status === 'active').length || 0,
      pendingClients: clients?.filter(c => c.status === 'pending').length || 0,
      inactiveClients: clients?.filter(c => c.status === 'inactive' || c.status === 'archived').length || 0,
      
      // Client Types
      clientTypes: {},
      
      // Event Stats
      totalEvents: events?.length || 0,
      upcomingEvents: events?.filter(e => new Date(e.date) > new Date()).length || 0,
      pastEvents: events?.filter(e => new Date(e.date) < new Date()).length || 0,
      
      // Event Types
      eventTypes: {},
      
      // Financial
      totalAmount: 0,
      avgAmount: 0,
      maxAmount: 0,
      minAmount: 0,
      
      // Dates
      earliestCase: null,
      latestCase: null,
      
      // Recent Activity
      recentCases: [],
      recentEvents: [],
    };

    // Calculate Case Types
    cases?.forEach(c => {
      const type = c.caseType || c.type || 'Other';
      stats.caseTypes[type] = (stats.caseTypes[type] || 0) + 1;
      
      const dept = c.department || c.division || 'General';
      stats.departments[dept] = (stats.departments[dept] || 0) + 1;
    });

    // Calculate Client Types
    clients?.forEach(c => {
      const type = c.type || 'Individual';
      stats.clientTypes[type] = (stats.clientTypes[type] || 0) + 1;
    });

    // Calculate Event Types
    events?.forEach(e => {
      const type = e.type || 'Other';
      stats.eventTypes[type] = (stats.eventTypes[type] || 0) + 1;
    });

    // Calculate Financial
    const amounts = [];
    cases?.forEach(c => {
      const amount = parseFloat(c.amount?.replace(/[$,]/g, '') || 0);
      if (amount > 0) {
        amounts.push(amount);
        stats.totalAmount += amount;
      }
    });
    stats.avgAmount = amounts.length > 0 ? stats.totalAmount / amounts.length : 0;
    stats.maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
    stats.minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;

    // Get dates
    const caseDates = cases?.map(c => new Date(c.createdAt || c.date)).filter(d => !isNaN(d));
    if (caseDates && caseDates.length > 0) {
      stats.earliestCase = new Date(Math.min(...caseDates));
      stats.latestCase = new Date(Math.max(...caseDates));
    }

    // Recent Cases
    stats.recentCases = cases?.slice(0, 5) || [];
    stats.recentEvents = events?.slice(0, 5) || [];

    return stats;
  }, [cases, clients, events]);

  useEffect(() => {
    setReportData(generateReportData);
  }, [generateReportData]);

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  const handleExportPDF = () => {
    if (!reportData) return;
    setIsGenerating(true);
    setTimeout(() => {
      const content = generateReportContent(reportData);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('📄 Report downloaded successfully!');
      setIsGenerating(false);
    }, 1000);
  };

  const handleExportExcel = () => {
    if (!reportData) return;
    setIsGenerating(true);
    setTimeout(() => {
      const headers = 'Report Type,Generated Date,Total Cases,Active,Pending,Closed,Urgent,High Priority,Medium,Low,Clients,Active Clients,Events,Upcoming Events,Total Amount,Avg Amount\n';
      const data = `${reportType},${new Date().toLocaleString()},${reportData.totalCases},${reportData.activeCases},${reportData.pendingCases},${reportData.closedCases},${reportData.urgentCases},${reportData.highPriority},${reportData.mediumPriority},${reportData.lowPriority},${reportData.totalClients},${reportData.activeClients},${reportData.totalEvents},${reportData.upcomingEvents},${reportData.totalAmount},${reportData.avgAmount}`;
      const csvContent = headers + data;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('📊 Excel report downloaded!');
      setIsGenerating(false);
    }, 1000);
  };

  const handleExportJSON = () => {
    if (!reportData) return;
    const json = JSON.stringify({ 
      type: reportType, 
      generated: new Date().toISOString(),
      data: reportData,
      cases: cases,
      clients: clients,
      events: events
    }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('📋 JSON report exported!');
  };

  const generateReportContent = (data) => {
    return `
╔════════════════════════════════════════════════════════════╗
║                    JURISFLOW REPORT                        ║
╠════════════════════════════════════════════════════════════╣
║ Report Type: ${reportType.toUpperCase().padEnd(45)}║
║ Generated: ${new Date().toLocaleString().padEnd(45)}║
╠════════════════════════════════════════════════════════════╣

📊 CASE STATISTICS:
  ┌─────────────────────────────────────────────────────────┐
  │  Total Cases: ${String(data.totalCases).padStart(10)}                                    │
  │  Active:      ${String(data.activeCases).padStart(10)}                                    │
  │  Pending:     ${String(data.pendingCases).padStart(10)}                                    │
  │  Closed:      ${String(data.closedCases).padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

🎯 PRIORITY DISTRIBUTION:
  ┌─────────────────────────────────────────────────────────┐
  │  Urgent:  ${String(data.urgentCases).padStart(10)}                                    │
  │  High:    ${String(data.highPriority).padStart(10)}                                    │
  │  Medium:  ${String(data.mediumPriority).padStart(10)}                                    │
  │  Low:     ${String(data.lowPriority).padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

📂 CASE TYPES:
${Object.entries(data.caseTypes).map(([key, val]) => `  │  ${key.padEnd(30)}: ${String(val).padStart(5)}                                    │`).join('\n')}

👥 CLIENT STATISTICS:
  ┌─────────────────────────────────────────────────────────┐
  │  Total Clients:  ${String(data.totalClients).padStart(10)}                                    │
  │  Active:         ${String(data.activeClients).padStart(10)}                                    │
  │  Pending:        ${String(data.pendingClients).padStart(10)}                                    │
  │  Inactive:       ${String(data.inactiveClients).padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

📅 EVENT STATISTICS:
  ┌─────────────────────────────────────────────────────────┐
  │  Total Events:   ${String(data.totalEvents).padStart(10)}                                    │
  │  Upcoming:       ${String(data.upcomingEvents).padStart(10)}                                    │
  │  Past:           ${String(data.pastEvents).padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

💰 FINANCIAL:
  ┌─────────────────────────────────────────────────────────┐
  │  Total Amount:   $${String(data.totalAmount.toLocaleString()).padStart(10)}                                    │
  │  Average:        $${String(data.avgAmount.toLocaleString()).padStart(10)}                                    │
  │  Maximum:        $${String(data.maxAmount.toLocaleString()).padStart(10)}                                    │
  │  Minimum:        $${String(data.minAmount.toLocaleString()).padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

📅 DATES:
  ┌─────────────────────────────────────────────────────────┐
  │  Earliest Case:  ${(data.earliestCase ? data.earliestCase.toLocaleDateString() : 'N/A').padStart(10)}                                    │
  │  Latest Case:    ${(data.latestCase ? data.latestCase.toLocaleDateString() : 'N/A').padStart(10)}                                    │
  └─────────────────────────────────────────────────────────┘

╚════════════════════════════════════════════════════════════╝
© ${new Date().getFullYear()} JurisFlow - All Rights Reserved
    `;
  };

  // ============================================
  // SHARE FUNCTIONS
  // ============================================
  const handleShareReport = () => setShowShareModal(true);
  const handleDownloadReport = () => setShowExportModal(true);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/reports/${reportType}`;
    navigator.clipboard?.writeText(url).then(() => {
      toast.success('📋 Report link copied!');
    }).catch(() => {
      toast.success('📋 Link ready to copy!');
    });
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent(`JurisFlow Report: ${reportType}`);
    const body = encodeURIComponent(`Report generated: ${new Date().toLocaleString()}\nTotal Cases: ${reportData?.totalCases || 0}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.info('📧 Opening email...');
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`📊 JurisFlow ${reportType} Report\nGenerated: ${new Date().toLocaleString()}\nTotal Cases: ${reportData?.totalCases || 0}\nActive: ${reportData?.activeCases || 0}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    toast.info('💬 Opening WhatsApp...');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`📊 JurisFlow Report: ${reportData?.totalCases || 0} total cases`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    toast.info('🐦 Opening Twitter...');
  };

  const handlePrintReport = () => {
    toast.info('🖨️ Preparing print...');
    setTimeout(() => window.print(), 500);
  };

  const handleRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setReportData(generateReportData);
      toast.success('🔄 Data refreshed!');
      setIsGenerating(false);
    }, 1000);
  };

  const handleViewReport = (type) => {
    toast.info(`👁️ Viewing ${type} report`);
  };

  // ============================================
  // MODALS
  // ============================================
  const ExportModal = () => {
    if (!showExportModal) return null;
    return (
      <div className="fixed inset-0 bg-[#1B262C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#3282B8]/30 animate-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3282B8]/10 flex items-center justify-center">
                <FaFileDownload className="text-[#0F4C75]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B262C]">Export Report</h3>
                <p className="text-xs text-[#6B7280]">Choose your export format</p>
              </div>
            </div>
            <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-[#F0F4F8] rounded-lg transition-all">
              <FaTimes className="text-[#9CA3AF]" />
            </button>
          </div>
          <div className="space-y-2">
            <button onClick={() => { setShowExportModal(false); handleExportPDF(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
                <FaFilePdf className="text-[#EF4444]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1B262C]">PDF Document</p>
                <p className="text-xs text-[#6B7280]">Print-ready format</p>
              </div>
              <FaArrowUp className="text-[#9CA3AF] text-xs" />
            </button>
            <button onClick={() => { setShowExportModal(false); handleExportExcel(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-all">
                <FaFileExcel className="text-[#22C55E]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1B262C]">Excel (CSV)</p>
                <p className="text-xs text-[#6B7280]">Data analysis format</p>
              </div>
              <FaArrowUp className="text-[#9CA3AF] text-xs" />
            </button>
            <button onClick={() => { setShowExportModal(false); handleExportJSON(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all">
                <FaFileDownload className="text-[#0F4C75]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#1B262C]">JSON</p>
                <p className="text-xs text-[#6B7280]">Developer format</p>
              </div>
              <FaArrowUp className="text-[#9CA3AF] text-xs" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ShareModal = () => {
    if (!showShareModal) return null;
    return (
      <div className="fixed inset-0 bg-[#1B262C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#3282B8]/30 animate-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3282B8]/10 flex items-center justify-center">
                <FaShareAlt className="text-[#0F4C75]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B262C]">Share Report</h3>
                <p className="text-xs text-[#6B7280]">Share via your preferred channel</p>
              </div>
            </div>
            <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-[#F0F4F8] rounded-lg transition-all">
              <FaTimes className="text-[#9CA3AF]" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setShowShareModal(false); handleCopyLink(); }} className="flex flex-col items-center gap-2 px-4 py-4 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-10 h-10 rounded-full bg-[#0F4C75]/10 flex items-center justify-center group-hover:bg-[#0F4C75]/20 transition-all">
                <FaCopy className="text-[#0F4C75] text-lg" />
              </div>
              <span className="text-xs font-medium text-[#1B262C]">Copy Link</span>
            </button>
            <button onClick={() => { setShowShareModal(false); handleEmailReport(); }} className="flex flex-col items-center gap-2 px-4 py-4 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
                <FaEnvelope className="text-[#EF4444] text-lg" />
              </div>
              <span className="text-xs font-medium text-[#1B262C]">Email</span>
            </button>
            <button onClick={() => { setShowShareModal(false); handleWhatsAppShare(); }} className="flex flex-col items-center gap-2 px-4 py-4 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-all">
                <FaWhatsapp className="text-[#22C55E] text-lg" />
              </div>
              <span className="text-xs font-medium text-[#1B262C]">WhatsApp</span>
            </button>
            <button onClick={() => { setShowShareModal(false); handleTwitterShare(); }} className="flex flex-col items-center gap-2 px-4 py-4 bg-[#F0F4F8] rounded-xl hover:bg-[#3282B8]/10 transition-all group">
              <div className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center group-hover:bg-[#1DA1F2]/20 transition-all">
                <FaTwitter className="text-[#1DA1F2] text-lg" />
              </div>
              <span className="text-xs font-medium text-[#1B262C]">Twitter</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // REPORT TYPE TABS
  // ============================================
  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt, color: 'text-[#0F4C75]' },
    { id: 'cases', label: 'Case Report', icon: FaGavel, color: 'text-[#3282B8]' },
    { id: 'clients', label: 'Client Report', icon: FaUsers, color: 'text-[#22C55E]' },
    { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt, color: 'text-[#F59E0B]' },
    { id: 'financial', label: 'Financial', icon: FaDollarSign, color: 'text-[#8B5CF6]' },
  ];

  // ============================================
  // RENDER REPORT CONTENT
  // ============================================
  const renderReportContent = () => {
    if (!reportData) return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0F4C75] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#6B7280]">Loading report data...</p>
      </div>
    );

    const data = reportData;

    switch (reportType) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Cases', value: data.totalCases, icon: FaGavel, color: 'text-[#1B262C]', bg: 'bg-[#F0F4F8]' },
                { label: 'Active', value: data.activeCases, icon: FaCheckCircle, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                { label: 'Pending', value: data.pendingCases, icon: FaClock, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                { label: 'Closed', value: data.closedCases, icon: FaTimes, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
                { label: 'Clients', value: data.totalClients, icon: FaUsers, color: 'text-[#0F4C75]', bg: 'bg-[#3282B8]/10' },
                { label: 'Events', value: data.totalEvents, icon: FaCalendarAlt, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
              ].map((stat, index) => (
                <div key={index} className={`p-4 ${stat.bg} rounded-xl border border-[#BBE1FA]/50 text-center hover:border-[#3282B8] hover:shadow-md transition-all cursor-pointer`} onClick={() => handleViewReport(stat.label)}>
                  <stat.icon className={`mx-auto mb-1 ${stat.color} text-lg`} />
                  <p className="text-2xl font-bold text-[#1B262C]">{stat.value}</p>
                  <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Priority & Case Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-[#1B262C] mb-4 flex items-center gap-2">
                  <FaChartPie className="text-[#0F4C75]" /> Priority Distribution
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Urgent', count: data.urgentCases, color: 'bg-[#EF4444]', icon: FaStar },
                    { label: 'High', count: data.highPriority, color: 'bg-[#F59E0B]', icon: FaArrowUp },
                    { label: 'Medium', count: data.mediumPriority, color: 'bg-[#3282B8]', icon: FaArrowUp },
                    { label: 'Low', count: data.lowPriority, color: 'bg-[#22C55E]', icon: FaArrowDown },
                  ].map(p => {
                    const percentage = data.totalCases > 0 ? (p.count / data.totalCases) * 100 : 0;
                    return (
                      <div key={p.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2 text-[#6B7280]">
                            <p.icon className="text-xs" />
                            {p.label}
                          </span>
                          <span className="text-[#1B262C] font-medium">{p.count}</span>
                        </div>
                        <div className="w-full bg-[#BBE1FA]/30 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 rounded-full ${p.color} transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-[#1B262C] mb-4 flex items-center gap-2">
                  <FaTags className="text-[#0F4C75]" /> Case Types
                </h3>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#BBE1FA]">
                  {Object.entries(data.caseTypes).map(([type, count]) => {
                    const percentage = data.totalCases > 0 ? (count / data.totalCases) * 100 : 0;
                    const colors = ['#3282B8', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
                    const colorIndex = Object.keys(data.caseTypes).indexOf(type) % colors.length;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#6B7280] truncate max-w-[200px]">{type}</span>
                          <span className="text-[#1B262C] font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-[#BBE1FA]/30 rounded-full h-2 overflow-hidden">
                          <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: colors[colorIndex] }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(data.caseTypes).length === 0 && (
                    <p className="text-center text-[#6B7280] text-sm py-4">No case types available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-[#1B262C] mb-4 flex items-center gap-2">
                <FaChartLine className="text-[#0F4C75]" /> Recent Activity
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#BBE1FA]">
                {events?.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50 hover:border-[#3282B8] hover:bg-white transition-all cursor-pointer" onClick={() => handleViewReport(event.title)}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#0F4C75]"></div>
                      <div>
                        <p className="text-sm font-medium text-[#1B262C]">{event.title}</p>
                        <p className="text-xs text-[#6B7280]">{event.type || 'Event'}</p>
                      </div>
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                ))}
                {(!events || events.length === 0) && (
                  <div className="text-center py-6 text-[#6B7280] text-sm">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'cases':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1B262C] flex items-center gap-2">
                  <FaGavel className="text-[#0F4C75]" /> Case Report
                </h3>
                <p className="text-sm text-[#6B7280]">Detailed case statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaFilePdf /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all text-xs font-medium">
                  <FaFileExcel /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all text-xs font-medium">
                  <FaFileDownload /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all text-xs font-medium">
                  <FaPrint /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Cases', value: data.totalCases, color: 'text-[#1B262C]', bg: 'bg-[#F0F4F8]' },
                { label: 'Active', value: data.activeCases, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                { label: 'Pending', value: data.pendingCases, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                { label: 'Closed', value: data.closedCases, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
              ].map((stat, index) => (
                <div key={index} className={`p-4 ${stat.bg} rounded-xl border border-[#BBE1FA]/50 text-center hover:border-[#3282B8] hover:shadow-md transition-all cursor-pointer`} onClick={() => handleViewReport(stat.label)}>
                  <p className="text-3xl font-bold ${stat.color}">{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-[#0F4C75]" /> Status Breakdown
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Active', count: data.activeCases, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                    { label: 'Pending', count: data.pendingCases, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                    { label: 'Closed', count: data.closedCases, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 ${item.bg} rounded-lg border border-[#BBE1FA]/50 text-center cursor-pointer hover:border-[#3282B8] transition-all`} onClick={() => handleViewReport(item.label)}>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                      <p className="text-xs text-[#6B7280]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartBar className="text-[#0F4C75]" /> Priority Breakdown
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Urgent', count: data.urgentCases, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
                    { label: 'High', count: data.highPriority, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                    { label: 'Medium', count: data.mediumPriority, color: 'text-[#3282B8]', bg: 'bg-[#3282B8]/10' },
                    { label: 'Low', count: data.lowPriority, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                  ].map((item, i) => (
                    <div key={i} className={`p-2 ${item.bg} rounded-lg border border-[#BBE1FA]/50 text-center cursor-pointer hover:border-[#3282B8] transition-all`} onClick={() => handleViewReport(item.label)}>
                      <p className={`text-lg font-bold ${item.color}`}>{item.count}</p>
                      <p className="text-[9px] text-[#6B7280]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                <FaTags className="text-[#0F4C75]" /> Case Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.caseTypes).map(([type, count]) => (
                  <div key={type} className="px-4 py-2 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50 flex items-center gap-2 cursor-pointer hover:border-[#3282B8] hover:bg-white transition-all" onClick={() => handleViewReport(type)}>
                    <span className="text-sm text-[#1B262C]">{type}</span>
                    <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded-full text-xs font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(data.caseTypes).length === 0 && (
                  <p className="text-[#6B7280] text-sm py-2">No case types found</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1B262C] flex items-center gap-2">
                  <FaUsers className="text-[#0F4C75]" /> Client Report
                </h3>
                <p className="text-sm text-[#6B7280]">Client statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaFilePdf /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all text-xs font-medium">
                  <FaFileExcel /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all text-xs font-medium">
                  <FaFileDownload /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all text-xs font-medium">
                  <FaPrint /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Clients', value: data.totalClients, color: 'text-[#1B262C]', bg: 'bg-[#F0F4F8]' },
                { label: 'Active', value: data.activeClients, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                { label: 'Inactive', value: data.inactiveClients, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
              ].map((stat, index) => (
                <div key={index} className={`p-4 ${stat.bg} rounded-xl border border-[#BBE1FA]/50 text-center hover:border-[#3282B8] hover:shadow-md transition-all cursor-pointer`} onClick={() => handleViewReport(stat.label)}>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartPie className="text-[#0F4C75]" /> Client Status
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Active', count: data.activeClients, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                    { label: 'Pending', count: data.pendingClients, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                    { label: 'Inactive', count: data.inactiveClients, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 ${item.bg} rounded-lg border border-[#BBE1FA]/50 text-center cursor-pointer hover:border-[#3282B8] transition-all`} onClick={() => handleViewReport(item.label)}>
                      <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                      <p className="text-xs text-[#6B7280]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaUser className="text-[#0F4C75]" /> Client Types
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.clientTypes).map(([type, count]) => {
                    const percentage = data.totalClients > 0 ? (count / data.totalClients) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">{type}</span>
                          <span className="text-[#1B262C] font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-[#BBE1FA]/30 rounded-full h-2 overflow-hidden">
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] transition-all duration-700" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(data.clientTypes).length === 0 && (
                    <p className="text-[#6B7280] text-sm py-2 text-center">No client types found</p>
                  )}
                </div>
              </div>
            </div>

            {clients && clients.length > 0 && (
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaUserTie className="text-[#0F4C75]" /> Recent Clients
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#BBE1FA]">
                  {clients.slice(0, 5).map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50 hover:border-[#3282B8] hover:bg-white transition-all cursor-pointer" onClick={() => handleViewReport(client.name)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3282B8]/10 flex items-center justify-center">
                          <FaUser className="text-[#0F4C75] text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1B262C]">{client.name}</p>
                          <p className="text-xs text-[#6B7280]">{client.email || client.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${client.status === 'active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : client.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#6B7280]/10 text-[#6B7280]'}`}>
                        {client.status || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1B262C] flex items-center gap-2">
                  <FaCalendarAlt className="text-[#0F4C75]" /> Calendar Report
                </h3>
                <p className="text-sm text-[#6B7280]">Event statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaFilePdf /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all text-xs font-medium">
                  <FaFileExcel /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all text-xs font-medium">
                  <FaFileDownload /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all text-xs font-medium">
                  <FaPrint /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Events', value: data.totalEvents, color: 'text-[#1B262C]', bg: 'bg-[#F0F4F8]' },
                { label: 'Upcoming', value: data.upcomingEvents, color: 'text-[#0F4C75]', bg: 'bg-[#3282B8]/10' },
                { label: 'Past', value: data.pastEvents, color: 'text-[#6B7280]', bg: 'bg-[#6B7280]/10' },
              ].map((stat, index) => (
                <div key={index} className={`p-4 ${stat.bg} rounded-xl border border-[#BBE1FA]/50 text-center hover:border-[#3282B8] hover:shadow-md transition-all cursor-pointer`} onClick={() => handleViewReport(stat.label)}>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                <FaTags className="text-[#0F4C75]" /> Event Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.eventTypes).map(([type, count]) => (
                  <div key={type} className="px-4 py-2 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50 flex items-center gap-2 cursor-pointer hover:border-[#3282B8] hover:bg-white transition-all" onClick={() => handleViewReport(type)}>
                    <span className="text-sm text-[#1B262C]">{type}</span>
                    <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded-full text-xs font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(data.eventTypes).length === 0 && (
                  <p className="text-[#6B7280] text-sm py-2">No event types found</p>
                )}
              </div>
            </div>

            {events && events.length > 0 && (
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaCalendarCheck className="text-[#0F4C75]" /> Upcoming Events
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#BBE1FA]">
                  {events.filter(e => new Date(e.date) > new Date()).slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50 hover:border-[#3282B8] hover:bg-white transition-all cursor-pointer" onClick={() => handleViewReport(event.title)}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                        <div>
                          <p className="text-sm font-medium text-[#1B262C]">{event.title}</p>
                          <p className="text-xs text-[#6B7280]">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-[#0F4C75]/10 text-[#0F4C75] rounded-full">{event.type || 'Event'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1B262C] flex items-center gap-2">
                  <FaDollarSign className="text-[#0F4C75]" /> Financial Report
                </h3>
                <p className="text-sm text-[#6B7280]">Financial statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaFilePdf /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all text-xs font-medium">
                  <FaFileExcel /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all text-xs font-medium">
                  <FaFileDownload /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all text-xs font-medium">
                  <FaPrint /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all text-xs font-medium">
                  <FaShareAlt /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Amount', value: `$${data.totalAmount.toLocaleString()}`, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                { label: 'Average', value: `$${data.avgAmount.toLocaleString()}`, color: 'text-[#0F4C75]', bg: 'bg-[#3282B8]/10' },
                { label: 'Total Cases', value: data.totalCases, color: 'text-[#1B262C]', bg: 'bg-[#F0F4F8]' },
              ].map((stat, index) => (
                <div key={index} className={`p-4 ${stat.bg} rounded-xl border border-[#BBE1FA]/50 text-center hover:border-[#3282B8] hover:shadow-md transition-all cursor-pointer`} onClick={() => handleViewReport(stat.label)}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartBar className="text-[#0F4C75]" /> Financial Summary
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Total Amount', value: `$${data.totalAmount.toLocaleString()}`, icon: FaDollarSign },
                    { label: 'Average per Case', value: `$${data.avgAmount.toLocaleString()}`, icon: FaPercent },
                    { label: 'Maximum Amount', value: `$${data.maxAmount.toLocaleString()}`, icon: FaArrowUp },
                    { label: 'Minimum Amount', value: `$${data.minAmount.toLocaleString()}`, icon: FaArrowDown },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/50">
                      <span className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <item.icon className="text-[#0F4C75]" /> {item.label}
                      </span>
                      <span className="font-semibold text-[#1B262C]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-[#BBE1FA] shadow-sm">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartPie className="text-[#0F4C75]" /> Priority Distribution
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Urgent', count: data.urgentCases, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
                    { label: 'High', count: data.highPriority, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                    { label: 'Medium', count: data.mediumPriority, color: 'text-[#3282B8]', bg: 'bg-[#3282B8]/10' },
                    { label: 'Low', count: data.lowPriority, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 ${p.bg} rounded-lg border border-[#BBE1FA]/50`}>
                      <span className="text-sm text-[#6B7280]">{p.label}</span>
                      <span className={`font-semibold ${p.color}`}>{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center py-12 text-[#6B7280]">Select a report type to view data</div>;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="bg-white rounded-2xl border border-[#BBE1FA] shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1B262C] flex items-center gap-3">
            <span className="gradient-accent p-2 rounded-xl text-white">
              <FaChartBar className="text-white" />
            </span>
            Reports & Analytics
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">Real-time reports from your database</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handleRefresh} 
            className="flex items-center gap-2 px-4 py-2 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 transition-all font-medium text-sm"
          >
            <FaClock className="text-sm" /> Refresh
          </button>
          <button 
            onClick={handleExportPDF} 
            className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-xl hover:bg-[#3282B8]/20 transition-all font-medium text-sm"
          >
            <FaFilePdf /> PDF
          </button>
          <button 
            onClick={handleExportExcel} 
            className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-xl hover:bg-[#22C55E]/20 transition-all font-medium text-sm"
          >
            <FaFileExcel /> Excel
          </button>
          <button 
            onClick={handlePrintReport} 
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-xl hover:bg-[#8B5CF6]/20 transition-all font-medium text-sm"
          >
            <FaPrint /> Print
          </button>
          <button 
            onClick={handleShareReport} 
            className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-xl hover:bg-[#3282B8]/20 transition-all font-medium text-sm"
          >
            <FaShareAlt /> Share
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm flex-1 min-w-[100px] justify-center ${
              reportType === type.id
                ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                : `text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10 ${type.color}`
            }`}
          >
            <type.icon className="text-sm" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg border border-[#BBE1FA]">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0F4C75] border-t-transparent"></div>
              <span className="text-[#1B262C] font-medium">Generating report...</span>
            </div>
          </div>
        )}
        {renderReportContent()}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#BBE1FA] flex items-center justify-between text-xs text-[#6B7280]">
        <span>Last updated: {new Date().toLocaleString()}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          Live data
        </span>
      </div>

      {/* Modals */}
      <ExportModal />
      <ShareModal />
    </div>
  );
};

export default ReportsDashboard;