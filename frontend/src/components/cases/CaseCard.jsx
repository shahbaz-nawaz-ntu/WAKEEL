import React, { useState } from 'react';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaDollarSign,
  FaUserFriends,
  FaFileAlt,
  FaGavel,
  FaExclamationTriangle,
  FaChevronDown,
  FaEllipsisV,
  FaTag,
  FaClock,
  FaFolderOpen
} from 'react-icons/fa';
import CaseDetailModal from '../modals/CaseDetailModal';

const CaseCard = ({ case: caseItem, onView, onEdit, onStatusChange, onDelete, isNew = false }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!caseItem) return null;

  const getStatusConfig = (status) => {
    const configs = {
      active: { label: 'Active', color: '#22C55E', bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', border: 'border-[#22C55E]/20' },
      pending: { label: 'Pending', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' },
      closed: { label: 'Closed', color: '#6B7280', bg: 'bg-[#6B7280]/10', text: 'text-[#6B7280]', border: 'border-[#6B7280]/20' },
    };
    return configs[status] || configs.pending;
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTotalDocuments = () => {
    const docs = caseItem.documents || {};
    return (docs.petitioner?.length || 0) + (docs.research?.length || 0) + (docs.defendant?.length || 0);
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    if (onDelete) onDelete(caseItem.id);
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) onStatusChange(caseItem.id, newStatus);
  };

  const statusConfig = getStatusConfig(caseItem.status);

  return (
    <>
      <div 
        className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${
          isHovered 
            ? 'border-[#3282B8] shadow-2xl shadow-[#0F4C75]/15 -translate-y-1' 
            : 'border-[#BBE1FA]/40 shadow-sm hover:shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>

        <div className="p-5">
          {/* ===== HEADER ===== */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1B262C] text-base truncate">
                  {caseItem.title || caseItem.caseTitle || 'Untitled Case'}
                </h3>
                {isNew && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white text-[8px] font-bold rounded-full uppercase tracking-wider flex-shrink-0 animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] text-[#9CA3AF] font-mono bg-[#F0F4F8] px-2 py-0.5 rounded-full">
                  #{caseItem.caseNumber || caseItem.id?.slice(0, 8)}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] rounded-full text-[#6B7280] border border-[#BBE1FA]/40">
                  {caseItem.caseType || 'General'}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                  ● {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* ===== DESCRIPTION ===== */}
          <p className="text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
            {caseItem.description || 'No description provided.'}
          </p>

          {/* ===== STATS ROW - ICON BASED ===== */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className={`bg-[#F8FAFC] rounded-xl p-2.5 text-center border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30 shadow-sm' : 'border-[#BBE1FA]/20'}`}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <FaDollarSign className="text-[#3282B8] text-[10px]" />
              </div>
              <p className="text-xs font-semibold text-[#1B262C]">
                {caseItem.amount ? `$${caseItem.amount.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div className={`bg-[#F8FAFC] rounded-xl p-2.5 text-center border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30 shadow-sm' : 'border-[#BBE1FA]/20'}`}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <FaGavel className="text-[#3282B8] text-[10px]" />
              </div>
              <p className="text-xs font-semibold text-[#1B262C]">{caseItem.hearings || 0}</p>
            </div>
            <div className={`bg-[#F8FAFC] rounded-xl p-2.5 text-center border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30 shadow-sm' : 'border-[#BBE1FA]/20'}`}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <FaFileAlt className="text-[#3282B8] text-[10px]" />
              </div>
              <p className="text-xs font-semibold text-[#1B262C]">{getTotalDocuments()}</p>
            </div>
            <div className={`bg-[#F8FAFC] rounded-xl p-2.5 text-center border transition-all duration-200 ${isHovered ? 'border-[#3282B8]/30 shadow-sm' : 'border-[#BBE1FA]/20'}`}>
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <FaCalendarAlt className="text-[#3282B8] text-[10px]" />
              </div>
              <p className="text-[10px] font-medium text-[#1B262C] truncate">
                {caseItem.date ? formatDate(caseItem.date) : 'N/A'}
              </p>
            </div>
          </div>

          {/* ===== PARTIES ===== */}
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 mb-4 ${isHovered ? 'bg-[#3282B8]/5 border-[#3282B8]/20' : 'bg-[#F0F4F8] border-[#BBE1FA]/20'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-md shadow-[#0F4C75]/20">
              {getInitials(caseItem.party)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wider font-medium">Parties</p>
              <p className="text-xs text-[#1B262C] truncate font-medium">{caseItem.party || 'N/A'}</p>
            </div>
            <FaUserFriends className={`text-sm transition-all duration-200 ${isHovered ? 'text-[#3282B8]' : 'text-[#9CA3AF]'}`} />
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex items-center justify-between pt-3 border-t border-[#BBE1FA]/30">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowViewModal(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
                  isHovered 
                    ? 'bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/25 scale-105' 
                    : 'text-[#0F4C75] bg-[#3282B8]/10 hover:bg-[#3282B8]/20'
                }`}
              >
                <FaEye className="text-[10px]" /> View
              </button>
              <button
                onClick={() => onEdit && onEdit(caseItem)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 ${
                  isHovered 
                    ? 'bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/25 scale-105' 
                    : 'text-[#0F4C75] bg-[#3282B8]/10 hover:bg-[#3282B8]/20'
                }`}
              >
                <FaEdit className="text-[10px]" /> Edit
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={caseItem.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-[10px] px-3 py-1.5 bg-[#F0F4F8] border rounded-xl text-[#1B262C] focus:border-[#3282B8] focus:ring-2 focus:ring-[#3282B8]/20 outline-none transition-all cursor-pointer appearance-none pr-7 hover:border-[#3282B8]/50 ${
                    isHovered ? 'border-[#3282B8]/40' : 'border-[#BBE1FA]'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%239CA3AF'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <button
                onClick={handleDeleteClick}
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isHovered 
                    ? 'text-[#EF4444] hover:bg-[#EF4444]/10' 
                    : 'text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10'
                }`}
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-[#1B262C]/60 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#3282B8] shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <FaExclamationTriangle className="text-[#EF4444] text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B262C] mb-1">Delete Case?</h3>
                <p className="text-sm text-[#6B7280] mb-4">This action cannot be undone.</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-[#F0F4F8] text-[#1B262C] hover:bg-[#BBE1FA] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Modal */}
      {showViewModal && (
        <CaseDetailModal 
          isOpen={showViewModal}
          case={caseItem}
          onClose={() => setShowViewModal(false)}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
        />
      )}
    </>
  );
};

export default CaseCard;