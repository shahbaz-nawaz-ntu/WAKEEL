// src/components/proceedings/ProceedingsList.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaTimes,
  FaUpload,
  FaTrash,
  FaEdit,
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaGavel,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import toast from 'react-hot-toast';

// ===== PROCEEDINGS ADD FORM - FIXED =====
const ProceedingsAddForm = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    createdBy: '',
    progress: '',
    nextHearingDate: '',
    status: '',
    attachment: null,
    attachmentName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomStatusInput, setShowCustomStatusInput] = useState(false);
  const [customStatus, setCustomStatus] = useState('');

  const statusOptions = [
    'Adjournment by the Court.',
    'Adjournment by the law officer',
    'Adjournment by the private counsel',
    'Arguments on maintainability of the case.',
    'Decision',
    'Dismissed for non-prosecution of law officer',
    'Dismissed for non-prosecution of private party.',
    'Dismissed in limine.',
    'Pending for arguments.',
    'Pending for case laws discussion',
    'Pending for decision on Misc. Application.',
    'Pending for evidence. (time limitation)',
    'Pending for final arguments',
    'Pending for framing of issues.',
    'Pending for written statement/reply. (time limitation)',
    'Preliminary stage/process of summons and notices etc.',
    'Right of evidence of department closed',
    'Withdraw by private party',
    'Others'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        attachment: file,
        attachmentName: file.name 
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.createdBy) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.progress) {
      toast.error('Please enter progress details');
      return;
    }
    if (!formData.nextHearingDate) {
      toast.error('Please select next hearing date');
      return;
    }
    if (!formData.status) {
      toast.error('Please select status');
      return;
    }

    setIsSubmitting(true);
    
    const newProceeding = {
      createdBy: formData.createdBy,
      progress: formData.progress,
      nextHearingDate: formData.nextHearingDate,
      status: formData.status,
      date: formData.date || new Date().toISOString().split('T')[0],
      attachment: formData.attachmentName || null,
    };
    
    console.log('📤 Submitting proceeding data:', newProceeding);
    
    if (onSave) {
      onSave(newProceeding);
    }
    
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setFormData({
      createdBy: '',
      progress: '',
      nextHearingDate: '',
      status: '',
      attachment: null,
      attachmentName: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowCustomStatusInput(false);
    setCustomStatus('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1B262C]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#3282B8] shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#BBE1FA]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white">
                <FaPlus className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B262C]">Add Proceeding</h3>
                <p className="text-xs text-[#6B7280]">Record new case proceeding</p>
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
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Created By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Progress on Date of Hearing <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.progress}
                  onChange={(e) => handleChange('progress', e.target.value)}
                  placeholder="Enter progress details..."
                  rows="3"
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Next Date of Hearing <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.nextHearingDate}
                  onChange={(e) => handleChange('nextHearingDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Status of the Case <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Others') {
                      setShowCustomStatusInput(true);
                      setFormData(prev => ({ ...prev, status: '' }));
                    } else {
                      setShowCustomStatusInput(false);
                      setFormData(prev => ({ ...prev, status: value }));
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                  required={!showCustomStatusInput}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {showCustomStatusInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      placeholder="Enter custom status..."
                      className="flex-1 px-4 py-2 border-2 border-[#3282B8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-[#F8FAFC] text-[#1B262C]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customStatus.trim()) {
                          setFormData(prev => ({ ...prev, status: customStatus.trim() }));
                          setShowCustomStatusInput(false);
                          setCustomStatus('');
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomStatusInput(false);
                        setCustomStatus('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B7280] tracking-wider mb-1.5">
                  Attachment
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`flex items-center justify-between px-4 py-2.5 border border-[#BBE1FA] rounded-lg bg-white transition-all duration-200 hover:border-[#3282B8] ${
                    formData.attachmentName ? 'border-[#3282B8] bg-[#F0F4F8]' : ''
                  }`}>
                    <div className="flex items-center gap-2">
                      <FaUpload className="text-[#3282B8] text-sm" />
                      <span className="text-sm text-[#6B7280]">
                        {formData.attachmentName || 'Choose File'}
                      </span>
                    </div>
                    {formData.attachmentName && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, attachment: null, attachmentName: '' }));
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" /> Saving...
                  </>
                ) : (
                  <>
                    <FaPlus className="text-sm" /> Add Proceeding
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ===== PROCEEDINGS LIST ITEM =====
const ProceedingItem = ({ proceeding, index, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = (status) => {
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
    if (status?.toLowerCase().includes('adjournment')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (status?.toLowerCase().includes('decision') || status?.toLowerCase().includes('dismissed')) {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (status?.toLowerCase().includes('pending')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (status?.toLowerCase().includes('withdraw')) {
      return 'bg-gray-50 text-gray-700 border-gray-200';
    }
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(proceeding.id || proceeding._id);
    }
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(proceeding);
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl border transition-all duration-200 ${
        isExpanded ? 'border-[#3282B8] shadow-md' : 'border-[#BBE1FA]/40 hover:border-[#3282B8]/50'
      }`}>
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-8 h-8 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[10px] font-bold text-[#0F4C75] flex-shrink-0">
            {index}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <FaUser className="text-[#9CA3AF] text-[10px]" />
              <span className="text-xs font-medium text-[#1B262C] truncate">
                {proceeding.createdBy || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <FaCalendarAlt className="text-[8px]" />
                {proceeding.nextHearingDate ? new Date(proceeding.nextHearingDate).toLocaleDateString('en-GB') : 'N/A'}
              </span>
              <span className="text-[10px] text-[#6B7280]">
                {proceeding.date ? new Date(proceeding.date).toLocaleDateString('en-GB') : 'N/A'}
              </span>
            </div>
          </div>

          <div className={`px-2 py-1 rounded-full text-[8px] font-medium border ${getStatusBadge(proceeding.status)} flex-shrink-0`}>
            {proceeding.status || 'Pending'}
          </div>

          <button className="p-1 text-[#9CA3AF] hover:text-[#0F4C75] transition-colors flex-shrink-0">
            {isExpanded ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-[#BBE1FA]/30">
            <div className="bg-[#F8FAFC] rounded-lg p-3 space-y-2">
              <div>
                <p className="text-[9px] text-[#6B7280] font-medium tracking-wider">Progress</p>
                <p className="text-sm text-[#1B262C]">{proceeding.progress || 'No progress recorded'}</p>
              </div>

              {proceeding.attachment && (
                <div>
                  <p className="text-[9px] text-[#6B7280] font-medium tracking-wider">Attachment</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FaFilePdf className="text-red-500 text-sm" />
                    <span className="text-xs text-[#0F4C75] hover:underline cursor-pointer">
                      {proceeding.attachment}
                    </span>
                    <FaDownload className="text-[#9CA3AF] text-[10px] cursor-pointer hover:text-[#0F4C75]" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button 
                  onClick={handleEdit}
                  className="text-[10px] text-[#0F4C75] hover:text-[#1B262C] flex items-center gap-1"
                >
                  <FaEdit className="text-[8px]" /> Edit
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <FaTrash className="text-[8px]" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-50 bg-[#1B262C]/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#3282B8] shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B262C] mb-1">Delete Proceeding?</h3>
                <p className="text-sm text-[#6B7280] mb-4">This action cannot be undone.</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
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

// ===== MAIN PROCEEDINGS LIST COMPONENT =====
const ProceedingsList = ({ 
  caseId, 
  proceedings = [], 
  onAddProceeding,
  onDeleteProceeding,
  onEditProceeding 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProceeding = (newProceeding) => {
    if (onAddProceeding) {
      // Add caseId to the proceeding data
      const proceedingData = {
        ...newProceeding,
        caseId: caseId
      };
      console.log('📤 ProceedingsList - Adding proceeding:', proceedingData);
      onAddProceeding(proceedingData);
    }
  };

  const filteredProceedings = proceedings.filter(p => 
    p.progress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* ===== HEADER WITH BUTTON ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white shadow-lg shadow-[#0F4C75]/25 flex-shrink-0">
            <GiScales className="text-lg" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#1B262C]">Proceedings</h4>
            <p className="text-[11px] text-[#6B7280]">
              {proceedings.length} proceeding{proceedings.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[10px]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-32 pl-8 pr-3 py-1.5 text-[11px] border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent bg-white text-[#1B262C] placeholder-[#9CA3AF]"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white text-[11px] font-medium rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 whitespace-nowrap"
          >
            <FaPlus className="text-[10px]" /> Add
          </button>
        </div>
      </div>

      {/* ===== PROCEEDINGS LIST ===== */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar min-h-[200px] max-h-[600px]">
        {filteredProceedings.length === 0 ? (
          <div className="bg-[#F8FAFC] rounded-xl border border-[#BBE1FA]/40 p-8 text-center">
            <FaClock className="text-[#9CA3AF] text-3xl mx-auto mb-2" />
            <p className="text-sm text-[#6B7280] font-medium">No proceedings recorded</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Click <span className="text-[#0F4C75] font-medium">"Add"</span> to record</p>
          </div>
        ) : (
          filteredProceedings.map((proceeding, index) => (
            <ProceedingItem 
              key={proceeding.id || proceeding._id || index}
              proceeding={proceeding}
              index={index + 1}
              onDelete={onDeleteProceeding}
              onEdit={onEditProceeding}
            />
          ))
        )}
      </div>

      {/* ===== ADD FORM MODAL ===== */}
      <ProceedingsAddForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleAddProceeding}
        caseId={caseId}
      />
    </div>
  );
};

export default ProceedingsList;