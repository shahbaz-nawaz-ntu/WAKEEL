import React, { useState } from 'react';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaFileAlt,
  FaExclamationTriangle,
  FaFilePdf,
  FaFileWord,
  FaFile,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTimes,
  FaQuestionCircle,
  FaCalendarAlt,
  FaGavel,
  FaUserFriends,
  FaBuilding,
  FaBookOpen,
  FaLandmark,
  FaClock
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import CaseDetailModal from '../modals/CaseDetailModal';

// ===== PARTY EDIT MODAL =====
const PartyEditModal = ({ isOpen, caseItem, onClose, onSave }) => {
  const [partyData, setPartyData] = useState({
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
  });

  const partyTypes = [
    'Appellant(s)',
    'Plaintiff(s)',
    'Defendant(s)',
    'Petitioner(s)',
    'Respondent(s)',
    'Applicant(s)',
    'Complainant(s)',
    'Accused'
  ];

  React.useEffect(() => {
    if (caseItem && isOpen) {
      setPartyData({
        type: caseItem.partyType || caseItem.party || 'Appellant(s)',
        name: caseItem.partyName || caseItem.party || '',
        phone: caseItem.partyPhone || caseItem.phone || '',
        email: caseItem.partyEmail || caseItem.email || '',
        cnic: caseItem.partyCnic || caseItem.cnic || '',
        address: caseItem.partyAddress || caseItem.address || '',
      });
    }
  }, [caseItem, isOpen]);

  const handleChange = (field, value) => {
    setPartyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(partyData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1B262C]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#3282B8] shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#BBE1FA]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white">
                <FaUser className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B262C]">Case Party</h3>
                <p className="text-xs text-[#6B7280]">Edit party details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">Type</label>
                <select
                  value={partyData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  {partyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  value={partyData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter party name"
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                  <input
                    type="text"
                    value={partyData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-2.5 pl-10 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                  <input
                    type="email"
                    value={partyData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="party@example.com"
                    className="w-full px-4 py-2.5 pl-10 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">CNIC</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                  <input
                    type="text"
                    value={partyData.cnic}
                    onChange={(e) => handleChange('cnic', e.target.value)}
                    placeholder="XXXXX-XXXXXXX-X"
                    className="w-full px-4 py-2.5 pl-10 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-[#9CA3AF] text-sm" />
                  <textarea
                    value={partyData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Enter address"
                    rows="3"
                    className="w-full px-4 py-2.5 pl-10 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-all duration-200"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ===== MAIN CASE CARD - ONLY DATA FROM DETAIL MODAL =====
const CaseCard = ({ 
  case: caseItem, 
  onView, 
  onEdit, 
  onStatusChange, 
  onDelete, 
  isNew = false,
  onRefresh,
  onPartyUpdate
}) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!caseItem) return null;

  const getStatusConfig = (status) => {
    const configs = {
      active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      closed: { label: 'Closed', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getInitials = (name) => {
    if (!name || name === 'N/A' || name === 'NA') return null;
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return '—';
    }
  };

  // Get case title - matches detail modal
  const getCaseTitle = () => {
    if (caseItem.plaintiff && caseItem.defendant) {
      return `${caseItem.plaintiff} VS ${caseItem.defendant}`;
    }
    if (caseItem.caseTitle) {
      return caseItem.caseTitle;
    }
    if (caseItem.title) {
      return caseItem.title;
    }
    return 'Untitled Case';
  };

  // Get party display
  const getPartyDisplay = () => {
    // Try plaintiff first, then defendant, then party fields
    const name = caseItem.plaintiff || caseItem.defendant || caseItem.partyName || caseItem.party;
    if (!name || name === 'N/A' || name === 'NA') {
      return null;
    }
    return name;
  };

  const getPartyType = () => {
    if (caseItem.plaintiff && caseItem.defendant) {
      return `${caseItem.plaintiff} vs ${caseItem.defendant}`;
    }
    if (caseItem.partyType) {
      return caseItem.partyType;
    }
    return '';
  };

  const getPartyPhone = () => {
    return caseItem.partyPhone || caseItem.phone || '';
  };

  const getPartyEmail = () => {
    return caseItem.partyEmail || caseItem.email || '';
  };

  const hasPartyData = () => {
    return getPartyDisplay() !== null || getPartyPhone() || getPartyEmail();
  };

  // Get case number - matches detail modal
  const getCaseNumber = () => {
    return caseItem.caseNumber || caseItem._id || caseItem.id;
  };

  // Get next hearing date - matches detail modal
  const getNextHearing = () => {
    return caseItem.nextDateOfHearing || caseItem.nextDate || caseItem.courtDetails?.nextDate;
  };

  // Get court name - matches detail modal
  const getCourtName = () => {
    return caseItem.nameOfCourt || caseItem.courtDetails?.courtName || caseItem.courtName;
  };

  // Get nature of case - matches detail modal
  const getNatureOfCase = () => {
    return caseItem.natureOfCase || caseItem.caseNature?.trial;
  };

  // Get division - matches detail modal
  const getDivision = () => {
    return caseItem.division;
  };

  // Get district - matches detail modal
  const getDistrict = () => {
    return caseItem.district;
  };

  // Check if there are attachments - matches detail modal
  const hasAttachments = () => {
    return !!(caseItem.copyOfSummon || caseItem.copyOfPlaint || 
      caseItem.relevantDepartmentalRecord || caseItem.attachments?.copyOfSummon ||
      caseItem.attachments?.copyOfPlaint || caseItem.attachments?.relevantDepartmentalRecord ||
      (caseItem.attachments && caseItem.attachments.length > 0));
  };

  // Check if there are written statements - matches detail modal
  const hasWrittenStatements = () => {
    return caseItem.writtenStatements && caseItem.writtenStatements.length > 0;
  };

  const getDocumentIcon = () => {
    if (hasAttachments()) {
      return <FaFilePdf className="text-red-500 text-[10px]" />;
    }
    if (hasWrittenStatements()) {
      return <FaFileWord className="text-blue-500 text-[10px]" />;
    }
    return <FaFileAlt className="text-gray-300 text-[10px]" />;
  };

  const getDocumentStatusText = () => {
    const hasAttach = hasAttachments();
    const hasStatements = hasWrittenStatements();
    
    if (hasAttach && hasStatements) {
      return 'Has attachments & statements';
    }
    if (hasAttach) {
      return 'Has attachments';
    }
    if (hasStatements) {
      return `${caseItem.writtenStatements.length} statement(s)`;
    }
    return 'No documents';
  };

  const getDocumentStatusColor = () => {
    if (hasAttachments() || hasWrittenStatements()) return 'text-amber-600';
    return 'text-gray-400';
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    if (onDelete) onDelete(caseItem.id || caseItem._id);
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) onStatusChange(caseItem.id || caseItem._id, newStatus);
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  const handlePartySave = (partyData) => {
    if (onPartyUpdate) {
      onPartyUpdate(caseItem.id || caseItem._id, partyData);
    }
    setTimeout(() => handleRefresh(), 300);
  };

  const statusConfig = getStatusConfig(caseItem.status);

  // Check if case has any meaningful data
  const hasNoData = () => {
    return !getCaseTitle() && 
           !getCaseNumber() && 
           !getPartyDisplay() &&
           !getCourtName() &&
           !getNextHearing();
  };

  // If no data, show empty state
  if (hasNoData()) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <FaFileAlt className="text-gray-300 text-3xl mx-auto mb-2" />
        <p className="text-sm text-gray-500">No case data available</p>
        <p className="text-xs text-gray-400 mt-1">This case has no information</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 border h-full flex flex-col ${
          isHovered 
            ? 'border-[#3282B8] shadow-xl shadow-[#0F4C75]/15 -translate-y-1' 
            : 'border-gray-200 shadow-sm hover:shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8] flex-shrink-0"></div>

        <div className="p-4 flex-1 flex flex-col">
          {/* ===== HEADER ===== */}
          <div className="flex items-start justify-between mb-2 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1B262C] text-sm truncate">
                  {getCaseTitle()}
                </h3>
                {isNew && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-medium rounded-full border border-green-200 flex-shrink-0">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {getCaseNumber() && (
                  <span className="text-[8px] text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                    #{getCaseNumber()}
                  </span>
                )}
                {caseItem.caseType && (
                  <span className="text-[8px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-200 text-gray-600">
                    {caseItem.caseType}
                  </span>
                )}
                {getNatureOfCase() && (
                  <span className="text-[8px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-200 text-gray-600">
                    {getNatureOfCase()}
                  </span>
                )}
                {caseItem.status && (
                  <span className={`text-[8px] px-2 py-0.5 rounded-full border font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    ● {statusConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ===== DIVISION & DISTRICT ===== */}
          {(getDivision() || getDistrict()) && (
            <div className="grid grid-cols-2 gap-1.5 mb-2 flex-shrink-0">
              {getDivision() && (
                <div className={`bg-gray-50 rounded-lg p-1.5 border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30' : 'border-gray-200'}`}>
                  <p className="text-[6px] text-gray-400 tracking-wider font-medium">Division</p>
                  <p className="text-[8px] font-semibold text-[#1B262C] truncate">{getDivision()}</p>
                </div>
              )}
              {getDistrict() && (
                <div className={`bg-gray-50 rounded-lg p-1.5 border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30' : 'border-gray-200'}`}>
                  <p className="text-[6px] text-gray-400 tracking-wider font-medium">District</p>
                  <p className="text-[8px] font-semibold text-[#1B262C] truncate">{getDistrict()}</p>
                </div>
              )}
            </div>
          )}

          {/* ===== COURT & NEXT HEARING ===== */}
          {(getCourtName() || getNextHearing()) && (
            <div className="grid grid-cols-2 gap-1.5 mb-2 flex-shrink-0">
              {getCourtName() && (
                <div className={`bg-gray-50 rounded-lg p-1.5 border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30' : 'border-gray-200'}`}>
                  <p className="text-[6px] text-gray-400 tracking-wider font-medium">Court</p>
                  <p className="text-[8px] font-semibold text-[#1B262C] truncate">{getCourtName()}</p>
                </div>
              )}
              {getNextHearing() && (
                <div className={`bg-gray-50 rounded-lg p-1.5 border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30' : 'border-gray-200'}`}>
                  <p className="text-[6px] text-gray-400 tracking-wider font-medium">Next Hearing</p>
                  <p className="text-[8px] font-semibold text-[#1B262C] truncate">{formatDate(getNextHearing())}</p>
                </div>
              )}
            </div>
          )}

          {/* ===== PARTY SECTION ===== */}
          {hasPartyData() ? (
            <div className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 mb-2 flex-shrink-0 ${
              isHovered ? 'bg-[#3282B8]/5 border-[#3282B8]/30' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-md shadow-[#0F4C75]/20">
                {getInitials(getPartyDisplay()) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[6px] text-gray-400 tracking-wider font-medium">Party</p>
                <p className="text-[10px] text-[#1B262C] truncate font-medium">
                  {getPartyDisplay() || 'Unnamed Party'}
                </p>
                {getPartyType() && (
                  <p className="text-[7px] text-gray-500 truncate">
                    {getPartyType()}
                  </p>
                )}
              </div>
              {(getPartyPhone() || getPartyEmail()) && (
                <div className="text-right flex-shrink-0 hidden sm:block">
                  {getPartyPhone() && (
                    <p className="text-[7px] text-gray-500 flex items-center gap-0.5 justify-end">
                      <FaPhone className="text-[6px]" /> {getPartyPhone()}
                    </p>
                  )}
                  {getPartyEmail() && (
                    <p className="text-[7px] text-gray-500 flex items-center gap-0.5 justify-end">
                      <FaEnvelope className="text-[6px]" /> {getPartyEmail()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={`flex items-center gap-2 p-2 rounded-lg border border-dashed transition-all duration-200 mb-2 flex-shrink-0 ${
              isHovered ? 'border-[#3282B8]/30 bg-[#3282B8]/5' : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[9px] font-bold flex-shrink-0">
                <FaQuestionCircle className="text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[6px] text-gray-400 tracking-wider font-medium">Party</p>
                <p className="text-[10px] text-gray-500 truncate italic">
                  No party assigned
                </p>
              </div>
            </div>
          )}

          {/* ===== DOCUMENT STATUS BAR ===== */}
          <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all duration-200 mb-2 flex-shrink-0 ${
            isHovered ? 'bg-[#3282B8]/5 border-[#3282B8]/30' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-1.5">
              {getDocumentIcon()}
              <span className="text-[9px] font-medium text-[#1B262C]">Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-medium ${getDocumentStatusColor()}`}>
                {getDocumentStatusText()}
              </span>
              <div className="flex items-center gap-0.5">
                {(hasAttachments() || hasWrittenStatements()) ? (
                  <>
                    {hasAttachments() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" title="Has attachments"></span>
                    )}
                    {hasWrittenStatements() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Has written statements"></span>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto flex-shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-medium rounded-lg transition-all duration-200 ${
                  isHovered 
                    ? 'bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-md shadow-[#0F4C75]/20' 
                    : 'text-[#0F4C75] bg-[#3282B8]/10 hover:bg-[#3282B8]/20'
                }`}
              >
                <FaEye className="text-[8px]" /> View
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(caseItem);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-medium rounded-lg transition-all duration-200 ${
                  isHovered 
                    ? 'bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-md shadow-[#0F4C75]/20' 
                    : 'text-[#0F4C75] bg-[#3282B8]/10 hover:bg-[#3282B8]/20'
                }`}
              >
                <FaEdit className="text-[8px]" /> Edit
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {caseItem.status && (
                <select
                  value={caseItem.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-[8px] px-2 py-1 bg-gray-50 border rounded-lg text-[#1B262C] focus:border-[#3282B8] outline-none cursor-pointer appearance-none pr-5 ${
                    isHovered ? 'border-[#3282B8]/40' : 'border-gray-200'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='4'%3E%3Cpath d='M0 0l3 4 3-4z' fill='%239CA3AF'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 5px center',
                    backgroundSize: '6px 4px',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isHovered 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <FaTrash className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && (
        <CaseDetailModal 
          isOpen={showViewModal}
          case={caseItem}
          onClose={() => setShowViewModal(false)}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeleteComplete={() => setShowViewModal(false)}
          onRefresh={handleRefresh}
        />
      )}

      {/* Party Edit Modal */}
      <PartyEditModal
        isOpen={showPartyModal}
        caseItem={caseItem}
        onClose={() => setShowPartyModal(false)}
        onSave={handlePartySave}
      />

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-[#1B262C]/60 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#3282B8] shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B262C] mb-1">Delete Case?</h3>
                <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-gray-100 text-[#1B262C] hover:bg-gray-200 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CaseCard;