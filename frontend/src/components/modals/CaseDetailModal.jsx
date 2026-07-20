// src/components/modals/CaseDetailModal.jsx
import React, { useState } from 'react';
import { 
  FaTimes, 
  FaUser, 
  FaGavel, 
  FaFileAlt,
  FaUserFriends,
  FaBuilding,
  FaClock,
  FaFilePdf,
  FaCalendarCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBookOpen,
  FaClipboardList,
  FaTag,
  FaFileInvoice,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
  FaEye,
  FaUniversity,
  FaLandmark,
  FaFolderOpen,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaGavel as FaGavelIcon,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import ProceedingPage from '../../pages/ProceedingPage';

// Helper function to display values
const displayValue = (value, fallback = 'N/A') => {
  if (value === undefined || value === null || value === '' || value === 'N/A') {
    return fallback;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) return fallback;
    const hasValue = Object.values(value).some(v => v && v !== '' && v !== 'N/A');
    if (!hasValue) return fallback;
    const nonEmptyValue = Object.values(value).find(v => v && v !== '' && v !== 'N/A');
    return nonEmptyValue || fallback;
  }
  return value;
};

const CaseDetailModal = ({ 
  isOpen, 
  case: caseItem, 
  onClose, 
  onStatusChange, 
  onEdit 
}) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showProceeding, setShowProceeding] = useState(false);

  if (!isOpen || !caseItem) return null;

  const caseId = caseItem._id || caseItem.id || caseItem.caseId;

  const statusConfig = {
    active: {
      badge: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
      dot: 'bg-[#22C55E]',
      icon: FaClock,
      label: 'Active',
    },
    pending: {
      badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      dot: 'bg-[#F59E0B]',
      icon: FaExclamationTriangle,
      label: 'Pending',
    },
    closed: {
      badge: 'bg-[#9CA3AF]/10 text-[#6B7280] border-[#9CA3AF]/20',
      dot: 'bg-[#9CA3AF]',
      icon: FaCheckCircle,
      label: 'Closed',
    },
  };

  const getCaseTypeLabel = (type) => {
    const types = {
      civil: 'Civil',
      criminal: 'Criminal',
      labour: 'Labour',
      service: 'Service',
      tax: 'Tax',
      family: 'Family',
      Civil: 'Civil',
      Labour: 'Labour',
      Service: 'Service',
      Tax: 'Tax',
      Criminal: 'Criminal',
      Family: 'Family',
    };
    return types[type] || type || 'N/A';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  const status = caseItem.status || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const documents = caseItem.documents || {};
  const petitionerDocs = documents.petitioner || [];
  const researchDocs = documents.research || [];
  const defendantDocs = documents.defendant || [];

  const hasInstituteData = caseItem.instituteDate || caseItem.instituteNo;
  const hasPartyData = caseItem.party || caseItem.petitioner || caseItem.defendant || caseItem.clientName;
  const hasContactData = caseItem.phone || caseItem.email || caseItem.address;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEditClick = () => {
    if (onClose) onClose();
    if (typeof onEdit === 'function') {
      onEdit(caseItem);
      return;
    }
    if (typeof window.__editCase === 'function') {
      window.__editCase(caseItem);
      return;
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange && caseId) {
      onStatusChange(caseId, newStatus);
      if (onClose) onClose();
    }
  };

  const DocumentSection = ({ title, docs, icon: Icon, color }) => {
    const isExpanded = expandedSection === title;
    const hasDocs = docs && docs.length > 0;

    return (
      <div className="border border-[#BBE1FA]/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between p-4 bg-[#F0F4F8] hover:bg-[#3282B8]/5 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${color}-50`}>
              <Icon className={`text-${color}-600`} />
            </div>
            <span className="font-medium text-[#1B262C]">{title}</span>
            {hasDocs && (
              <span className="text-xs bg-[#3282B8]/10 text-[#0F4C75] px-2.5 py-0.5 rounded-full font-medium">
                {docs.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!hasDocs && <span className="text-xs text-[#9CA3AF]">No documents</span>}
            {isExpanded ? <FaChevronDown className="text-[#9CA3AF]" /> : <FaChevronRight className="text-[#9CA3AF]" />}
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-4 bg-white border-t border-[#BBE1FA]/30">
            {hasDocs ? (
              <div className="space-y-2">
                {docs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all duration-200 group shadow-sm hover:shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <FaFilePdf className="text-red-500" />
                      </div>
                      <span className="text-sm text-[#1B262C] font-medium">{doc}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-1.5 text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-lg transition-colors" onClick={() => alert(`📄 Viewing: ${doc}`)}>
                        <FaEye className="text-sm" />
                      </button>
                      <button className="p-1.5 text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-lg transition-colors" onClick={() => alert(`⬇️ Downloading: ${doc}`)}>
                        <FaDownload className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#9CA3AF] text-sm">
                <FaFileAlt className="mx-auto text-4xl mb-3 text-[#BBE1FA]" />
                <p>No documents uploaded</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-screen h-screen bg-[#F8FAFC] overflow-hidden flex flex-col">
          
          {/* ===== HEADER ===== */}
          <div className="w-full px-6 py-4 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
            
            <div className="flex items-start justify-between w-full pt-1">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C75]/25">
                    <GiScales className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[#1B262C] tracking-tight truncate">
                    {displayValue(caseItem.caseTitle || caseItem.title, 'Untitled Case')}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#6B7280] font-mono bg-[#F0F4F8] px-3 py-1 rounded-full border border-[#BBE1FA]">
                      #{displayValue(caseId, 'N/A')}
                    </span>
                    {caseItem.caseNumber && (
                      <span className="text-xs px-3 py-1 bg-[#3282B8]/10 rounded-full text-[#0F4C75] border border-[#3282B8]/20 font-mono flex items-center gap-1">
                        <FaBookOpen className="text-[10px]" />
                        {caseItem.caseNumber}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.badge} flex items-center gap-1.5`}>
                      <StatusIcon className="text-xs" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 btn-primary"
                >
                  <FaEdit className="text-sm" />
                  <span>Edit Case</span>
                </button>
                
                <button
                  onClick={() => setShowProceeding(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20"
                >
                  <FaFolderOpen className="text-sm" />
                  <span>Proceeding</span>
                  <span className="text-xs bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full">
                    {petitionerDocs.length + researchDocs.length + defendantDocs.length}
                  </span>
                </button>
                
                <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200">
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* ===== CONTENT - SAME STRUCTURE AS ADD/EDIT ===== */}
          <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F8FAFC] p-6">
            <div className="space-y-5 max-w-full">
              
              {/* ===== CASE IDENTIFICATION ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaBookOpen className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Case No.</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseNumber)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaBuilding className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Court No.</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.courtNo)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaUniversity className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">CMS No.</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.cmsNo)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaFileInvoice className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Office No.</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.officeNo)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== BASIC INFORMATION ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaFileAlt className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Case Title</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseTitle || caseItem.title)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaUserFriends className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Party</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.party)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaTag className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Case Type</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{getCaseTypeLabel(caseItem.caseType)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== CASE NATURE ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaClipboardList className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Trial</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseNature?.trial)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaClipboardList className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Appeal</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseNature?.appeal)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== COURT DETAILS ===== */}
              <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
                  <div className="p-2 bg-[#3282B8]/10 rounded-lg">
                    <FaLandmark className="text-[#0F4C75]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Court Details</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 text-center w-full">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Court Name</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{displayValue(caseItem.courtDetails?.courtName)}</p>
                  </div>
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 text-center w-full">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">District</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{displayValue(caseItem.courtDetails?.district)}</p>
                  </div>
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 text-center w-full">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Previous Date</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{caseItem.courtDetails?.courtPreviousDate ? formatDate(caseItem.courtDetails.courtPreviousDate) : 'N/A'}</p>
                  </div>
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 text-center w-full relative">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Next Date</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{caseItem.courtDetails?.nextDate ? formatDate(caseItem.courtDetails.nextDate) : 'N/A'}</p>
                    {caseItem.courtDetails?.nextDate && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-[8px] rounded-full">Upcoming</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== STATUS & PRIORITY ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaClock className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Status</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{statusInfo.label}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0">
                      <FaExclamationTriangle className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Priority</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.priority, 'Medium')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== REMARKS ===== */}
              {caseItem.remarks && (
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <FaInfoCircle className="text-amber-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Remarks</h3>
                  </div>
                  <p className="text-sm text-[#1B262C] leading-relaxed">{caseItem.remarks}</p>
                </div>
              )}

              {/* ===== INSTITUTE ===== */}
              {hasInstituteData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                        <FaCalendarCheck className="text-[#0F4C75]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Institute Date</p>
                        <p className="text-base font-semibold text-[#1B262C] truncate">{caseItem.instituteDate ? formatDate(caseItem.instituteDate) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                        <FaFileInvoice className="text-[#0F4C75]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Institute No.</p>
                        <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.instituteNo)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== ASSOCIATE ===== */}
              <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
                  <div className="p-2 bg-[#3282B8]/10 rounded-lg">
                    <FaUserFriends className="text-[#0F4C75]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Associate</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 w-full">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Name</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{displayValue(caseItem.associate?.name)}</p>
                  </div>
                  <div className="bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 p-3 w-full">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">District</p>
                    <p className="text-sm font-semibold text-[#1B262C] mt-1">{displayValue(caseItem.associate?.district)}</p>
                  </div>
                </div>
              </div>

              {/* ===== ADDITIONAL INFORMATION ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaGavelIcon className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Amount</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.amount)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaUser className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Judge</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.judge)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                      <FaUserFriends className="text-[#0F4C75]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Assigned To</p>
                      <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.assignedTo)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== CONTACT DETAILS ===== */}
              {hasContactData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {caseItem.phone && (
                    <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                          <FaPhone className="text-[#0F4C75]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Phone</p>
                          <p className="text-base font-semibold text-[#1B262C] truncate">{caseItem.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {caseItem.email && (
                    <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                          <FaEnvelope className="text-[#0F4C75]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Email</p>
                          <p className="text-base font-semibold text-[#1B262C] truncate">{caseItem.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {caseItem.address && (
                    <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
                          <FaMapMarkerAlt className="text-[#0F4C75]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Address</p>
                          <p className="text-base font-semibold text-[#1B262C] truncate">{caseItem.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== DOCUMENTS ===== */}
              <div className="space-y-3 w-full">
                {petitionerDocs.length > 0 && (
                  <DocumentSection 
                    title="Petitioner Documents" 
                    docs={petitionerDocs} 
                    icon={FaFileAlt} 
                    color="blue"
                  />
                )}
                {researchDocs.length > 0 && (
                  <DocumentSection 
                    title="Research Documents" 
                    docs={researchDocs} 
                    icon={FaBookOpen} 
                    color="green"
                  />
                )}
                {defendantDocs.length > 0 && (
                  <DocumentSection 
                    title="Defendant Documents" 
                    docs={defendantDocs} 
                    icon={FaFileAlt} 
                    color="red"
                  />
                )}
                {petitionerDocs.length === 0 && researchDocs.length === 0 && defendantDocs.length === 0 && (
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-8 text-center shadow-sm w-full">
                    <FaFileAlt className="text-5xl text-[#BBE1FA] mx-auto mb-3" />
                    <p className="text-[#6B7280]">No documents available</p>
                  </div>
                )}
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#BBE1FA]/40 w-full">
                {caseItem.status !== 'closed' && onStatusChange && (
                  <button
                    onClick={() => handleStatusChange('closed')}
                    className="flex-1 min-w-[120px] px-5 py-2.5 btn-primary rounded-xl font-medium"
                  >
                    <FaGavelIcon className="inline mr-2" /> Close Case
                  </button>
                )}
                <button onClick={onClose} className="flex-1 min-w-[120px] px-5 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROCEEDING PAGE ===== */}
      <ProceedingPage 
        isOpen={showProceeding}
        onClose={() => setShowProceeding(false)}
        caseItem={caseItem}
      />
    </>
  );
};

export default CaseDetailModal;