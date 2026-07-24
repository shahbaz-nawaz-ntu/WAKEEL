// src/components/modals/CaseDetailModal.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  FaMapMarkerAlt,
  FaUserCircle,
  FaIdCard,
  FaBriefcase,
  FaTrash,
  FaSync,
  FaArrowRight,
  FaSearch,
  FaCalendarAlt,
  FaCheck,
  FaQuestionCircle,
  FaComment,
  FaUsers,
  FaPlusCircle,
  FaSave,
  FaFile,
  FaHistory,
  FaBookmark,
  FaIdCard as FaIdCardIcon,
  FaSpinner
} from 'react-icons/fa';
import { GiScales, GiJusticeStar } from 'react-icons/gi';
import toast from 'react-hot-toast';

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

// ============================================
// ADD COMMENT MODAL INLINE
// ============================================
const AddCommentModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    commentedBy: '',
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestOptions = [
    'Attendance of departmental representative required in court.',
    'Attendance of departmental representative for cross-examination of witnesses.',
    'Attendance of Departmental representatives for oral evidence.',
    'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
    'Provision of record and assistance from Departmental Representative for arguments.',
    'Provision of record for documentary evidence. (time limitation)',
    'Provision of record for preparation of written statement/ reply. (time limitation)'
  ];

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Closed'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.commentedBy) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      commentedBy: formData.commentedBy,
      remarks: formData.remarks || '',
      requestToClientDepartment: formData.requestToClientDepartment || '',
      clientDepartments: formData.clientDepartments || '',
      attachments: formData.attachments || [],
      status: formData.status,
      date: formData.date
    };
    
    console.log('📤 Submitting comment data:', submitData);
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      console.error('❌ onSave is not a function in AddCommentModalInline');
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaComment className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Comment</h3>
                  <p className="text-white/70 text-sm">Add comment to this case</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Commented By *
              </label>
              <input
                type="text"
                value={formData.commentedBy}
                onChange={(e) => handleChange('commentedBy', e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Enter remarks..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Request to Client Department
              </label>
              <select
                value={formData.requestToClientDepartment}
                onChange={(e) => handleChange('requestToClientDepartment', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                <option value="">- Select -</option>
                {requestOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Client Departments
              </label>
              <input
                type="text"
                value={formData.clientDepartments}
                onChange={(e) => handleChange('clientDepartments', e.target.value)}
                placeholder="Enter client department"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Attach Files
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#3282B8] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                  <div className="flex items-center justify-center gap-2">
                    <FaFileAlt className="text-[#3282B8]" />
                    <span className="text-sm text-[#6B7280]">Choose Files</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const fileNames = files.map(f => f.name);
                      handleChange('attachments', [...formData.attachments, ...fileNames]);
                    }}
                  />
                </label>
                {formData.attachments.length > 0 && (
                  <span className="text-sm text-[#0F4C75] font-medium">
                    {formData.attachments.length} file(s) chosen
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">Each file must be less than 20MB</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Save Comment
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

// ============================================
// ADD PROCEEDING MODAL INLINE
// ============================================
const AddProceedingModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    createdBy: '',
    progress: '',
    nextHearingDate: '',
    status: '',
    attachment: null,
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomStatusInput, setShowCustomStatusInput] = useState(false);
  const [customStatus, setCustomStatus] = useState('');

  const defaultStatusOptions = [
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

  const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);

  const addCustomStatus = (newStatus) => {
    if (newStatus && !statusOptions.includes(newStatus)) {
      setStatusOptions(prev => [...prev, newStatus]);
      setFormData(prev => ({ ...prev, status: newStatus }));
      setCustomStatus('');
      setShowCustomStatusInput(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    
    const submitData = {
      caseId: caseId,
      createdBy: formData.createdBy,
      progress: formData.progress,
      nextHearingDate: formData.nextHearingDate,
      status: formData.status,
      date: formData.date,
      attachment: formData.attachment || null
    };
    
    console.log('📤 Submitting proceeding data from modal:', submitData);
    console.log('🔍 onSave type:', typeof onSave);
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      console.error('❌ onSave is not a function in AddProceedingModalInline!');
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaGavel className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Proceeding</h3>
                  <p className="text-white/70 text-sm">Add hearing progress to this case</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Created By *
              </label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Progress on Date of Hearing *
              </label>
              <textarea
                value={formData.progress}
                onChange={(e) => handleChange('progress', e.target.value)}
                placeholder="Enter progress details..."
                required
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Next Date of Hearing *
              </label>
              <input
                type="date"
                value={formData.nextHearingDate}
                onChange={(e) => handleChange('nextHearingDate', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Status of the Case *
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
                required={!showCustomStatusInput}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                <option value="">- Select Status -</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {showCustomStatusInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="Enter custom status..."
                    className="flex-1 px-4 py-2 border-2 border-[#3282B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-[#F8FAFC] text-[#1B262C]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customStatus.trim()) {
                        addCustomStatus(customStatus.trim());
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomStatusInput(false);
                      setCustomStatus('');
                      setFormData(prev => ({ ...prev, status: '' }));
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Attachment
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#3282B8] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                  <div className="flex items-center justify-center gap-2">
                    <FaFileAlt className="text-[#3282B8]" />
                    <span className="text-sm text-[#6B7280]">Choose File</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleChange('attachment', e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {formData.attachment ? (
                  <span className="text-sm text-[#0F4C75] font-medium flex items-center gap-2">
                    <FaFile className="text-xs" />
                    {formData.attachment}
                  </span>
                ) : (
                  <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="text-xs" />
                    Add Proceeding
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

// ============================================
// ADD PARTY MODAL INLINE
// ============================================
const AddPartyModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
    createdBy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partyTypes = [
    'Appellant(s)',
    'Defendant(s)',
    'Petitioner(s)',
    'Plaintiff(s)',
    'Respondent(s)',
    'Applicant(s)',
    'Complainant(s)',
    'Accused'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error('Please select party type');
      return;
    }
    if (!formData.name) {
      toast.error('Please enter party name');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      type: formData.type,
      name: formData.name,
      phone: formData.phone || '-',
      email: formData.email || '-',
      cnic: formData.cnic || '-',
      address: formData.address || '-',
      createdBy: formData.createdBy || 'Current User',
    };
    
    console.log('📤 Submitting party data from modal:', submitData);
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      console.error('❌ onSave is not a function in AddPartyModalInline');
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Party</h3>
                  <p className="text-white/70 text-sm">Add a party to this case</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                <option value="">- Select Type -</option>
                {partyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter party name"
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                CNIC
              </label>
              <div className="relative">
                <FaIdCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => handleChange('cnic', e.target.value)}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="party@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Address
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-[#9CA3AF]" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter address"
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Created By
              </label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Save Party
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

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B262C]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200 border border-red-500/20">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            <FaExclamationTriangle className="text-3xl text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#1B262C] text-center mb-2">
          {title || 'Delete?'}
        </h3>
        <p className="text-[#6B7280] text-center text-sm mb-6">
          {message || 'This action cannot be undone. Are you sure you want to delete this?'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaTrash className="text-sm" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FIXED: MAIN CASE DETAIL MODAL
// ============================================
const CaseDetailModal = ({ 
  isOpen, 
  case: caseItem, 
  onClose, 
  onStatusChange, 
  onEdit,
  onDelete,
  onDeleteComplete,
  onRefresh,
  // ===== PROCEEDINGS =====
  proceedings = [],
  onAddProceeding,
  onUpdateProceeding,
  onDeleteProceeding,
  // ===== COMMENTS =====
  comments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  // ===== PARTIES =====
  parties = [],
  onAddParty,
  onUpdateParty,
  onDeleteParty,
}) => {
  // 🔴🔴🔴🔴🔴 DEBUG - MODAL PROPS RECEIVED 🔴🔴🔴🔴🔴
  console.log('🔴🔴🔴🔴🔴 MODAL PROPS RECEIVED 🔴🔴🔴🔴🔴');
  console.log('🔴 MODAL - proceedings:', proceedings);
  console.log('🔴 MODAL - proceedings length:', proceedings.length);
  console.log('🔴 MODAL - comments:', comments);
  console.log('🔴 MODAL - comments length:', comments.length);
  console.log('🔴 MODAL - parties:', parties);
  console.log('🔴 MODAL - parties length:', parties.length);
  console.log('🔴 MODAL - caseItem:', caseItem);
  console.log('🔴 MODAL - caseItem ID:', caseItem?._id || caseItem?.id);
  console.log('🔴🔴🔴🔴🔴 END MODAL DEBUG 🔴🔴🔴🔴🔴');

  const [showClosePopup, setShowClosePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Proceeding states
  const [showProceedingForm, setShowProceedingForm] = useState(false);
  const [showEditProceedingForm, setShowEditProceedingForm] = useState(false);
  const [editingProceeding, setEditingProceeding] = useState(null);
  const [editProceedingFormData, setEditProceedingFormData] = useState({
    createdBy: '',
    progress: '',
    nextHearingDate: '',
    status: '',
    attachment: null,
    date: ''
  });
  const [showEditCustomStatusInput, setShowEditCustomStatusInput] = useState(false);
  const [editCustomStatus, setEditCustomStatus] = useState('');
  const [editStatusOptions, setEditStatusOptions] = useState([
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
  ]);

  // Comment states
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showEditCommentForm, setShowEditCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentFormData, setEditCommentFormData] = useState({
    commentedBy: '',
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Pending',
    date: ''
  });

  // Party states
  const [showAddPartyForm, setShowAddPartyForm] = useState(false);
  const [showEditPartyForm, setShowEditPartyForm] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [editPartyFormData, setEditPartyFormData] = useState({
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
    createdBy: '',
  });

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetType, setDeleteTargetType] = useState('');

  // Proceeding detail view
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [showProceedingDetail, setShowProceedingDetail] = useState(false);

  // Get case ID
  const caseId = caseItem?._id || caseItem?.id || caseItem?.caseId;
  console.log('🔍 CaseItem:', caseItem);
  console.log('🔍 CaseId extracted:', caseId);
  console.log('🔍 CaseId type:', typeof caseId);
  
  // ============================================
  // FIX: Party types for edit modal
  // ============================================
  const partyTypes = [
    'Appellant(s)',
    'Defendant(s)',
    'Petitioner(s)',
    'Plaintiff(s)',
    'Respondent(s)',
    'Applicant(s)',
    'Complainant(s)',
    'Accused'
  ];

  // ============================================
  // FIX: Get function from props or global fallback
  // ============================================
  const getAddProceedingFn = useCallback(() => {
    if (typeof onAddProceeding === 'function') {
      return onAddProceeding;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddProceeding === 'function') {
      console.log('⚠️ Using fallback window.__handleAddProceeding');
      return window.__handleAddProceeding;
    }
    console.error('❌ No addProceeding function available!');
    return null;
  }, [onAddProceeding]);

  const getAddCommentFn = useCallback(() => {
    if (typeof onAddComment === 'function') {
      return onAddComment;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddComment === 'function') {
      console.log('⚠️ Using fallback window.__handleAddComment');
      return window.__handleAddComment;
    }
    console.error('❌ No addComment function available!');
    return null;
  }, [onAddComment]);

  const getAddPartyFn = useCallback(() => {
    if (typeof onAddParty === 'function') {
      return onAddParty;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddParty === 'function') {
      console.log('⚠️ Using fallback window.__handleAddParty');
      return window.__handleAddParty;
    }
    console.error('❌ No addParty function available!');
    return null;
  }, [onAddParty]);

  // ============================================
  // FIXED: REFRESH DATA FUNCTION - Force re-fetch
  // ============================================
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    console.log('🔄 Refreshing data for case:', caseId);
    console.log('🔄 Current proceedings count:', proceedings.length);
    
    try {
      let refreshed = false;
      
      // Try 1: onRefresh prop
      if (typeof onRefresh === 'function') {
        console.log('📞 Calling onRefresh prop...');
        await onRefresh();
        refreshed = true;
        console.log('✅ Data refreshed via onRefresh');
      }
      
      // Try 2: window.__handleRefresh
      if (!refreshed && typeof window !== 'undefined' && typeof window.__handleRefresh === 'function') {
        console.log('📞 Calling window.__handleRefresh...');
        await window.__handleRefresh();
        refreshed = true;
        console.log('✅ Data refreshed via window.__handleRefresh');
      }
      
      // Try 3: window.__handleRefreshSelectedCase
      if (!refreshed && typeof window !== 'undefined' && typeof window.__handleRefreshSelectedCase === 'function') {
        console.log('📞 Calling window.__handleRefreshSelectedCase...');
        await window.__handleRefreshSelectedCase();
        refreshed = true;
        console.log('✅ Data refreshed via window.__handleRefreshSelectedCase');
      }
      
      // Try 4: window.__handleFetchProceedings
      if (!refreshed && typeof window !== 'undefined' && typeof window.__handleFetchProceedings === 'function') {
        console.log('📞 Calling window.__handleFetchProceedings...');
        await window.__handleFetchProceedings();
        refreshed = true;
        console.log('✅ Proceedings fetched via window.__handleFetchProceedings');
      }
      
      if (!refreshed) {
        console.warn('⚠️ No refresh function available!');
      }
      
      // ✅ FORCE RE-RENDER
      setRefreshTrigger(prev => prev + 1);
      
      setIsRefreshing(false);
      
      // ✅ Return true if refresh worked
      return refreshed;
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      setIsRefreshing(false);
      return false;
    }
  }, [onRefresh, caseId, proceedings.length]);

  // ============================================
  // FIXED: FILTER DATA - Proper caseId matching
  // ============================================
  // 🔥 FIX: The data has caseId as a direct string, not nested
  // Proceedings have: { caseId: '6a5fa2bfb037e8cf61202242', ... }
  const getCaseIdString = (item) => {
    if (!item) return null;
    // Direct caseId field (most common)
    const id = item.caseId || item.case_id || item.case?._id || item.case?.id;
    return id?.toString ? id.toString() : id;
  };

  const caseProceedings = useMemo(() => {
    console.log('🔍 Filtering proceedings for caseId:', caseId);
    console.log('🔍 Total proceedings:', proceedings.length);
    
    const caseIdStr = caseId?.toString ? caseId.toString() : caseId;
    
    const filtered = proceedings.filter(p => {
      const pCaseId = getCaseIdString(p);
      const match = pCaseId === caseIdStr;
      
      if (match) {
        console.log('✅ Found matching proceeding:', p._id || p.id);
      }
      return match;
    });
    
    console.log('📊 Filtered proceedings count:', filtered.length);
    return filtered;
  }, [proceedings, caseId, refreshTrigger]);

  const caseComments = useMemo(() => {
    const caseIdStr = caseId?.toString ? caseId.toString() : caseId;
    const filtered = comments.filter(c => {
      const cCaseId = getCaseIdString(c);
      return cCaseId === caseIdStr;
    });
    console.log('📊 Filtered comments count:', filtered.length);
    return filtered;
  }, [comments, caseId, refreshTrigger]);

  const caseParties = useMemo(() => {
    const caseIdStr = caseId?.toString ? caseId.toString() : caseId;
    const filtered = parties.filter(p => {
      const pCaseId = getCaseIdString(p);
      return pCaseId === caseIdStr;
    });
    console.log('📊 Filtered parties count:', filtered.length);
    return filtered;
  }, [parties, caseId, refreshTrigger]);

  // ============================================
  // DEBUG: Log when props change
  // ============================================
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 CaseDetailModal - isOpen:', isOpen);
      console.log('🔍 CaseDetailModal - caseId:', caseId);
      console.log('🔍 CaseDetailModal - proceedings count:', proceedings.length);
      console.log('🔍 CaseDetailModal - filtered proceedings:', caseProceedings.length);
      console.log('🔍 CaseDetailModal - comments count:', comments.length);
      console.log('🔍 CaseDetailModal - filtered comments:', caseComments.length);
      console.log('🔍 CaseDetailModal - parties count:', parties.length);
      console.log('🔍 CaseDetailModal - filtered parties:', caseParties.length);
    }
  }, [isOpen, caseId, proceedings, caseProceedings, comments, caseComments, parties, caseParties]);

  // ============================================
  // FIXED: PROCEEDING HANDLERS
  // ============================================
  const handleAddProceedingSubmit = async (data) => {
    console.log('📤 handleAddProceedingSubmit called with data:', data);
    
    setShowProceedingForm(false);
    
    const addFn = getAddProceedingFn();
    if (typeof addFn !== 'function') {
      console.error('❌ onAddProceeding is not available!');
      toast.error('Cannot add proceeding: function not available');
      return;
    }
    
    try {
      const proceedingData = {
        caseId: caseId,
        createdBy: data.createdBy || 'Unknown',
        progress: data.progress || 'N/A',
        nextHearingDate: data.nextHearingDate || '',
        status: data.status || 'Pending',
        date: data.date || new Date().toISOString().split('T')[0],
        attachment: data.attachment || null
      };
      
      console.log('📤 Calling addProceeding with:', proceedingData);
      
      const result = await addFn(proceedingData);
      console.log('✅ Proceeding added result:', result);
      
      // ✅ Wait for refresh to complete
      const refreshed = await refreshData();
      
      if (refreshed) {
        toast.success('Proceeding added successfully!');
      } else {
        // If refresh didn't work, force a UI update
        setRefreshTrigger(prev => prev + 1);
        toast.success('Proceeding added! Please refresh to see changes.');
      }
    } catch (error) {
      console.error('❌ Error adding proceeding:', error);
      toast.error(error.message || 'Failed to add proceeding');
    }
  };

  // ============================================
  // COMMENT HANDLERS
  // ============================================
  const handleAddCommentSubmit = async (data) => {
    console.log('📤 handleAddCommentSubmit called with data:', data);
    
    setShowCommentForm(false);
    
    const addFn = getAddCommentFn();
    if (typeof addFn !== 'function') {
      console.error('❌ onAddComment is not available!');
      toast.error('Cannot add comment: function not available');
      return;
    }
    
    try {
      const commentData = {
        caseId: caseId,
        commentedBy: data.commentedBy || 'Unknown',
        remarks: data.remarks || '',
        requestToClientDepartment: data.requestToClientDepartment || '',
        clientDepartments: data.clientDepartments || '',
        attachments: data.attachments || [],
        status: data.status || 'Pending',
        date: data.date || new Date().toISOString().split('T')[0]
      };
      
      console.log('📤 Calling addComment with:', commentData);
      
      const result = await addFn(commentData);
      console.log('✅ Comment added result:', result);
      
      await refreshData();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
    }
  };

  // ============================================
  // PARTY HANDLERS
  // ============================================
  const handleAddPartySubmit = async (data) => {
    console.log('📤 handleAddPartySubmit called with data:', data);
    
    setShowAddPartyForm(false);
    
    const addFn = getAddPartyFn();
    if (typeof addFn !== 'function') {
      console.error('❌ onAddParty is not available!');
      toast.error('Cannot add party: function not available');
      return;
    }
    
    try {
      const partyData = {
        caseId: caseId,
        type: data.type || 'Party',
        name: data.name || 'Unknown',
        phone: data.phone || '-',
        email: data.email || '-',
        cnic: data.cnic || '-',
        address: data.address || '-',
        createdBy: data.createdBy || 'Current User'
      };
      
      console.log('📤 Calling addParty with:', partyData);
      
      const result = await addFn(partyData);
      console.log('✅ Party added result:', result);
      
      await refreshData();
      toast.success('Party added successfully!');
    } catch (error) {
      console.error('❌ Error adding party:', error);
      toast.error(error.message || 'Failed to add party');
    }
  };

  // ============================================
  // FIXED: EDIT PROCEEDING HANDLER
  // ============================================
  const openEditProceedingForm = (proceeding) => {
    setEditingProceeding(proceeding);
    setEditProceedingFormData({
      createdBy: proceeding.createdBy || '',
      progress: proceeding.progress || '',
      nextHearingDate: proceeding.nextHearingDate ? new Date(proceeding.nextHearingDate).toISOString().split('T')[0] : '',
      status: proceeding.status || '',
      attachment: proceeding.attachment || null,
      date: proceeding.date ? new Date(proceeding.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowEditProceedingForm(true);
  };

  const handleEditProceedingFormChange = (field, value) => {
    setEditProceedingFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditProceedingSubmit = async (e) => {
    e.preventDefault();
    const id = editingProceeding?._id || editingProceeding?.id;
    if (id && typeof onUpdateProceeding === 'function') {
      try {
        await onUpdateProceeding(id, editProceedingFormData);
        setShowEditProceedingForm(false);
        setEditingProceeding(null);
        await refreshData();
        toast.success('Proceeding updated successfully!');
      } catch (error) {
        console.error('❌ Error updating proceeding:', error);
        toast.error('Failed to update proceeding');
      }
    }
  };

  const addEditCustomStatus = (newStatus) => {
    if (newStatus && !editStatusOptions.includes(newStatus)) {
      setEditStatusOptions(prev => [...prev, newStatus]);
      setEditProceedingFormData(prev => ({ ...prev, status: newStatus }));
      setEditCustomStatus('');
      setShowEditCustomStatusInput(false);
    }
  };

  const openProceedingDetail = (proceeding) => {
    setSelectedProceeding(proceeding);
    setShowProceedingDetail(true);
  };

  // ============================================
  // FIXED: EDIT COMMENT HANDLER
  // ============================================
  const openEditCommentForm = (comment) => {
    setEditingComment(comment);
    setEditCommentFormData({
      commentedBy: comment.commentedBy || '',
      remarks: comment.remarks || '',
      requestToClientDepartment: comment.requestToClientDepartment || '',
      clientDepartments: comment.clientDepartments || '',
      attachments: comment.attachments || [],
      status: comment.status || 'Pending',
      date: comment.date ? new Date(comment.date).toISOString().split('T')[0] : ''
    });
    setShowEditCommentForm(true);
  };

  const handleEditCommentFormChange = (field, value) => {
    setEditCommentFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditCommentSubmit = async (e) => {
    e.preventDefault();
    const id = editingComment?._id || editingComment?.id;
    if (id && typeof onUpdateComment === 'function') {
      try {
        await onUpdateComment(id, editCommentFormData);
        setShowEditCommentForm(false);
        setEditingComment(null);
        await refreshData();
        toast.success('Comment updated successfully!');
      } catch (error) {
        console.error('❌ Error updating comment:', error);
        toast.error('Failed to update comment');
      }
    }
  };

  // ============================================
  // FIXED: EDIT PARTY HANDLER
  // ============================================
  const openEditPartyForm = (party) => {
    setEditingParty(party);
    setEditPartyFormData({
      type: party.type || '',
      name: party.name || '',
      phone: party.phone || '',
      email: party.email || '',
      cnic: party.cnic || '',
      address: party.address || '',
      createdBy: party.createdBy || '',
    });
    setShowEditPartyForm(true);
  };

  const handleEditPartyFormChange = (field, value) => {
    setEditPartyFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditPartySubmit = async (e) => {
    e.preventDefault();
    const id = editingParty?._id || editingParty?.id;
    if (id && typeof onUpdateParty === 'function') {
      try {
        await onUpdateParty(id, editPartyFormData);
        setShowEditPartyForm(false);
        setEditingParty(null);
        await refreshData();
        toast.success('Party updated successfully!');
      } catch (error) {
        console.error('❌ Error updating party:', error);
        toast.error('Failed to update party');
      }
    }
  };

  // ============================================
  // DELETE HANDLERS
  // ============================================
  const openDeleteConfirm = (id, type) => {
    setDeleteTargetId(id);
    setDeleteTargetType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (deleteTargetType === 'proceeding' && typeof onDeleteProceeding === 'function') {
        await onDeleteProceeding(deleteTargetId);
      } else if (deleteTargetType === 'comment' && typeof onDeleteComment === 'function') {
        await onDeleteComment(deleteTargetId);
      } else if (deleteTargetType === 'party' && typeof onDeleteParty === 'function') {
        await onDeleteParty(deleteTargetId);
      }
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetType('');
      await refreshData();
      toast.success(`${deleteTargetType} deleted successfully!`);
    } catch (error) {
      console.error('❌ Error deleting:', error);
      toast.error(`Failed to delete ${deleteTargetType}`);
    }
  };

  if (!isOpen || !caseItem) return null;

  // ============================================
  // HANDLE CLOSE
  // ============================================
  const handleCloseClick = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowClosePopup(true);
  }, []);

  const confirmClose = useCallback(() => {
    setShowClosePopup(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const cancelClose = useCallback(() => {
    setShowClosePopup(false);
  }, []);

  // ============================================
  // STATUS CONFIG
  // ============================================
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

  const status = caseItem?.status || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = (newStatus) => {
    if (onStatusChange && caseId) {
      onStatusChange(caseId, newStatus);
    }
  };

  const getCaseTitle = () => {
    if (caseItem?.plaintiff && caseItem?.defendant) {
      return `${caseItem.plaintiff} VS ${caseItem.defendant}`;
    }
    if (caseItem?.caseTitle) return caseItem.caseTitle;
    if (caseItem?.title) return caseItem.title;
    return 'Untitled Case';
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

  // ============================================
  // HELPER FUNCTIONS FOR STATUS COLORS
  // ============================================
  const getProceedingStatusColor = (status) => {
    if (status?.toLowerCase().includes('adjournment')) 
      return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    if (status?.toLowerCase().includes('decision')) 
      return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
    if (status?.toLowerCase().includes('dismissed')) 
      return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
    return 'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20';
  };

  const getCommentStatusColor = (status) => {
    if (status === 'Completed') 
      return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
    if (status === 'In Progress') 
      return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    if (status === 'Closed') 
      return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20';
    return 'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20';
  };

  // ============================================
  // TABS
  // ============================================
  const tabs = [
    { id: 'details', label: 'Case Details' },
    { id: 'proceedings', label: `Proceedings (${caseProceedings.length})` },
    { id: 'comments', label: `Comments (${caseComments.length})` },
    { id: 'parties', label: `Parties (${caseParties.length})` },
  ];

  // ============================================
  // RENDER DETAILS TAB
  // ============================================
  const renderDetails = () => (
    <div className="space-y-5 max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
              <FaLandmark className="text-[#0F4C75]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Division</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.division)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
              <FaLandmark className="text-[#0F4C75]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">District</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.district)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
            <FaBookOpen className="text-[#0F4C75]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Case Number</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseNumber)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
            <FaFileAlt className="text-[#0F4C75]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Title of the Case</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {caseItem.caseTitle || caseItem.title || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
              <FaUser className="text-[#0F4C75]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Plaintiff</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.plaintiff)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-[#3282B8] tracking-wider">VS</span>
        </div>
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
              <FaUser className="text-[#0F4C75]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Defendant</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.defendant)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
            <FaBuilding className="text-[#0F4C75]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Name of the Court</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {displayValue(caseItem.nameOfCourt || caseItem.courtDetails?.courtName || caseItem.courtName || 'N/A')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
            <FaClipboardList className="text-[#0F4C75]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Nature of the Case</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {displayValue(caseItem.natureOfCase || caseItem.caseNature?.trial || 'N/A')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3282B8]/10 rounded-lg flex-shrink-0">
            <FaCalendarAlt className="text-[#0F4C75]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Next Date of Hearing</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {caseItem.nextDateOfHearing ? formatDate(caseItem.nextDateOfHearing) : 
               caseItem.nextDate ? formatDate(caseItem.nextDate) : 
               caseItem.courtDetails?.nextDate ? formatDate(caseItem.courtDetails.nextDate) : 
               'N/A'}
            </p>
          </div>
        </div>
      </div>

      {(caseItem.attachments || caseItem.copyOfSummon || caseItem.copyOfPlaint || caseItem.relevantDepartmentalRecord) && (
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg">
              <FaFileAlt className="text-[#0F4C75]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Attachments</h3>
          </div>
          <div className="space-y-2">
            {(caseItem.copyOfSummon || caseItem.attachments?.copyOfSummon) && (
              <div className="flex items-center gap-2 p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30">
                <FaFilePdf className="text-red-500" />
                <span className="text-sm text-[#1B262C]">Copy of summon/Notices/Request to defend: {caseItem.copyOfSummon || caseItem.attachments?.copyOfSummon}</span>
              </div>
            )}
            {(caseItem.copyOfPlaint || caseItem.attachments?.copyOfPlaint) && (
              <div className="flex items-center gap-2 p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30">
                <FaFilePdf className="text-red-500" />
                <span className="text-sm text-[#1B262C]">Copy of plaint / petition: {caseItem.copyOfPlaint || caseItem.attachments?.copyOfPlaint}</span>
              </div>
            )}
            {(caseItem.relevantDepartmentalRecord || caseItem.attachments?.relevantDepartmentalRecord) && (
              <div className="flex items-center gap-2 p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30">
                <FaFilePdf className="text-red-500" />
                <span className="text-sm text-[#1B262C]">Relevant Departmental Record: {caseItem.relevantDepartmentalRecord || caseItem.attachments?.relevantDepartmentalRecord}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {caseItem.writtenStatements && caseItem.writtenStatements.length > 0 && (
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg">
              <FaFileAlt className="text-[#0F4C75]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Written Statements</h3>
          </div>
          <div className="space-y-2">
            {caseItem.writtenStatements.map((statement, index) => (
              <div key={index} className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30">
                <p className="text-sm font-semibold text-[#1B262C]">{statement.title || `Statement ${index + 1}`}</p>
                {statement.content && (
                  <p className="text-sm text-[#6B7280] mt-1">{statement.content}</p>
                )}
                {statement.fileName && (
                  <p className="text-xs text-[#6B7280] mt-1">File: {statement.fileName}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {caseItem.lawOfficer && (
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg">
              <FaUser className="text-[#0F4C75]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Law Officer / Departmental Representative</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Type</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.type)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Name</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.name)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Designation</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.designation)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Office Address</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.officeAddress)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Official Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.officialNumber)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Cell Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.cellNumber)}</p>
            </div>
          </div>
        </div>
      )}

      {caseItem.alternateLawOfficer && (
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-[#3282B8]/10 rounded-lg">
              <FaUser className="text-[#0F4C75]" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Alternate Law Officer / Departmental Representative</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Type</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.type)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Name</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.name)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Designation</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.designation)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Office Address</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.officeAddress)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Official Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.officialNumber)}</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-3 border border-[#BBE1FA]/30">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Cell Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.cellNumber)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-[#BBE1FA]/40 w-full">
        {caseItem.status !== 'closed' && onStatusChange && (
          <button
            onClick={() => handleStatusChange('closed')}
            className="flex-1 min-w-[120px] px-5 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
          >
            <FaGavelIcon className="inline mr-2" /> Close Case
          </button>
        )}
        <button 
          onClick={handleCloseClick}
          className="flex-1 min-w-[120px] px-5 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseClick(e);
          }
        }}
      >
        <div 
          className="w-screen h-screen bg-[#F8FAFC] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* HEADER */}
          <div className="w-full px-6 py-4 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
            
            <div className="flex items-start justify-between w-full pt-1">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C75]/25">
                    <GiScales className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[#1B262C] tracking-tight truncate">
                    {getCaseTitle()}
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
                    {isRefreshing && (
                      <span className="text-xs text-[#6B7280] flex items-center gap-1">
                        <FaSync className="animate-spin" /> refreshing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button 
                  onClick={handleCloseClick}
                  className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
                  title="Close"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-[#BBE1FA]/40 bg-white px-6 flex-shrink-0 overflow-x-auto">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#3282B8] text-[#0F4C75]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1B262C] hover:border-[#BBE1FA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F8FAFC] p-6">
            
            {/* DETAILS TAB */}
            {activeTab === 'details' && renderDetails()}

            {/* PROCEEDINGS TAB */}
            {activeTab === 'proceedings' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaHistory className="text-[#0F4C75]" />
                    <span>{caseProceedings.length} proceeding(s) recorded</span>
                  </div>
                  <button
                    onClick={() => setShowProceedingForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                  >
                    <FaPlusCircle className="text-xs" />
                    Add Proceeding
                  </button>
                </div>

                {caseProceedings.length > 0 ? (
                  <div className="space-y-3">
                    {caseProceedings.map((p, idx) => (
                      <div 
                        key={p._id || p.id || idx}
                        className="bg-white rounded-xl p-4 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedProceeding(p);
                          setShowProceedingDetail(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-medium text-[#1B262C]">
                                #{idx + 1} - {p.createdBy || 'N/A'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getProceedingStatusColor(p.status)}`}>
                                {p.status || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-[#6B7280] line-clamp-2">{p.progress || 'N/A'}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280]">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="text-[10px]" />
                                {p.date ? new Date(p.date).toLocaleDateString('en-GB') : 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCalendarCheck className="text-[10px]" />
                                Next: {p.nextHearingDate ? new Date(p.nextHearingDate).toLocaleDateString('en-GB') : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => openEditProceedingForm(p)}
                              className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(p._id || p.id, 'proceeding')}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">📋</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">No proceedings recorded</h3>
                    <p className="text-sm text-[#6B7280]">Click "Add Proceeding" to create your first record</p>
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaComment className="text-[#0F4C75]" />
                    <span>{caseComments.length} comment(s)</span>
                  </div>
                  <button
                    onClick={() => setShowCommentForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                  >
                    <FaPlusCircle className="text-xs" />
                    Add Comment
                  </button>
                </div>

                {caseComments.length > 0 ? (
                  <div className="space-y-3">
                    {caseComments.map((c, idx) => (
                      <div 
                        key={c._id || c.id || idx}
                        className="bg-white rounded-xl p-4 border border-[#BBE1FA]/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-medium text-[#1B262C]">{c.commentedBy || 'N/A'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCommentStatusColor(c.status)}`}>
                                {c.status || 'Pending'}
                              </span>
                              <span className="text-xs text-[#6B7280]">
                                {c.date ? new Date(c.date).toLocaleDateString('en-GB') : 'N/A'}
                              </span>
                            </div>
                            {c.remarks && (
                              <p className="text-sm text-[#6B7280] mt-1">{c.remarks}</p>
                            )}
                            {c.requestToClientDepartment && (
                              <p className="text-xs text-[#0F4C75] mt-1">📌 {c.requestToClientDepartment}</p>
                            )}
                            {c.clientDepartments && (
                              <p className="text-xs text-[#6B7280] mt-0.5">Department: {c.clientDepartments}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => openEditCommentForm(c)}
                              className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(c._id || c.id, 'comment')}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">💬</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">No comments</h3>
                    <p className="text-sm text-[#6B7280]">Click "Add Comment" to start the conversation</p>
                  </div>
                )}
              </div>
            )}

            {/* PARTIES TAB */}
            {activeTab === 'parties' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaUsers className="text-[#0F4C75]" />
                    <span>{caseParties.length} party(ies)</span>
                  </div>
                  <button
                    onClick={() => setShowAddPartyForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                  >
                    <FaPlusCircle className="text-xs" />
                    Add Party
                  </button>
                </div>

                {caseParties.length > 0 ? (
                  <div className="space-y-3">
                    {caseParties.map((p, idx) => (
                      <div 
                        key={p._id || p.id || idx}
                        className="bg-white rounded-xl p-4 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded text-xs font-medium border border-[#3282B8]/20">
                                {p.type || 'Party'}
                              </span>
                              <span className="text-sm font-medium text-[#1B262C]">{p.name}</span>
                              {p.createdBy && (
                                <span className="text-xs text-[#6B7280]">by {p.createdBy}</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                              {p.phone && p.phone !== '-' && (
                                <p className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <FaPhone className="text-[10px] text-[#9CA3AF]" /> {p.phone}
                                </p>
                              )}
                              {p.email && p.email !== '-' && (
                                <p className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <FaEnvelope className="text-[10px] text-[#9CA3AF]" /> {p.email}
                                </p>
                              )}
                              {p.cnic && p.cnic !== '-' && (
                                <p className="text-xs text-[#6B7280] flex items-center gap-1">
                                  <FaIdCard className="text-[10px] text-[#9CA3AF]" /> {p.cnic}
                                </p>
                              )}
                              {p.address && p.address !== '-' && (
                                <p className="text-xs text-[#6B7280] flex items-center gap-1 col-span-2">
                                  <FaMapMarkerAlt className="text-[10px] text-[#9CA3AF]" /> {p.address}
                                </p>
                              )}
                            </div>
                            {p.date && (
                              <p className="text-[10px] text-[#9CA3AF] mt-1">Added: {new Date(p.date).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => openEditPartyForm(p)}
                              className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(p._id || p.id, 'party')}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">👥</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">No parties added</h3>
                    <p className="text-sm text-[#6B7280]">Click "Add Party" to add parties to this case</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== ADD PROCEEDING MODAL ===== */}
      <AddProceedingModalInline
        isOpen={showProceedingForm}
        onClose={() => setShowProceedingForm(false)}
        onSave={handleAddProceedingSubmit}
        caseId={caseId}
      />

      {/* ===== ADD COMMENT MODAL ===== */}
      <AddCommentModalInline
        isOpen={showCommentForm}
        onClose={() => setShowCommentForm(false)}
        onSave={handleAddCommentSubmit}
        caseId={caseId}
      />

      {/* ===== ADD PARTY MODAL ===== */}
      <AddPartyModalInline
        isOpen={showAddPartyForm}
        onClose={() => setShowAddPartyForm(false)}
        onSave={handleAddPartySubmit}
        caseId={caseId}
      />

      {/* ===== EDIT PROCEEDING MODAL ===== */}
      {showEditProceedingForm && editingProceeding && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Proceeding</h3>
                    <p className="text-white/70 text-sm">Update hearing progress</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditProceedingForm(false);
                    setEditingProceeding(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditProceedingSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Created By *
                </label>
                <input
                  type="text"
                  value={editProceedingFormData.createdBy}
                  onChange={(e) => handleEditProceedingFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={editProceedingFormData.date}
                  onChange={(e) => handleEditProceedingFormChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Progress on Date of Hearing *
                </label>
                <textarea
                  value={editProceedingFormData.progress}
                  onChange={(e) => handleEditProceedingFormChange('progress', e.target.value)}
                  placeholder="Enter progress details..."
                  required
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Next Date of Hearing *
                </label>
                <input
                  type="date"
                  value={editProceedingFormData.nextHearingDate}
                  onChange={(e) => handleEditProceedingFormChange('nextHearingDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Status of the Case *
                </label>
                <select                  value={editProceedingFormData.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Others') {
                      setShowEditCustomStatusInput(true);
                      setEditProceedingFormData(prev => ({ ...prev, status: '' }));
                    } else {
                      setShowEditCustomStatusInput(false);
                      setEditProceedingFormData(prev => ({ ...prev, status: value }));
                    }
                  }}
                  required={!showEditCustomStatusInput}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select Status -</option>
                  {editStatusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {showEditCustomStatusInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={editCustomStatus}
                      onChange={(e) => setEditCustomStatus(e.target.value)}
                      placeholder="Enter custom status..."
                      className="flex-1 px-4 py-2 border-2 border-[#F59E0B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-[#F8FAFC] text-[#1B262C]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editCustomStatus.trim()) {
                          addEditCustomStatus(editCustomStatus.trim());
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl text-sm font-medium"
                    >
                      <FaPlus className="text-xs" /> Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCustomStatusInput(false);
                        setEditCustomStatus('');
                        setEditProceedingFormData(prev => ({ ...prev, status: '' }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Attachment
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#F59E0B] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                    <div className="flex items-center justify-center gap-2">
                      <FaFileAlt className="text-[#F59E0B]" />
                      <span className="text-sm text-[#6B7280]">Choose File</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleEditProceedingFormChange('attachment', e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {editProceedingFormData.attachment ? (
                    <span className="text-sm text-[#F59E0B] font-medium">{editProceedingFormData.attachment}</span>
                  ) : (
                    <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProceedingForm(false);
                    setEditingProceeding(null);
                    setShowEditCustomStatusInput(false);
                    setEditCustomStatus('');
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Proceeding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT COMMENT MODAL ===== */}
      {showEditCommentForm && editingComment && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Comment</h3>
                    <p className="text-white/70 text-sm">Update comment details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditCommentForm(false);
                    setEditingComment(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditCommentSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Commented By *
                </label>
                <input
                  type="text"
                  value={editCommentFormData.commentedBy}
                  onChange={(e) => handleEditCommentFormChange('commentedBy', e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Remarks
                </label>
                <textarea
                  value={editCommentFormData.remarks}
                  onChange={(e) => handleEditCommentFormChange('remarks', e.target.value)}
                  placeholder="Enter remarks..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Request to Client Department
                </label>
                <select
                  value={editCommentFormData.requestToClientDepartment}
                  onChange={(e) => handleEditCommentFormChange('requestToClientDepartment', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select -</option>
                  {[
                    'Attendance of departmental representative required in court.',
                    'Attendance of departmental representative for cross-examination of witnesses.',
                    'Attendance of Departmental representatives for oral evidence.',
                    'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
                    'Provision of record and assistance from Departmental Representative for arguments.',
                    'Provision of record for documentary evidence. (time limitation)',
                    'Provision of record for preparation of written statement/ reply. (time limitation)'
                  ].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Client Departments
                </label>
                <input
                  type="text"
                  value={editCommentFormData.clientDepartments}
                  onChange={(e) => handleEditCommentFormChange('clientDepartments', e.target.value)}
                  placeholder="Enter client department"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={editCommentFormData.status}
                  onChange={(e) => handleEditCommentFormChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  {['Pending', 'In Progress', 'Completed', 'Closed'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={editCommentFormData.date}
                  onChange={(e) => handleEditCommentFormChange('date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCommentForm(false);
                    setEditingComment(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT PARTY MODAL ===== */}
      {showEditPartyForm && editingParty && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Party</h3>
                    <p className="text-white/70 text-sm">Update party details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditPartyForm(false);
                    setEditingParty(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditPartySubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Type *
                </label>
                <select
                  value={editPartyFormData.type}
                  onChange={(e) => handleEditPartyFormChange('type', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select Type -</option>
                  {partyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  value={editPartyFormData.name}
                  onChange={(e) => handleEditPartyFormChange('name', e.target.value)}
                  placeholder="Enter party name"
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  CNIC
                </label>
                <div className="relative">
                  <FaIdCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={editPartyFormData.cnic}
                    onChange={(e) => handleEditPartyFormChange('cnic', e.target.value)}
                    placeholder="XXXXX-XXXXXXX-X"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={editPartyFormData.phone}
                    onChange={(e) => handleEditPartyFormChange('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={editPartyFormData.email}
                    onChange={(e) => handleEditPartyFormChange('email', e.target.value)}
                    placeholder="party@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-[#9CA3AF]" />
                  <textarea
                    value={editPartyFormData.address}
                    onChange={(e) => handleEditPartyFormChange('address', e.target.value)}
                    placeholder="Enter address"
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Created By
                </label>
                <input
                  type="text"
                  value={editPartyFormData.createdBy}
                  onChange={(e) => handleEditPartyFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPartyForm(false);
                    setEditingParty(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetType('');
        }}
        onConfirm={handleDeleteConfirmed}
        title={`Delete ${deleteTargetType}?`}
        message={`Are you sure you want to delete this ${deleteTargetType}? This action cannot be undone.`}
      />

      {/* ===== PROCEEDING DETAIL MODAL ===== */}
      {showProceedingDetail && selectedProceeding && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#3282B8]/20">
            <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <GiJusticeStar className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Proceeding Details</h3>
                    <p className="text-white/70 text-sm">{selectedProceeding.date ? new Date(selectedProceeding.date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProceedingDetail(false);
                    setSelectedProceeding(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getProceedingStatusColor(selectedProceeding.status)}`}>
                  {selectedProceeding.status || 'N/A'}
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Progress</p>
                <p className="text-sm text-[#1B262C] mt-1">{selectedProceeding.progress || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Created By</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.createdBy || 'N/A'}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Date</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.date ? new Date(selectedProceeding.date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="md:col-span-2 bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Next Hearing Date</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.nextHearingDate ? new Date(selectedProceeding.nextHearingDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                {selectedProceeding.attachment && (
                  <div className="md:col-span-2 bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Attachment</p>
                    <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.attachment}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowProceedingDetail(false);
                    setSelectedProceeding(null);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CLOSE POPUP ===== */}
      {showClosePopup && (
        <div 
          className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelClose();
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0F4C75]/10 flex items-center justify-center mx-auto mb-4">
                <FaQuestionCircle className="text-[#0F4C75] text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-[#1B262C] mb-2">Close Case View</h3>
              <p className="text-[#6B7280] text-sm mb-6">Are you sure you want to close this case view?</p>
              <div className="flex gap-3">
                <button 
                  onClick={cancelClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0F4C75] rounded-xl hover:bg-[#1B262C] transition-all flex items-center justify-center gap-2"
                >
                  <FaCheck className="text-sm" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseDetailModal;