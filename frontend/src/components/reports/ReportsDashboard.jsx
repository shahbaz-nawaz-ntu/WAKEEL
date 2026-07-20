// src/components/reports/ReportsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, FaChartLine, FaChartPie, 
  FaFileDownload, FaCalendarAlt, FaUsers,
  FaGavel, FaCheckCircle, FaClock,
  FaFilePdf, FaFileExcel, FaPrint, FaTimes,
  FaEye, FaShareAlt, FaCopy, FaInfoCircle,
  FaEnvelope, FaWhatsapp, FaTwitter, FaArrowUp, FaArrowDown,
  FaBuilding, FaUser, FaBriefcase, FaBalanceScale,
  FaFileInvoice, FaCalendarCheck, FaUserTie, FaHome,
  FaList, FaChartArea, FaDollarSign, FaPercent
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ReportsDashboard = ({ cases = [], clients = [], events = [] }) => {
  const [reportType, setReportType] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [reportData, setReportData] = useState(null);

  // ============================================
  // GENERATE REPORT FROM BACKEND DATA
  // ============================================
  useEffect(() => {
    generateReportData();
  }, [cases, clients, events, reportType]);

  const generateReportData = () => {
    const stats = {
      // Case Stats
      totalCases: cases?.length || 0,
      activeCases: cases?.filter(c => c.status === 'active').length || 0,
      pendingCases: cases?.filter(c => c.status === 'pending').length || 0,
      closedCases: cases?.filter(c => c.status === 'closed').length || 0,
      
      // Priority Stats
      urgentCases: cases?.filter(c => c.priority === 'Urgent').length || 0,
      highPriority: cases?.filter(c => c.priority === 'High').length || 0,
      mediumPriority: cases?.filter(c => c.priority === 'Medium').length || 0,
      lowPriority: cases?.filter(c => c.priority === 'Low').length || 0,
      
      // Case Type Stats
      caseTypes: {},
      
      // Client Stats
      totalClients: clients?.length || 0,
      activeClients: clients?.filter(c => c.status === 'active').length || 0,
      pendingClients: clients?.filter(c => c.status === 'pending').length || 0,
      inactiveClients: clients?.filter(c => c.status === 'inactive').length || 0,
      
      // Event Stats
      totalEvents: events?.length || 0,
      upcomingEvents: events?.filter(e => new Date(e.date) > new Date()).length || 0,
      pastEvents: events?.filter(e => new Date(e.date) < new Date()).length || 0,
      
      // Event Types
      eventTypes: {},
      
      // Financial
      totalAmount: 0,
      avgAmount: 0,
      
      // Dates
      earliestCase: null,
      latestCase: null,
    };

    // Calculate Case Types
    cases?.forEach(c => {
      const type = c.caseType || c.type || 'Other';
      stats.caseTypes[type] = (stats.caseTypes[type] || 0) + 1;
    });

    // Calculate Event Types
    events?.forEach(e => {
      const type = e.type || 'Other';
      stats.eventTypes[type] = (stats.eventTypes[type] || 0) + 1;
    });

    // Calculate Financial
    cases?.forEach(c => {
      const amount = parseFloat(c.amount?.replace(/[$,]/g, '') || 0);
      if (amount > 0) {
        stats.totalAmount += amount;
      }
    });
    stats.avgAmount = stats.totalCases > 0 ? stats.totalAmount / stats.totalCases : 0;

    // Get dates
    const caseDates = cases?.map(c => new Date(c.createdAt || c.date)).filter(d => !isNaN(d));
    if (caseDates && caseDates.length > 0) {
      stats.earliestCase = new Date(Math.min(...caseDates));
      stats.latestCase = new Date(Math.max(...caseDates));
    }

    setReportData(stats);
  };

  // ============================================
  // EXPORT FUNCTIONS
  // ============================================
  const handleExportPDF = () => {
    if (!reportData) return;
    setIsGenerating(true);
    setTimeout(() => {
      const content = generateReportContent(reportData);
      const blob = new Blob([content], { type: 'application/pdf' });
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
JURISFLOW REPORT
${'='.repeat(50)}
Report Type: ${reportType.toUpperCase()}
Generated: ${new Date().toLocaleString()}
${'='.repeat(50)}

CASE STATISTICS:
Total Cases: ${data.totalCases}
Active: ${data.activeCases}
Pending: ${data.pendingCases}
Closed: ${data.closedCases}

PRIORITY DISTRIBUTION:
Urgent: ${data.urgentCases}
High: ${data.highPriority}
Medium: ${data.mediumPriority}
Low: ${data.lowPriority}

CASE TYPES:
${Object.entries(data.caseTypes).map(([key, val]) => `  ${key}: ${val}`).join('\n')}

CLIENT STATISTICS:
Total Clients: ${data.totalClients}
Active: ${data.activeClients}
Pending: ${data.pendingClients}
Inactive: ${data.inactiveClients}

EVENT STATISTICS:
Total Events: ${data.totalEvents}
Upcoming: ${data.upcomingEvents}
Past: ${data.pastEvents}

EVENT TYPES:
${Object.entries(data.eventTypes).map(([key, val]) => `  ${key}: ${val}`).join('\n')}

FINANCIAL:
Total Amount: $${data.totalAmount.toLocaleString()}
Average Amount: $${data.avgAmount.toLocaleString()}

DATES:
Earliest Case: ${data.earliestCase ? data.earliestCase.toLocaleDateString() : 'N/A'}
Latest Case: ${data.latestCase ? data.latestCase.toLocaleDateString() : 'N/A'}

${'='.repeat(50)}
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
      generateReportData();
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
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-premium-lg border border-[#3282B8]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#1B262C]">Export Report</h3>
            <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-[#F0F4F8] rounded-lg">
              <FaTimes className="text-[#9CA3AF]" />
            </button>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">Choose export format:</p>
          <div className="space-y-2">
            <button onClick={() => { setShowExportModal(false); handleExportPDF(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors">
              <FaFilePdf className="text-[#EF4444]" /> PDF Document
            </button>
            <button onClick={() => { setShowExportModal(false); handleExportExcel(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors">
              <FaFileExcel className="text-[#22C55E]" /> Excel (CSV)
            </button>
            <button onClick={() => { setShowExportModal(false); handleExportJSON(); }} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors">
              <FaFileDownload className="text-[#0F4C75]" /> JSON
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
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-premium-lg border border-[#3282B8]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#1B262C]">Share Report</h3>
            <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-[#F0F4F8] rounded-lg">
              <FaTimes className="text-[#9CA3AF]" />
            </button>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">Share this report via:</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setShowShareModal(false); handleCopyLink(); }} className="flex items-center gap-2 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors justify-center">
              <FaCopy className="text-[#0F4C75]" /> Copy Link
            </button>
            <button onClick={() => { setShowShareModal(false); handleEmailReport(); }} className="flex items-center gap-2 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors justify-center">
              <FaEnvelope className="text-[#EF4444]" /> Email
            </button>
            <button onClick={() => { setShowShareModal(false); handleWhatsAppShare(); }} className="flex items-center gap-2 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors justify-center">
              <FaWhatsapp className="text-[#22C55E]" /> WhatsApp
            </button>
            <button onClick={() => { setShowShareModal(false); handleTwitterShare(); }} className="flex items-center gap-2 px-4 py-3 bg-[#F0F4F8] rounded-lg hover:bg-[#3282B8]/10 transition-colors justify-center">
              <FaTwitter className="text-[#1DA1F2]" /> Twitter
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
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'cases', label: 'Case Report', icon: FaGavel },
    { id: 'clients', label: 'Client Report', icon: FaUsers },
    { id: 'calendar', label: 'Calendar Report', icon: FaCalendarAlt },
    { id: 'financial', label: 'Financial Report', icon: FaDollarSign },
  ];

  // ============================================
  // RENDER REPORT CONTENT
  // ============================================
  const renderReportContent = () => {
    if (!reportData) return <div className="text-center py-8">Loading report data...</div>;

    const data = reportData;

    switch (reportType) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Cases')}>
                <p className="text-xs text-[#6B7280]">Total Cases</p>
                <p className="text-xl font-bold text-[#1B262C]">{data.totalCases}</p>
              </div>
              <div className="p-3 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Active')}>
                <p className="text-xs text-[#6B7280]">Active</p>
                <p className="text-xl font-bold text-[#22C55E]">{data.activeCases}</p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Pending')}>
                <p className="text-xs text-[#6B7280]">Pending</p>
                <p className="text-xl font-bold text-[#F59E0B]">{data.pendingCases}</p>
              </div>
              <div className="p-3 bg-[#6B7280]/10 rounded-xl border border-[#6B7280]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Closed')}>
                <p className="text-xs text-[#6B7280]">Closed</p>
                <p className="text-xl font-bold text-[#6B7280]">{data.closedCases}</p>
              </div>
              <div className="p-3 bg-[#3282B8]/10 rounded-xl border border-[#3282B8]/30 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Clients')}>
                <p className="text-xs text-[#6B7280]">Clients</p>
                <p className="text-xl font-bold text-[#0F4C75]">{data.totalClients}</p>
              </div>
              <div className="p-3 bg-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Events')}>
                <p className="text-xs text-[#6B7280]">Events</p>
                <p className="text-xl font-bold text-[#8B5CF6]">{data.totalEvents}</p>
              </div>
            </div>

            {/* Priority & Case Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
                <h3 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartPie className="text-[#0F4C75]" /> Priority Distribution
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Urgent', count: data.urgentCases, color: 'bg-[#EF4444]' },
                    { label: 'High', count: data.highPriority, color: 'bg-[#F59E0B]' },
                    { label: 'Medium', count: data.mediumPriority, color: 'bg-[#3282B8]' },
                    { label: 'Low', count: data.lowPriority, color: 'bg-[#22C55E]' },
                  ].map(p => {
                    const percentage = data.totalCases > 0 ? (p.count / data.totalCases) * 100 : 0;
                    return (
                      <div key={p.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#6B7280]">{p.label}</span>
                          <span className="text-[#1B262C] font-medium">{p.count}</span>
                        </div>
                        <div className="w-full bg-[#BBE1FA]/50 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 rounded-full ${p.color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
                <h3 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                  <FaChartBar className="text-[#0F4C75]" /> Case Types
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(data.caseTypes).map(([type, count]) => {
                    const percentage = data.totalCases > 0 ? (count / data.totalCases) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#6B7280]">{type}</span>
                          <span className="text-[#1B262C] font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-[#BBE1FA]/50 rounded-full h-2 overflow-hidden">
                          <div className="h-2 rounded-full gradient-accent transition-all duration-500" style={{ width: `${percentage}%` }}></div>
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
            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h3 className="text-sm font-semibold text-[#1B262C] mb-3 flex items-center gap-2">
                <FaChartLine className="text-[#0F4C75]" /> Recent Activity
              </h3>
              <div className="space-y-2">
                {events?.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#BBE1FA] hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport(event.title)}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#0F4C75]"></div>
                      <div>
                        <p className="text-sm text-[#1B262C]">{event.title}</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1B262C]">Case Report</h3>
                <p className="text-sm text-[#6B7280]">Detailed case statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaFilePdf className="text-sm" /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all font-medium">
                  <FaFileExcel className="text-sm" /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all font-medium">
                  <FaFileDownload className="text-sm" /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all font-medium">
                  <FaPrint className="text-sm" /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaShareAlt className="text-sm" /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Cases')}>
                <p className="text-sm text-[#6B7280]">Total Cases</p>
                <p className="text-3xl font-bold text-[#1B262C]">{data.totalCases}</p>
              </div>
              <div className="p-4 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Active')}>
                <p className="text-sm text-[#6B7280]">Active</p>
                <p className="text-3xl font-bold text-[#22C55E]">{data.activeCases}</p>
              </div>
              <div className="p-4 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Pending')}>
                <p className="text-sm text-[#6B7280]">Pending</p>
                <p className="text-3xl font-bold text-[#F59E0B]">{data.pendingCases}</p>
              </div>
              <div className="p-4 bg-[#6B7280]/10 rounded-xl border border-[#6B7280]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Closed')}>
                <p className="text-sm text-[#6B7280]">Closed</p>
                <p className="text-3xl font-bold text-[#6B7280]">{data.closedCases}</p>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Case Status Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Active Cases')}>
                  <p className="text-2xl font-bold text-[#22C55E]">{data.activeCases}</p>
                  <p className="text-xs text-[#6B7280]">Active</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Pending Cases')}>
                  <p className="text-2xl font-bold text-[#F59E0B]">{data.pendingCases}</p>
                  <p className="text-xs text-[#6B7280]">Pending</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Closed Cases')}>
                  <p className="text-2xl font-bold text-[#6B7280]">{data.closedCases}</p>
                  <p className="text-xs text-[#6B7280]">Closed</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Priority Breakdown</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/20 cursor-pointer" onClick={() => handleViewReport('Urgent')}>
                  <p className="text-2xl font-bold text-[#EF4444]">{data.urgentCases}</p>
                  <p className="text-xs text-[#6B7280]">Urgent</p>
                </div>
                <div className="text-center p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20 cursor-pointer" onClick={() => handleViewReport('High')}>
                  <p className="text-2xl font-bold text-[#F59E0B]">{data.highPriority}</p>
                  <p className="text-xs text-[#6B7280]">High</p>
                </div>
                <div className="text-center p-3 bg-[#3282B8]/10 rounded-lg border border-[#3282B8]/20 cursor-pointer" onClick={() => handleViewReport('Medium')}>
                  <p className="text-2xl font-bold text-[#3282B8]">{data.mediumPriority}</p>
                  <p className="text-xs text-[#6B7280]">Medium</p>
                </div>
                <div className="text-center p-3 bg-[#22C55E]/10 rounded-lg border border-[#22C55E]/20 cursor-pointer" onClick={() => handleViewReport('Low')}>
                  <p className="text-2xl font-bold text-[#22C55E]">{data.lowPriority}</p>
                  <p className="text-xs text-[#6B7280]">Low</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Case Types</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.caseTypes).map(([type, count]) => (
                  <div key={type} className="px-4 py-2 bg-white rounded-lg border border-[#BBE1FA] flex items-center gap-2 cursor-pointer hover:border-[#3282B8] transition-all" onClick={() => handleViewReport(type)}>
                    <span className="text-sm text-[#1B262C]">{type}</span>
                    <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded-full text-xs font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(data.caseTypes).length === 0 && (
                  <p className="text-[#6B7280] text-sm py-2">No case types found</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Date Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280]">Earliest Case</p>
                  <p className="text-sm font-medium text-[#1B262C]">{data.earliestCase ? data.earliestCase.toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280]">Latest Case</p>
                  <p className="text-sm font-medium text-[#1B262C]">{data.latestCase ? data.latestCase.toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1B262C]">Client Report</h3>
                <p className="text-sm text-[#6B7280]">Client statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaFilePdf className="text-sm" /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all font-medium">
                  <FaFileExcel className="text-sm" /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all font-medium">
                  <FaFileDownload className="text-sm" /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all font-medium">
                  <FaPrint className="text-sm" /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaShareAlt className="text-sm" /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Clients')}>
                <p className="text-sm text-[#6B7280]">Total Clients</p>
                <p className="text-3xl font-bold text-[#1B262C]">{data.totalClients}</p>
              </div>
              <div className="p-4 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Active Clients')}>
                <p className="text-sm text-[#6B7280]">Active</p>
                <p className="text-3xl font-bold text-[#22C55E]">{data.activeClients}</p>
              </div>
              <div className="p-4 bg-[#6B7280]/10 rounded-xl border border-[#6B7280]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Inactive Clients')}>
                <p className="text-sm text-[#6B7280]">Inactive</p>
                <p className="text-3xl font-bold text-[#6B7280]">{data.inactiveClients}</p>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Client Status Breakdown</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Active Clients')}>
                  <p className="text-2xl font-bold text-[#22C55E]">{data.activeClients}</p>
                  <p className="text-xs text-[#6B7280]">Active</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Pending Clients')}>
                  <p className="text-2xl font-bold text-[#F59E0B]">{data.pendingClients}</p>
                  <p className="text-xs text-[#6B7280]">Pending</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#BBE1FA] cursor-pointer" onClick={() => handleViewReport('Inactive Clients')}>
                  <p className="text-2xl font-bold text-[#6B7280]">{data.inactiveClients}</p>
                  <p className="text-xs text-[#6B7280]">Inactive</p>
                </div>
              </div>
            </div>

            {clients && clients.length > 0 && (
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Recent Clients</h4>
                <div className="space-y-2">
                  {clients.slice(0, 5).map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#BBE1FA] hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport(client.name)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3282B8]/10 flex items-center justify-center">
                          <FaUser className="text-[#0F4C75] text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-[#1B262C]">{client.name}</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1B262C]">Calendar Report</h3>
                <p className="text-sm text-[#6B7280]">Event statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaFilePdf className="text-sm" /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all font-medium">
                  <FaFileExcel className="text-sm" /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all font-medium">
                  <FaFileDownload className="text-sm" /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all font-medium">
                  <FaPrint className="text-sm" /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaShareAlt className="text-sm" /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Events')}>
                <p className="text-sm text-[#6B7280]">Total Events</p>
                <p className="text-3xl font-bold text-[#1B262C]">{data.totalEvents}</p>
              </div>
              <div className="p-4 bg-[#0F4C75]/10 rounded-xl border border-[#0F4C75]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Upcoming Events')}>
                <p className="text-sm text-[#6B7280]">Upcoming</p>
                <p className="text-3xl font-bold text-[#0F4C75]">{data.upcomingEvents}</p>
              </div>
              <div className="p-4 bg-[#6B7280]/10 rounded-xl border border-[#6B7280]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Past Events')}>
                <p className="text-sm text-[#6B7280]">Past</p>
                <p className="text-3xl font-bold text-[#6B7280]">{data.pastEvents}</p>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Event Types</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.eventTypes).map(([type, count]) => (
                  <div key={type} className="px-4 py-2 bg-white rounded-lg border border-[#BBE1FA] flex items-center gap-2 cursor-pointer hover:border-[#3282B8] transition-all" onClick={() => handleViewReport(type)}>
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
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
                <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Upcoming Events</h4>
                <div className="space-y-2">
                  {events.filter(e => new Date(e.date) > new Date()).slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#BBE1FA] hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport(event.title)}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                        <div>
                          <p className="text-sm text-[#1B262C]">{event.title}</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1B262C]">Financial Report</h3>
                <p className="text-sm text-[#6B7280]">Financial statistics from database</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaFilePdf className="text-sm" /> PDF
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all font-medium">
                  <FaFileExcel className="text-sm" /> Excel
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-lg hover:bg-[#F59E0B]/20 transition-all font-medium">
                  <FaFileDownload className="text-sm" /> Export
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all font-medium">
                  <FaPrint className="text-sm" /> Print
                </button>
                <button onClick={handleShareReport} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
                  <FaShareAlt className="text-sm" /> Share
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Amount')}>
                <p className="text-sm text-[#6B7280]">Total Amount</p>
                <p className="text-2xl font-bold text-[#22C55E]">${data.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-[#3282B8]/10 rounded-xl border border-[#3282B8]/30 text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Average Amount')}>
                <p className="text-sm text-[#6B7280]">Average Amount</p>
                <p className="text-2xl font-bold text-[#0F4C75]">${data.avgAmount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] text-center hover:border-[#3282B8] transition-all cursor-pointer" onClick={() => handleViewReport('Total Cases')}>
                <p className="text-sm text-[#6B7280]">Total Cases</p>
                <p className="text-2xl font-bold text-[#1B262C]">{data.totalCases}</p>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Financial Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280]">Total Cases with Amount</p>
                  <p className="text-lg font-bold text-[#1B262C]">
                    {cases?.filter(c => parseFloat(c.amount?.replace(/[$,]/g, '') || 0) > 0).length || 0}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280]">Cases Without Amount</p>
                  <p className="text-lg font-bold text-[#6B7280]">
                    {cases?.filter(c => !c.amount || parseFloat(c.amount.replace(/[$,]/g, '')) === 0).length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
              <h4 className="text-sm font-semibold text-[#1B262C] mb-3">Amount Distribution by Priority</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Urgent', count: data.urgentCases, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
                  { label: 'High', count: data.highPriority, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                  { label: 'Medium', count: data.mediumPriority, color: 'text-[#3282B8]', bg: 'bg-[#3282B8]/10' },
                  { label: 'Low', count: data.lowPriority, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                ].map(p => (
                  <div key={p.label} className={`p-3 ${p.bg} rounded-lg border border-[#BBE1FA] text-center`}>
                    <p className={`text-lg font-bold ${p.color}`}>{p.count}</p>
                    <p className="text-xs text-[#6B7280]">{p.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center py-8 text-[#6B7280]">Select a report type</div>;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="bg-white rounded-xl border border-[#BBE1FA] shadow-sm p-6 hover:shadow-premium transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1B262C]">Reports & Analytics</h2>
          <p className="text-sm text-[#6B7280] mt-1">Real-time reports from database data</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-lg hover:bg-[#BBE1FA]/50 transition-all font-medium">
            <FaClock className="text-sm" /> Refresh
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
            <FaFilePdf className="text-sm" /> PDF
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/20 transition-all font-medium">
            <FaFileExcel className="text-sm" /> Excel
          </button>
          <button onClick={handlePrintReport} className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-lg hover:bg-[#8B5CF6]/20 transition-all font-medium">
            <FaPrint className="text-sm" /> Print
          </button>
          <button onClick={handleShareReport} className="flex items-center gap-2 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all font-medium">
            <FaShareAlt className="text-sm" /> Share
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex-1 min-w-[100px] justify-center ${
              reportType === type.id
                ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'
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
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0F4C75] border-t-transparent"></div>
              <span className="text-[#1B262C] font-medium">Generating report...</span>
            </div>
          </div>
        )}
        {renderReportContent()}
      </div>

      {/* Modals */}
      <ExportModal />
      <ShareModal />
    </div>
  );
};

export default ReportsDashboard;