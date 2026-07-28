// src/App.jsx - COMPLETE WORKING VERSION WITH PROFESSIONAL NEW BADGE
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// HOOKS - ALL NAMED IMPORTS
// ============================================
import { useCases } from './hooks/useCases';
import { useClients } from './hooks/useClients';
import { useEvents } from './hooks/useEvents';
import { useReferences } from './hooks/useReferences';
import { useProceedings } from './hooks/useProceedings';
import { useAuth } from './hooks/useAuth';
import useComments from './hooks/useComments';
import useParties from './hooks/useParties';

// ============================================
// LAYOUT COMPONENTS
// ============================================
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// ============================================
// PAGES
// ============================================
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// ============================================
// COMPONENTS
// ============================================
import ProtectedRoute from './components/ProtectedRoute';
import CaseCard from './components/cases/CaseCard';
import TabNavigation from './components/common/TabNavigation';
import ClientsList from './components/clients/ClientsList';
import CalendarView from './components/calendar/CalendarView';
import ReportsDashboard from './components/reports/ReportsDashboard';
import ProceedingsList from './components/proceedings/ProceedingsList';

// ============================================
// MODALS
// ============================================
import AddCaseModal from './components/modals/AddCaseModal';
import EditCaseModal from './components/modals/EditCaseModal';
import CaseDetailModal from './components/modals/CaseDetailModal';
import AddReferenceModal from './components/modals/AddReferenceModal';

// ============================================
// API
// ============================================
import { api } from './api/client';

// ============================================
// ICONS
// ============================================
import { 
  FaPlusCircle, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaGavel,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaTimes,
  FaUser,
  FaFile,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaPrint,
  FaPlus,
  FaSave,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUserCircle,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarCheck,
  FaHistory,
  FaClipboardList,
  FaStamp,
  FaBookmark,
  FaUsers,
  FaIdCard,
  FaAddressCard,
  FaComment,
  FaSpinner,
  FaCalendarDay
} from 'react-icons/fa';
import { GiScales, GiJusticeStar, GiFamilyHouse } from 'react-icons/gi';

// ============================================
// DEPARTMENT OPTIONS - COMPLETE LIST
// ============================================
const DEPARTMENT_OPTIONS = [
  'All Departments',
  'Agriculture Department',
  'Aquaculture and Fisheries Department',
  'Board of Revenue Department',
  'Chief Minister Inspection Team',
  'Communication and Works Department',
  'Cooperation Department',
  'Disaster Management Department',
  'Energy Department',
  'Environment Protection and Climate Change Department',
  'Elections, Taxation and Narcotics Control Department',
  'FIR Department',
  'Finance Department',
  'Food, Safety and Consumer Protection Department',
  'Forestry and Wildlife Department',
  'Health and Population Department',
  'Higher Education Department',
  'Home Department',
  'Housing, Urban Development and Public Health Engineering Department',
  'Human Rights and Minorities Affairs Department',
  'Industries, Commerce and Investment Department',
  'Information and Culture Department',
  'Irrigation Department',
  'Labour and Human Resource Department',
  'Law and Parliamentary Affairs Department',
  'Literacy and Non Formal Basic Education Department',
  'Livestock and Dairy Development Department',
  'Local Government and Community Development Department',
  'Mines and Mineral Department',
  'PITB Department',
  'Planning and Development Board',
  'Public Prosecution Department',
  'Punjab Defamation Tribunal, Lahore',
  'Punjab Defamation Tribunal, Multan',
  'Punjab Defamation Tribunal, Rawalpindi',
  'Punjab Emergency Service Department',
  'School Education Department',
  'Services and General Administration Department',
  'Skills Development and Entrepreneurship Department',
  'Social Welfare and Bat-ul-Mal Department',
  'Special Education Department',
  'Specialized Healthcare & Medical Education Department',
  'The District Attorney (Awan-e-Abad), Lahore',
  'The District Attorney, Attock',
  'The District Attorney, Bahawalnagar',
  'The District Attorney, Bahawalpur',
  'The District Attorney, Bhakkar',
  'The District Attorney, Chakwal',
  'The District Attorney, Chiniot',
  'The District Attorney, Dera Ghazi Khan',
  'The District Attorney, Faisalabad',
  'The District Attorney, Gujranwala',
  'The District Attorney, Gujrat',
  'The District Attorney, Hafizabad',
  'The District Attorney, Jhang',
  'The District Attorney, Jhelum',
  'The District Attorney, Kasur',
  'The District Attorney, Khanewal',
  'The District Attorney, Khushab',
  'The District Attorney, Lahore',
  'The District Attorney, Layyah',
  'The District Attorney, Lodhran',
  'The District Attorney, Mandi Bahauddin',
  'The District Attorney, Mianwali',
  'The District Attorney, Multan',
  'The District Attorney, Muzaffargarh',
  'The District Attorney, Nankana Sahib',
  'The District Attorney, Narowal',
  'The District Attorney, Okara',
  'The District Attorney, Pakpattan',
  'The District Attorney, Rahim Yar Khan',
  'The District Attorney, Rajanpur',
  'The District Attorney, Rawalpindi',
  'The District Attorney, Sahiwal',
  'The District Attorney, Sargodha',
  'The District Attorney, Sheikhupura',
  'The District Attorney, Sialkot',
  'The District Attorney, Toba Tek Singh',
  'The District Attorney, Vehari'
];

// ============================================
// STATUS OPTIONS
// ============================================
const STATUS_OPTIONS = [
  'All Status',
  'Active',
  'Pending',
  'Closed',
];

// ============================================
// REQUEST TO CLIENT DEPARTMENT OPTIONS
// ============================================
const REQUEST_OPTIONS = [
  'Select',
  'Attendance of departmental representative required in court.',
  'Attendance of departmental representatives for cross-examination of witnesses.',
  'Attendance of Departmental representatives for oral evidence.',
  'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
  'Provision of record and assistance from Departmental Representative for arguments.',
  'Provision of record for documentary evidence. (time limitation)',
  'Provision of record for preparation of written statement/ reply. (time limitation)'
];

// ============================================
// CLIENT DEPARTMENTS OPTIONS
// ============================================
const CLIENT_DEPARTMENT_OPTIONS = [
  'Select',
  'Agriculture Department',
  'Board of Revenue Department',
  'Communication and Works Department',
  'Cooperation Department',
  'Energy Department',
  'Finance Department',
  'Food Department',
  'Forestry and Wildlife Department',
  'Health Department',
  'Higher Education Department',
  'Home Department',
  'Housing Department',
  'Industries Department',
  'Information and Culture Department',
  'Irrigation Department',
  'Labour Department',
  'Law and Parliamentary Affairs Department',
  'Livestock Department',
  'Local Government Department',
  'Mines and Mineral Department',
  'Planning and Development Department',
  'Public Prosecution Department',
  'School Education Department',
  'Services and General Administration Department',
  'Social Welfare Department',
  'Special Education Department',
  'Specialized Healthcare Department'
];

// ============================================
// COMMENT STATUS OPTIONS
// ============================================
const COMMENT_STATUS_OPTIONS = [
  'Select Status',
  'Pending',
  'In Progress',
  'Completed',
  'Closed'
];

// ============================================
// ADD COMMENT MODAL INLINE - ONLY REQUESTED FIELDS
// ============================================
const AddCommentModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Select Status'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.remarks) {
      toast.error('Please enter remarks');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      remarks: formData.remarks || '',
      requestToClientDepartment: formData.requestToClientDepartment || '',
      clientDepartments: formData.clientDepartments || '',
      attachments: formData.attachments || [],
      status: formData.status,
      date: new Date().toISOString().split('T')[0]
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
          
          {/* Header */}
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
            
            {/* 1️⃣ Request to Client Department */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Request to Client Department
              </label>
              <select
                value={formData.requestToClientDepartment}
                onChange={(e) => handleChange('requestToClientDepartment', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {REQUEST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* 2️⃣ Client Departments */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Client Departments
              </label>
              <select
                value={formData.clientDepartments}
                onChange={(e) => handleChange('clientDepartments', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {CLIENT_DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 3️⃣ Remarks * */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Remarks *
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Enter Remarks"
                required
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
              />
            </div>

            {/* 4️⃣ Attach Files */}
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
                {formData.attachments.length > 0 ? (
                  <span className="text-sm text-[#0F4C75] font-medium">
                    {formData.attachments.length} file(s) chosen
                  </span>
                ) : (
                  <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">Each file must be less than 20MB</p>
            </div>

            {/* 5️⃣ Status */}
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {COMMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
              >
                Close
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
                    Save
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
// ADD PARTY MODAL
// ============================================
const AddPartyModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
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
    
    if (!formData.type || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const newParty = {
      type: formData.type,
      name: formData.name,
      phone: formData.phone || '-',
      email: formData.email || '-',
      cnic: formData.cnic || '-',
      address: formData.address || '-',
      createdBy: formData.createdBy || 'Current User',
    };
    
    if (onSave) {
      onSave(newParty);
    }
    
    setIsSubmitting(false);
    onClose();
    setFormData({
      type: '',
      name: '',
      phone: '',
      email: '',
      cnic: '',
      address: '',
      createdBy: '',
    });
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
                  <FaUserCircle className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Civil Case Party</h3>
                  <p className="text-white/70 text-sm">Add new party to the case</p>
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
                Type <span className="text-red-500">*</span>
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
                Name <span className="text-red-500">*</span>
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
                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
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
                Close
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
// EDIT PARTY MODAL - COMPLETE FIXED
// ============================================
const EditPartyModal = ({ isOpen, onClose, onSave, party }) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (party) {
      const partyId = party?._id || party?.id;
      
      if (!partyId) {
        console.error('❌ Party has no ID!');
        return;
      }
      
      setFormData({
        type: party.type || '',
        name: party.name || '',
        phone: party.phone || '',
        email: party.email || '',
        cnic: party.cnic || '',
        address: party.address || '',
        createdBy: party.createdBy || '',
      });
    }
  }, [party]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    const partyId = party?._id || party?.id;
    
    if (!partyId) {
      console.error('❌ Party ID missing!');
      toast.error('Party ID is missing');
      return;
    }

    setIsSubmitting(true);
    
    const updatedParty = {
      ...party,
      id: partyId,
      _id: partyId,
      type: formData.type,
      name: formData.name,
      phone: formData.phone || '-',
      email: formData.email || '-',
      cnic: formData.cnic || '-',
      address: formData.address || '-',
      createdBy: formData.createdBy || 'Current User',
    };
    
    console.log('📤 Submitting updated party:', updatedParty);
    
    if (typeof onSave === 'function') {
      onSave(updatedParty);
    }
    
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !party) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
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
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
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
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
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
                <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => handleChange('cnic', e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
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
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
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
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Update Party
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
// DASHBOARD CONTENT COMPONENT
// ============================================
const DashboardContent = () => {
  const {
    cases,
    loading: casesLoading,
    addCase,
    updateCase,
    deleteCase,
    updateCaseStatus,
    getStats,
    fetchCases,
    fetchCaseById,
  } = useCases();

  const {
    clients,
    loading: clientsLoading,
    addClient,
    updateClient,
    deleteClient,
  } = useClients();

  const {
    events,
    loading: eventsLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const {
    references,
    loading: referencesLoading,
    addReference,
    deleteReference,
  } = useReferences();

  const {
    proceedings: allProceedings,
    loading: proceedingsLoading,
    addProceeding,
    updateProceeding,
    updateProceedingStatus,
    deleteProceeding,
    fetchProceedings,
  } = useProceedings();

  const {
    comments: allComments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    fetchComments,
  } = useComments();

  const {
    parties: allParties,
    loading: partiesLoading,
    addParty,
    updateParty,
    deleteParty,
    fetchParties,
  } = useParties();

  const { user, logout } = useAuth();

  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToEdit, setCaseToEdit] = useState(null);
  
  // Case-specific data states
  const [caseProceedings, setCaseProceedings] = useState([]);
  const [caseParties, setCaseParties] = useState([]);
  const [caseComments, setCaseComments] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  // Force re-render state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Party states
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [showEditPartyModal, setShowEditPartyModal] = useState(false);
  const [selectedPartyForEdit, setSelectedPartyForEdit] = useState(null);
  const [deletePartyModal, setDeletePartyModal] = useState({ isOpen: false, party: null });

  // State declarations for comments and parties
  const [allCommentsState, setAllComments] = useState([]);
  const [allPartiesState, setAllParties] = useState([]);

  // SEARCH STATE
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    filterBy: 'all'
  });

  // DATE FILTER
  const [dateFilter, setDateFilter] = useState('');

  // DEPARTMENT FILTER
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  // STATUS FILTER
  const [statusFilter, setStatusFilter] = useState('All Status');

  const modalRef = useRef(null);

  // ============================================
  // PROFESSIONAL NEW BADGE CONFIGURATION
  // ============================================
  const NEW_BADGE_CONFIG = {
    enabled: true,
    daysToShow: 7,          // Show NEW badge for 7 days
    showUntilViewed: true,   // Hide once case is viewed
    pulseAnimation: true,    // Animate the badge
  };

  // ============================================
  // PROFESSIONAL: Check if case is new
  // ============================================
  const isNewCase = (caseItem) => {
    if (!caseItem || !NEW_BADGE_CONFIG.enabled) return false;
    
    // If showUntilViewed is true and case has been viewed
    if (NEW_BADGE_CONFIG.showUntilViewed && caseItem.viewedAt) {
      return false;
    }
    
    // Check by createdAt timestamp
    if (caseItem.createdAt) {
      const createdDate = new Date(caseItem.createdAt);
      const now = new Date();
      const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
      return diffDays < NEW_BADGE_CONFIG.daysToShow;
    }
    
    // Fallback: check isNew flag
    return caseItem.isNew === true;
  };

  // ============================================
  // MARK CASE AS VIEWED when opened
  // ============================================
  const markCaseAsViewed = async (caseItem) => {
    if (!caseItem) return;
    
    const caseId = caseItem.id || caseItem._id;
    
    // Only mark if it's new
    if (isNewCase(caseItem)) {
      try {
        await api.patch(`/cases/${caseId}`, { 
          viewedAt: new Date().toISOString(),
          isNew: false 
        });
        await refreshCases();
      } catch (error) {
        console.error('Error marking case as viewed:', error);
      }
    }
  };

  // ============================================
  // DATE DISPLAY HELPER - dd/mm/yyyy format
  // ============================================
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // ============================================
  // AUTO DATE FILTER - Triggers on change
  // ============================================
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    if (value) {
      toast.success(`Showing cases with next hearing on ${formatDateDisplay(value)}`);
    } else {
      toast.success('Date filter cleared');
    }
  };

  // ============================================
  // DEPARTMENT FILTER - Triggers on change
  // ============================================
  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartmentFilter(value);
    if (value !== 'All Departments') {
      toast.success(`Showing cases for department: ${value}`);
    } else {
      toast.success('Department filter cleared');
    }
  };

  // ============================================
  // STATUS FILTER - Triggers on change
  // ============================================
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    if (value !== 'All Status') {
      toast.success(`Showing cases with status: ${value}`);
    } else {
      toast.success('Status filter cleared');
    }
  };

  // ============================================
  // FETCH CASE DATA
  // ============================================
  const filterCaseData = useCallback((caseId) => {
    if (!caseId) {
      console.log('⚠️ No caseId provided');
      return;
    }

    console.log('🔄 Filtering data for case:', caseId);
    setIsDataLoading(true);

    try {
      console.log('📊 Total proceedings available:', allProceedings.length);
      const procData = allProceedings.filter(p => {
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered proceedings:', procData.length);
      setCaseProceedings(procData);

      setCaseParties([]);
      setCaseComments([]);

      console.log('✅ Data filtering complete for case:', caseId);

    } catch (error) {
      console.error('❌ Error filtering case data:', error);
      setCaseProceedings([]);
      setCaseParties([]);
      setCaseComments([]);
    } finally {
      setIsDataLoading(false);
    }
  }, [allProceedings]);

  const filterAndSetData = useCallback((caseId) => {
    if (!caseId) {
      console.log('⚠️ No caseId provided');
      return;
    }

    console.log('🔄 Filtering proceedings for case:', caseId);
    console.log('📊 Total proceedings available:', allProceedings.length);
    
    if (allProceedings.length === 0) {
      console.log('⚠️ No proceedings available');
      setCaseProceedings([]);
      return;
    }

    try {
      const procData = allProceedings.filter(p => {
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered proceedings:', procData.length);
      setCaseProceedings(procData);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error filtering proceedings:', error);
      setCaseProceedings([]);
    }
  }, [allProceedings]);

  useEffect(() => {
    if (selectedCase && caseProceedings.length > 0) {
      console.log('🔄 caseProceedings updated, forcing modal refresh:', caseProceedings.length);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [caseProceedings, selectedCase]);

  useEffect(() => {
    if (allProceedings.length > 0 && selectedCase) {
      const caseId = selectedCase._id || selectedCase.id;
      console.log('🔄 Proceedings updated, re-filtering for case:', caseId);
      console.log('📊 Total proceedings now:', allProceedings.length);
      
      const procData = allProceedings.filter(p => {
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered proceedings:', procData.length);
      setCaseProceedings(procData);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [allProceedings, selectedCase]);

  const fetchPartiesForCase = useCallback(async (caseId) => {
    if (!caseId) return;
    
    try {
      console.log('👤 Fetching parties from API for case:', caseId);
      const response = await api.get('/parties');
      const allPartiesData = response.data.data || response.data || [];
      console.log('✅ Total parties fetched:', allPartiesData.length);
      
      const caseIdStr = String(caseId || '');
      console.log('🔍 caseIdStr for filtering:', caseIdStr);
      
      const filtered = allPartiesData.filter(p => {
        const pCaseId = p.caseId?.toString ? p.caseId.toString() : String(p.caseId || '');
        return pCaseId === caseIdStr;
      });
      console.log('✅ Filtered parties count:', filtered.length);
      console.log('✅ Filtered parties:', filtered);
      
      setCaseParties(filtered);
      window.__caseParties = filtered;
      window.__allParties = allPartiesData;
      window.__selectedCaseId = caseIdStr;
      
    } catch (error) {
      console.error('❌ Error fetching parties:', error);
      setCaseParties([]);
      window.__caseParties = [];
    }
  }, []);

  const fetchCommentsForCase = useCallback(async (caseId) => {
    if (!caseId) return;
    
    try {
      console.log('💬 Fetching comments from API for case:', caseId);
      const response = await api.get('/comments');
      const allComments = response.data.data || response.data || [];
      console.log('✅ Total comments fetched:', allComments.length);
      
      const filtered = allComments.filter(c => {
        const cCaseId = c.caseId;
        return cCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered comments:', filtered.length);
      setCaseComments(filtered);
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      setCaseComments([]);
    }
  }, []);

  const fetchCaseData = useCallback(async (caseId) => {
    if (!caseId) {
      console.log('⚠️ No caseId provided');
      return;
    }

    console.log('🔄 Fetching all data for case:', caseId);
    setIsDataLoading(true);

    try {
      filterCaseData(caseId);
      await fetchPartiesForCase(caseId);
      await fetchCommentsForCase(caseId);
      console.log('✅ All data fetched for case:', caseId);
    } catch (error) {
      console.error('❌ Error in fetchCaseData:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, [filterCaseData, fetchPartiesForCase, fetchCommentsForCase]);

  // ============================================
  // PARTY CRUD OPERATIONS
  // ============================================
  const handleAddParty = async (newParty) => {
    try {
      console.log('📝 Adding party:', newParty);
      
      const caseId = selectedCase?._id || selectedCase?.id || 
                     window.__selectedCase?._id || window.__selectedCase?.id ||
                     newParty.caseId;
      
      console.log('🔍 Final Case ID:', caseId);
      
      if (!caseId) {
        toast.error('Case ID is missing');
        return { success: false, error: 'Case ID is missing' };
      }
      
      const partyData = {
        type: newParty.type,
        name: newParty.name,
        phone: newParty.phone || '-',
        email: newParty.email || '-',
        cnic: newParty.cnic || '-',
        address: newParty.address || '-',
        createdBy: newParty.createdBy || 'Current User',
        caseId: caseId,
      };
      
      const response = await api.post('/parties', partyData);
      console.log('✅ Party added:', response.data);
      
      const newPartyData = response.data.data || response.data;
      window.__allParties = [...(window.__allParties || []), newPartyData];
      setAllParties(window.__allParties);
      setCaseParties(prev => [...prev, newPartyData]);
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('✅ Party added successfully!');
      return response.data;
      
    } catch (error) {
      console.error('❌ Error adding party:', error);
      toast.error(error.response?.data?.error || 'Failed to add party');
      throw error;
    }
  };

  const handleEditParty = async (partyData, id) => {
    try {
      console.log('📝 App - handleEditParty called');
      console.log('📝 partyData:', partyData);
      console.log('📝 id parameter:', id);
      
      let partyId = id || partyData?.id || partyData?._id || partyData?.partyId;
      
      if (!partyId && typeof partyData === 'string') {
        partyId = partyData;
      }
      
      console.log('✅ Final Party ID:', partyId);
      
      if (!partyId) {
        console.error('❌ Party ID is missing');
        toast.error('Party ID is missing');
        return { success: false, error: 'Party ID is missing' };
      }
      
      const partyDataToSend = {
        type: partyData.type || '',
        name: partyData.name || '',
        phone: partyData.phone || '-',
        email: partyData.email || '-',
        cnic: partyData.cnic || '-',
        address: partyData.address || '-',
        createdBy: partyData.createdBy || 'Current User',
      };
      
      console.log('📤 Sending update data:', partyDataToSend);
      
      const response = await api.put(`/parties/${partyId}`, partyDataToSend);
      console.log('✅ Party updated:', response.data);
      
      const updatedData = response.data.data || response.data;
      
      if (window.__allParties) {
        window.__allParties = window.__allParties.map(p => 
          (p._id === partyId || p.id === partyId) ? updatedData : p
        );
        setAllParties(window.__allParties);
      }
      
      setCaseParties(prev => prev.map(p => 
        (p._id === partyId || p.id === partyId) ? updatedData : p
      ));
      
      setRefreshTrigger(prev => prev + 1);
      toast.success('✅ Party updated successfully!');
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating party:', error);
      toast.error(error.response?.data?.error || 'Failed to update party');
      throw error;
    }
  };

  const handleDeleteParty = async (partyId) => {
    try {
      console.log('🗑️ Deleting party:', partyId);
      const id = partyId?.id || partyId?._id || partyId;
      
      if (!id) {
        toast.error('Party ID is missing');
        return;
      }
      
      await api.delete(`/parties/${id}`);
      console.log('✅ Party deleted');
      
      setDeletePartyModal({ isOpen: false, party: null });
      
      if (window.__allParties) {
        window.__allParties = window.__allParties.filter(p => 
          (p._id !== id && p.id !== id)
        );
        setAllParties(window.__allParties);
      }
      
      setCaseParties(prev => prev.filter(p => 
        (p._id !== id && p.id !== id)
      ));
      
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('✅ Party deleted successfully!');
      
    } catch (error) {
      console.error('❌ Error deleting party:', error);
      toast.error(error.response?.data?.error || 'Failed to delete party');
    }
  };

  // ============================================
  // COMMENT CRUD OPERATIONS
  // ============================================
  const handleAddComment = async (newComment) => {
    try {
      console.log('📝 Adding comment:', newComment);
      
      const caseId = selectedCase?._id || selectedCase?.id || 
                     window.__selectedCase?._id || window.__selectedCase?.id ||
                     newComment.caseId;
      
      if (!caseId) {
        toast.error('Case ID is missing');
        return { success: false, error: 'Case ID is missing' };
      }
      
      const commentData = {
        caseId: caseId,
        remarks: newComment.remarks || '',
        requestToClientDepartment: newComment.requestToClientDepartment || '',
        clientDepartments: newComment.clientDepartments || '',
        attachments: newComment.attachments || [],
        status: newComment.status || 'Select Status',
        date: new Date().toISOString().split('T')[0]
      };
      
      const response = await api.post('/comments', commentData);
      console.log('✅ Comment added:', response.data);
      
      const newCommentData = response.data.data || response.data;
      window.__allComments = [...(window.__allComments || []), newCommentData];
      setAllComments(window.__allComments);
      setCaseComments(prev => [...prev, newCommentData]);
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('✅ Comment added successfully!');
      return response.data;
      
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error(error.response?.data?.error || 'Failed to add comment');
      throw error;
    }
  };

  const handleUpdateComment = async (id, updatedComment) => {
    try {
      console.log('📝 Updating comment:', id, updatedComment);
      
      const response = await api.put(`/comments/${id}`, updatedComment);
      console.log('✅ Comment updated:', response.data);
      
      const updatedData = response.data.data || response.data;
      
      if (window.__allComments) {
        window.__allComments = window.__allComments.map(c => 
          (c._id === id || c.id === id) ? updatedData : c
        );
        setAllComments(window.__allComments);
      }
      
      setCaseComments(prev => prev.map(c => 
        (c._id === id || c.id === id) ? updatedData : c
      ));
      
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('✅ Comment updated successfully!');
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating comment:', error);
      toast.error(error.response?.data?.error || 'Failed to update comment');
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log('🗑️ Deleting comment:', commentId);
      const id = commentId?.id || commentId?._id || commentId;
      
      if (!id) {
        toast.error('Comment ID is missing');
        return;
      }
      
      await api.delete(`/comments/${id}`);
      console.log('✅ Comment deleted');
      
      if (window.__allComments) {
        window.__allComments = window.__allComments.filter(c => 
          (c._id !== id && c.id !== id)
        );
        setAllComments(window.__allComments);
      }
      
      setCaseComments(prev => prev.filter(c => 
        (c._id !== id && c.id !== id)
      ));
      
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('✅ Comment deleted successfully!');
      
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    }
  };

  // ============================================
  // PARTY MODAL HANDLERS
  // ============================================
  const openEditPartyModal = (party) => {
    console.log('✏️ App - Opening edit modal for party:', party);
    console.log('✏️ Party ID:', party?._id, party?.id);
    console.log('✏️ Party caseId:', party?.caseId);
    
    if (!party) {
      console.error('❌ No party provided');
      toast.error('No party data found');
      return;
    }
    
    const partyId = party?._id || party?.id;
    
    if (!partyId) {
      console.error('❌ Party has no ID!', party);
      toast.error('Party ID not found');
      return;
    }
    
    const partyWithId = {
      ...party,
      id: partyId,
      _id: partyId
    };
    
    console.log('✅ Party with ID set:', partyWithId);
    
    window.__selectedPartyForEdit = partyWithId;
    
    setSelectedPartyForEdit(partyWithId);
    setShowEditPartyModal(true);
  };

  const openDeletePartyConfirm = (party) => {
    console.log('🗑️ Opening delete confirmation for party:', party);
    setDeletePartyModal({ isOpen: true, party });
  };

  // ============================================
  // REFRESH FUNCTIONS
  // ============================================
  const refreshCases = useCallback(async () => {
    console.log('🔄 Refreshing cases...');
    await fetchCases();
  }, [fetchCases]);

  const refreshSelectedCase = useCallback(async () => {
    if (!selectedCase) return null;
    
    const caseId = selectedCase.id || selectedCase._id;
    console.log('🔄 Refreshing selected case:', caseId);
    
    const updatedCase = cases.find(c => 
      (c.id === caseId || c._id === caseId)
    );
    
    if (updatedCase) {
      setSelectedCase(updatedCase);
      console.log('✅ Selected case updated from cases array');
      return updatedCase;
    }
    
    try {
      const result = await fetchCaseById(caseId);
      if (result && result.success) {
        setSelectedCase(result.data);
        console.log('✅ Selected case fetched from API');
        return result.data;
      }
    } catch (error) {
      console.error('❌ Failed to refresh selected case:', error);
    }
    return null;
  }, [selectedCase, cases, fetchCaseById]);

  // ============================================
  // SOLVED CASES
  // ============================================
  const solvedCases = useMemo(() => {
    const solvedCaseIds = ['3', '5'];
    return cases.filter(c => c.status === 'closed' && solvedCaseIds.includes(c.id || c._id));
  }, [cases]);

  // ============================================
  // FILTERED CASES WITH DATE + DEPARTMENT + STATUS + SEARCH
  // ============================================
  const filteredCases = useMemo(() => {
    let filtered = cases;

    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.status === activeTab);
    }

    if (searchFilters.query && searchFilters.query.trim()) {
      const query = searchFilters.query.toLowerCase().trim();
      const filterBy = searchFilters.filterBy;
      
      filtered = filtered.filter(c => {
        if (filterBy === 'all' || filterBy === 'name') {
          if (c.caseTitle?.toLowerCase().includes(query) || 
              c.title?.toLowerCase().includes(query)) return true;
        }
        if (filterBy === 'all' || filterBy === 'division') {
          if (c.division?.toLowerCase().includes(query)) return true;
        }
        if (filterBy === 'all' || filterBy === 'district') {
          if (c.district?.toLowerCase().includes(query)) return true;
        }
        if (filterBy === 'all' || filterBy === 'party') {
          if (c.plaintiff?.toLowerCase().includes(query) || 
              c.defendant?.toLowerCase().includes(query) ||
              c.party?.toLowerCase().includes(query)) return true;
        }
        if (filterBy === 'all' || filterBy === 'status') {
          if (c.status?.toLowerCase().includes(query)) return true;
        }
        if (filterBy === 'all') {
          return c.caseTitle?.toLowerCase().includes(query) ||
                 c.title?.toLowerCase().includes(query) ||
                 c.caseNumber?.toLowerCase().includes(query) ||
                 c.party?.toLowerCase().includes(query) ||
                 c.description?.toLowerCase().includes(query) ||
                 c.caseType?.toLowerCase().includes(query) ||
                 c.division?.toLowerCase().includes(query) ||
                 c.district?.toLowerCase().includes(query) ||
                 c.status?.toLowerCase().includes(query);
        }
        return false;
      });
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(c => {
        const hearingDate = c.nextDateOfHearing || 
                            c.nextHearing || 
                            c.nexthearing || 
                            c.courtDetails?.nextDate ||
                            c.hearingDate ||
                            c.nextDate;
        
        if (!hearingDate) return false;
        
        const date = new Date(hearingDate);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === filterDate.getTime();
      });
    }

    if (departmentFilter && departmentFilter !== 'All Departments') {
      filtered = filtered.filter(c => {
        const caseDepartment = c.department || c.caseType || c.natureOfCase || 'General';
        return caseDepartment.toLowerCase() === departmentFilter.toLowerCase() ||
               caseDepartment.toLowerCase().includes(departmentFilter.toLowerCase());
      });
    }

    if (statusFilter && statusFilter !== 'All Status') {
      filtered = filtered.filter(c => {
        const caseStatus = c.status || 'Unknown';
        return caseStatus.toLowerCase() === statusFilter.toLowerCase() ||
               caseStatus.toLowerCase().includes(statusFilter.toLowerCase());
      });
    }

    return filtered;
  }, [cases, activeTab, searchFilters, dateFilter, departmentFilter, statusFilter]);

  const stats = getStats();

  const tabs = [
    { id: 'all', label: 'All', count: filteredCases.length },
    { id: 'active', label: 'Active', count: filteredCases.filter(c => c.status === 'active').length },
    { id: 'pending', label: 'Pending', count: filteredCases.filter(c => c.status === 'pending').length },
    { id: 'closed', label: 'Closed', count: filteredCases.filter(c => c.status === 'closed').length },
  ];

  // ============================================
  // NAVIGATION
  // ============================================
  const handleNavigate = (page) => {
    console.log('🔄 Navigating to:', page);
    setActivePage(page);
    
    if (page === 'profile' || page === 'settings') {
      return;
    }
    
    if (['cases', 'active', 'pending', 'closed', 'solved-cases', 'reference-cases', 'proceedings', 'clients'].includes(page)) {
      setActiveTab(page === 'solved-cases' ? 'solved' : page === 'reference-cases' ? 'reference' : page === 'cases' ? 'all' : page);
    }
  };

  const handleSearch = (query, filterBy = 'all') => {
    setSearchFilters({ query, filterBy });
    if (query && query.trim()) {
      setActivePage('cases');
    }
  };

  const clearSearch = () => {
    setSearchFilters({ query: '', filterBy: 'all' });
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleAddClient = async (newClient) => {
    console.log('👤 Adding client from App:', newClient);
    const result = await addClient(newClient);
    console.log('👤 Result:', result);
    return result;
  };

  const handleEditClient = async (updatedClient) => {
    const result = await updateClient(updatedClient.id || updatedClient._id, updatedClient);
    return result;
  };

  const handleDeleteClient = async (clientId) => {
    const result = await deleteClient(clientId);
    return result;
  };

  const handleAddEvent = async (newEvent) => {
    const result = await addEvent(newEvent);
    return result;
  };

  const handleEditEvent = async (updatedEvent) => {
    const result = await updateEvent(updatedEvent.id || updatedEvent._id, updatedEvent);
    return result;
  };

  const handleDeleteEvent = async (eventId) => {
    const result = await deleteEvent(eventId);
    return result;
  };

  const handleAddReferenceCase = async (newReference) => {
    const result = await addReference(newReference);
    if (result.success) {
      setIsAddReferenceModalOpen(false);
    }
    return result;
  };

  const handleDeleteReferenceCase = async (id) => {
    if (window.confirm('Are you sure you want to delete this reference case?')) {
      const result = await deleteReference(id);
      return result;
    }
  };

  // ============================================
  // PROCEEDINGS HANDLERS
  // ============================================
  const handleAddProceeding = async (newProceeding) => {
    console.log('📝 App - handleAddProceeding called with:', newProceeding);
    
    if (!newProceeding.caseId) {
      console.error('❌ Case ID is required');
      toast.error('Please select a case');
      return { success: false, error: 'Case ID is required' };
    }
    
    try {
      const result = await addProceeding(newProceeding);
      console.log('📝 Result from addProceeding:', result);
      
      if (result && result.success) {
        await refreshCases();
        console.log('✅ Cases refreshed');
        
        const caseId = selectedCase?._id || selectedCase?.id;
        if (caseId) {
          await fetchCaseData(caseId);
          const freshCase = await fetchCaseById(caseId);
          if (freshCase && freshCase.success) {
            setSelectedCase(freshCase.data);
            console.log('✅ Selected case refreshed');
          }
          setRefreshTrigger(prev => prev + 1);
        }
      
        return result;
      } else {
        toast.error(result?.error || 'Failed to add proceeding');
        return result;
      }
    } catch (error) {
      console.error('❌ Error in handleAddProceeding:', error);
      toast.error(error.message || 'Failed to add proceeding');
      return { success: false, error: error.message };
    }
  };

  const handleUpdateProceeding = async (id, updatedData) => {
    console.log('📝 App - handleUpdateProceeding called with:', id, updatedData);
    try {
      const result = await updateProceeding(id, updatedData);
      if (result && result.success) {
        await refreshCases();
        
        const caseId = selectedCase?._id || selectedCase?.id;
        if (caseId) {
          await fetchCaseData(caseId);
          setRefreshTrigger(prev => prev + 1);
        }
        
        return result;
      } else {
        toast.error(result?.error || 'Failed to update proceeding');
        return result;
      }
    } catch (error) {
      console.error('❌ Error updating proceeding:', error);
      toast.error(error.message || 'Failed to update proceeding');
      return { success: false, error: error.message };
    }
  };

  const handleDeleteProceeding = async (id) => {
    console.log('🗑️ App - handleDeleteProceeding called with:', id);
    try {
      const result = await deleteProceeding(id);
      if (result && result.success) {
        await refreshCases();
        
        const caseId = selectedCase?._id || selectedCase?.id;
        if (caseId) {
          await fetchCaseData(caseId);
          setRefreshTrigger(prev => prev + 1);
        }
        
        return result;
      } else {
        toast.error(result?.error || 'Failed to delete proceeding');
        return result;
      }
    } catch (error) {
      console.error('❌ Error deleting proceeding:', error);
      toast.error(error.message || 'Failed to delete proceeding');
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // handleView
  // ============================================
  const handleView = useCallback((caseItem) => {
    console.log('👁️ App - Opening view modal for case:', caseItem);
    
    if (!caseItem) {
      console.error('❌ No case item provided');
      return;
    }
    
    // ✅ Mark case as viewed when opened
    markCaseAsViewed(caseItem);
    
    const caseId = caseItem._id || caseItem.id;
    const caseIdStr = String(caseId || '');
    
    console.log('🔍 Case ID (string):', caseIdStr);
    console.log('🔍 Case item:', caseItem);
    
    window.__selectedCaseId = caseIdStr;
    window.__selectedCase = caseItem;
    
    const filteredParties = allParties.filter(p => {
      const pCaseId = p.caseId?.toString ? p.caseId.toString() : String(p.caseId || '');
      if (!pCaseId || pCaseId === 'null' || pCaseId === 'undefined') {
        return false;
      }
      return pCaseId === caseIdStr;
    });
    console.log('✅ Filtered parties count:', filteredParties.length);
    
    const filteredProcs = allProceedings.filter(p => {
      const pCaseId = p.caseId?.toString ? p.caseId.toString() : String(p.caseId || '');
      return pCaseId === caseIdStr;
    });
    
    const filteredComments = allComments.filter(c => {
      const cCaseId = c.caseId?.toString ? c.caseId.toString() : String(c.caseId || '');
      return cCaseId === caseIdStr;
    });
    
    setCaseProceedings(filteredProcs);
    setCaseComments(filteredComments);
    setCaseParties(filteredParties);
    
    window.__caseProceedings = filteredProcs;
    window.__caseComments = filteredComments;
    window.__caseParties = filteredParties;
    window.__allParties = allParties;
    
    console.log('✅ Updated window.__caseParties:', window.__caseParties.length);
    console.log('✅ Updated window.__selectedCaseId:', window.__selectedCaseId);
    
    setSelectedCase(caseItem);
    modalRef.current = true;
    
  }, [allProceedings, allComments, allParties]);

  // ============================================
  // EDIT AND VIEW HANDLERS
  // ============================================
  const handleEdit = (caseItem) => {
    console.log('📝 App - Opening edit modal for case:', caseItem?.id || caseItem?._id);
    if (caseItem) {
      setCaseToEdit(caseItem);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateCase = async (id, updatedData) => {
    console.log('📝 App - Updating case:', id);
    const result = await updateCase(id, updatedData);
    if (result.success) {
      setCaseToEdit(null);
      setIsEditModalOpen(false);
      
      await refreshCases();
      
      setTimeout(async () => {
        await refreshSelectedCase();
      }, 300);
     
    }
    return result;
  };

  const handlePartyUpdate = async (caseId, partyData) => {
    console.log('👤 App - Updating party data for case:', caseId, partyData);
    
    const caseItem = cases.find(c => (c.id === caseId || c._id === caseId));
    if (!caseItem) {
      console.error('❌ Case not found:', caseId);
      toast.error('Case not found');
      return;
    }
    
    const updatedData = {
      ...caseItem,
      partyName: partyData.name,
      partyType: partyData.type,
      partyPhone: partyData.phone,
      partyEmail: partyData.email,
      partyCnic: partyData.cnic,
      partyAddress: partyData.address,
      party: partyData.name || partyData.type,
    };
    
    const result = await updateCase(caseId, updatedData);
    if (result.success) {
      await refreshCases();
      if (selectedCase && (selectedCase.id === caseId || selectedCase._id === caseId)) {
        await refreshSelectedCase();
      }
    }
    return result;
  };

  window.__editCase = (caseItem) => {
    console.log('🌐 Global edit called for case:', caseItem);
    setCaseToEdit(caseItem);
    setIsEditModalOpen(true);
  };

  // ============================================
  // REGISTER GLOBAL FUNCTIONS
  // ============================================
  useEffect(() => {
    window.__handleView = handleView;
    window.__handleAddProceeding = handleAddProceeding;
    window.__handleAddComment = handleAddComment;
    window.__handleAddParty = handleAddParty;
    window.__handleUpdateProceeding = handleUpdateProceeding;
    window.__handleUpdateComment = handleUpdateComment;
    window.__handleUpdateParty = handleEditParty;
    window.__handleDeleteProceeding = handleDeleteProceeding;
    window.__handleDeleteComment = handleDeleteComment;
    window.__handleDeleteParty = handleDeleteParty;
    window.__handleRefresh = refreshCases;
    window.__handleRefreshSelectedCase = refreshSelectedCase;
    window.__handleFetchCaseById = fetchCaseById;
    window.__handleFetchProceedings = fetchProceedings;
    window.__fetchCaseData = fetchCaseData;

    window.__openAddCaseModal = () => {
      console.log('🌐 Global function: Opening Add Case modal');
      setIsAddModalOpen(true);
    };
    
    window.__selectedCase = selectedCase;
    window.__caseProceedings = caseProceedings;
    window.__caseParties = caseParties;
    window.__caseComments = caseComments;
    window.__cases = cases;
    window.__allProceedings = allProceedings;
    window.__allComments = allComments;
    window.__allParties = allParties;
    
    console.log('✅ [Global Register] handleView registered:', typeof window.__handleView);
    console.log('✅ [Global Register] allProceedings:', window.__allProceedings?.length);
    console.log('✅ [Global Register] caseProceedings:', window.__caseProceedings?.length);
    console.log('✅ [Global Register] allComments:', window.__allComments?.length);
    console.log('✅ [Global Register] allParties:', window.__allParties?.length);
  }, [
    handleView,
    handleAddProceeding, handleAddComment, handleAddParty,
    handleUpdateProceeding, handleUpdateComment, handleEditParty,
    handleDeleteProceeding, handleDeleteComment, handleDeleteParty,
    refreshCases, refreshSelectedCase, fetchCaseById, fetchProceedings,
    fetchCaseData,
    selectedCase, caseProceedings, caseParties, caseComments, cases, allProceedings, allComments, allParties
  ]);

  // ============================================
  // LOAD INITIAL DATA ON MOUNT
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading initial data...');
      await fetchCases();
      await fetchProceedings();
      await fetchComments();
      await fetchParties();
      console.log('✅ Initial data loaded');
    };
    loadData();
  }, []);

  // ============================================
  // MONITOR DATA CHANGES
  // ============================================
  useEffect(() => {
    if (allParties.length > 0) {
      window.__allParties = allParties;
      console.log('✅ Updated global allParties:', allParties.length);
      
      const caseId = selectedCase?._id || selectedCase?.id || window.__selectedCaseId;
      if (caseId) {
        const caseIdStr = String(caseId);
        const filtered = allParties.filter(p => {
          const pCaseId = p.caseId?.toString ? p.caseId.toString() : String(p.caseId || '');
          if (!pCaseId || pCaseId === 'null' || pCaseId === 'undefined') return false;
          return pCaseId === caseIdStr;
        });
        
        console.log('✅ Auto-filtered parties:', filtered.length);
        setCaseParties(filtered);
        window.__caseParties = filtered;
        window.__selectedCaseId = caseIdStr;
      }
    }
  }, [allParties, selectedCase]);

  useEffect(() => {
    if (allComments.length > 0) {
      window.__allComments = allComments;
      console.log('✅ Updated global allComments:', allComments.length);
    }
  }, [allComments]);

  useEffect(() => {
    if (allParties.length > 0) {
      window.__allParties = allParties;
      console.log('✅ Updated global allParties:', allParties.length);
      
      const caseId = selectedCase?._id || selectedCase?.id;
      if (caseId) {
        const caseIdStr = String(caseId || '');
        const filtered = allParties.filter(p => {
          const pCaseId = p.caseId?.toString ? p.caseId.toString() : String(p.caseId || '');
          return pCaseId === caseIdStr;
        });
        
        console.log('✅ Auto-filtered parties:', filtered.length);
        setCaseParties(filtered);
        window.__caseParties = filtered;
        window.__selectedCaseId = caseIdStr;
      }
    }
  }, [allParties, selectedCase]);

  // ============================================
  // RENDER CONTENT
  // ============================================
  const renderContent = () => {
    if (activePage === 'profile') {
      return <Profile 
        onNavigate={handleNavigate} 
        cases={cases} 
        clients={clients}
        user={user}
        onUpdateProfile={(data) => {
          console.log('Profile updated:', data);
          return { success: true };
        }}
      />;
    }
    
    if (activePage === 'settings') {
      return <Settings onNavigate={handleNavigate} />;
    }

    if (activePage === 'clients') {
      return (
        <ClientsList 
          clients={clients}
          onAddClient={handleAddClient}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
          cases={cases}
        />
      );
    }

    if (activePage === 'proceedings') {
      return (
        <ProceedingsList 
          proceedings={allProceedings}
          cases={cases}
          onAddProceeding={handleAddProceeding}
          onUpdateProceeding={handleUpdateProceeding}
          onDeleteProceeding={handleDeleteProceeding}
          onUpdateStatus={updateProceedingStatus}
        />
      );
    }

    if (activePage === 'reference-cases') {
      const filteredReferences = references.filter(ref =>
        ref.title?.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        ref.caseNumber?.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        ref.caseType?.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        ref.referenceCategory?.toLowerCase().includes(searchFilters.query.toLowerCase())
      );

      return (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#1B262C]">Reference Cases</h2>
                <span className="px-3 py-1 bg-[#3282B8]/10 text-[#0F4C75] rounded-full text-xs font-medium border border-[#3282B8]/20">
                  {references.length} References
                </span>
              </div>
              <p className="text-sm text-[#6B7280] mt-1">Legal precedents and reference cases for research</p>
            </div>
            <button
              onClick={() => setIsAddReferenceModalOpen(true)}
              className="flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium"
            >
              <FaPlusCircle className="text-xs" />
              Add Reference Case
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
              </div>
              <input
                type="text"
                value={searchFilters.query}
                onChange={(e) => handleSearch(e.target.value, 'all')}
                placeholder="Search reference cases..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
              />
              {searchFilters.query && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#1B262C]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReferences.map((caseItem) => (
              <div key={caseItem.id || caseItem._id} className="premium-card hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1B262C] text-base leading-tight truncate">{caseItem.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#6B7280] font-mono">#{caseItem.caseNumber}</span>
                      <span className="text-xs px-2 py-0.5 bg-[#3282B8]/10 rounded text-[#0F4C75] border border-[#3282B8]/20">
                        {caseItem.caseType || 'General'}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20 flex-shrink-0 ml-3">
                    📚 Reference
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{caseItem.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#BBE1FA]">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px] text-[#0F4C75]" />
                      {caseItem.date ? new Date(caseItem.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedCase(caseItem)} className="p-1.5 text-[#1B262C] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-lg transition-all">
                      <FaEye className="text-sm" />
                    </button>
                    <button onClick={() => handleDeleteReferenceCase(caseItem.id || caseItem._id)} className="p-1.5 text-[#EF4444] hover:text-[#EF4444]/80 hover:bg-[#EF4444]/10 rounded-lg transition-all">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredReferences.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-[#1B262C] mb-1">No reference cases found</h3>
                <p className="text-[#6B7280] text-sm">{searchFilters.query ? 'Try adjusting your search' : 'Add reference cases for legal research'}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activePage === 'solved-cases') {
      return (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#1B262C]">Solved Cases</h2>
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-xs font-medium border border-[#22C55E]/20">
                  {solvedCases.length} Solved
                </span>
              </div>
              <p className="text-sm text-[#6B7280] mt-1">Cases resolved by other lawyers</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
              </div>
              <input
                type="text"
                value={searchFilters.query}
                onChange={(e) => handleSearch(e.target.value, 'all')}
                placeholder="Search solved cases..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
              />
              {searchFilters.query && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#1B262C]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {solvedCases.map((caseItem) => (
              <CaseCard
                key={caseItem.id || caseItem._id}
                case={caseItem}
                onView={() => handleView(caseItem)}
                onEdit={() => handleEdit(caseItem)}
                onStatusChange={updateCaseStatus}
                onDelete={deleteCase}
                isNew={isNewCase(caseItem)}
                onRefresh={refreshCases}
                onPartyUpdate={handlePartyUpdate}
                onDepartmentClick={(dept) => {
                  setDepartmentFilter(dept);
                  toast.success(`Filtering by: ${dept}`);
                }}
              />
            ))}
          </div>
          {solvedCases.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-[#1B262C] mb-1">No solved cases</h3>
              </div>
            </div>
          )}
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateChange}
                  placeholder="dd/mm/yyyy"
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    dateFilter ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                />
                {dateFilter && (
                  <button
                    onClick={() => {
                      setDateFilter('');
                      toast.success('Date filter cleared');
                    }}
                    className="text-[#EF4444] hover:text-red-600 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}

                <select
                  value={departmentFilter}
                  onChange={handleDepartmentChange}
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    departmentFilter !== 'All Departments' ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                >
                  {DEPARTMENT_OPTIONS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    statusFilter !== 'All Status' ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {(dateFilter || departmentFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                  <span className="text-[10px] text-[#6B7280]">
                    ({filteredCases.length} results)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <div className="relative flex-1 min-w-[160px] max-w-[280px]">
                  <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs" />
                  <input
                    type="text"
                    value={searchFilters.query}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Search..."
                    className="w-full pl-8 pr-8 py-1.5 text-sm border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent bg-white"
                  />
                  {searchFilters.query && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1B262C]"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-0.5 bg-[#F0F4F8] rounded-lg p-0.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-white text-[#0F4C75] shadow-sm'
                          : 'text-[#6B7280] hover:text-[#1B262C]'
                      }`}
                    >
                      {tab.label} {tab.count > 0 && (
                        <span className={`ml-0.5 ${
                          activeTab === tab.id ? 'text-[#0F4C75]' : 'text-[#9CA3AF]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id || caseItem._id}
                  case={caseItem}
                  onView={() => handleView(caseItem)}
                  onEdit={() => handleEdit(caseItem)}
                  onStatusChange={updateCaseStatus}
                  onDelete={deleteCase}
                  isNew={isNewCase(caseItem)}
                  onRefresh={refreshCases}
                  onPartyUpdate={handlePartyUpdate}
                  onDepartmentClick={(dept) => {
                    setDepartmentFilter(dept);
                    toast.success(`Filtering by: ${dept}`);
                  }}
                />
              ))}
            </div>
            
            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-base font-semibold text-[#1B262C] mb-1">No cases found</h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchFilters.query ? `No results for "${searchFilters.query}"` : 
                     dateFilter ? 'No cases with next hearing on the selected date' : 
                     departmentFilter !== 'All Departments' ? `No cases in ${departmentFilter} department` :
                     statusFilter !== 'All Status' ? `No cases with ${statusFilter} status` :
                     'Try adjusting your search or filters'}
                  </p>
                  {(searchFilters.query || dateFilter || departmentFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                    <button
                      onClick={() => {
                        clearSearch();
                        setDateFilter('');
                        setDepartmentFilter('All Departments');
                        setStatusFilter('All Status');
                      }}
                      className="mt-2 text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'cases':
      case 'active':
      case 'pending':
      case 'closed':
        return (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h2 className="text-xl font-bold text-[#1B262C]">
                  {activePage === 'cases' ? 'All Cases' : 
                   activePage === 'active' ? 'Active Cases' :
                   activePage === 'pending' ? 'Pending Cases' : 'Closed Cases'}
                </h2>
                <p className="text-xs text-[#6B7280]">
                  {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateChange}
                  placeholder="dd/mm/yyyy"
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    dateFilter ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                />
                {dateFilter && (
                  <button
                    onClick={() => {
                      setDateFilter('');
                      toast.success('Date filter cleared');
                    }}
                    className="text-[#EF4444] hover:text-red-600 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}

                <select
                  value={departmentFilter}
                  onChange={handleDepartmentChange}
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    departmentFilter !== 'All Departments' ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                >
                  {DEPARTMENT_OPTIONS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className={`px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-36 ${
                    statusFilter !== 'All Status' ? 'border-[#0F4C75] bg-[#F0F4F8]' : 'border-[#BBE1FA] bg-white'
                  }`}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {(dateFilter || departmentFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                  <span className="text-[10px] text-[#6B7280]">
                    ({filteredCases.length} results)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <div className="relative flex-1 min-w-[160px] max-w-[280px]">
                  <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs" />
                  <input
                    type="text"
                    value={searchFilters.query}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Search..."
                    className="w-full pl-8 pr-8 py-1.5 text-sm border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent bg-white"
                  />
                  {searchFilters.query && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1B262C]"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-0.5 bg-[#F0F4F8] rounded-lg p-0.5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-white text-[#0F4C75] shadow-sm'
                          : 'text-[#6B7280] hover:text-[#1B262C]'
                      }`}
                    >
                      {tab.label} {tab.count > 0 && (
                        <span className={`ml-0.5 ${
                          activeTab === tab.id ? 'text-[#0F4C75]' : 'text-[#9CA3AF]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id || caseItem._id}
                  case={caseItem}
                  onView={() => handleView(caseItem)}
                  onEdit={() => handleEdit(caseItem)}
                  onStatusChange={updateCaseStatus}
                  onDelete={deleteCase}
                  isNew={isNewCase(caseItem)}
                  onRefresh={refreshCases}
                  onPartyUpdate={handlePartyUpdate}
                  onDepartmentClick={(dept) => {
                    setDepartmentFilter(dept);
                    toast.success(`Filtering by: ${dept}`);
                  }}
                />
              ))}
            </div>
            
            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-base font-semibold text-[#1B262C] mb-1">No cases found</h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchFilters.query ? `No results for "${searchFilters.query}"` : 
                     dateFilter ? 'No cases with next hearing on the selected date' : 
                     departmentFilter !== 'All Departments' ? `No cases in ${departmentFilter} department` :
                     statusFilter !== 'All Status' ? `No cases with ${statusFilter} status` :
                     'Try adjusting your search or filters'}
                  </p>
                  {(searchFilters.query || dateFilter || departmentFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                    <button
                      onClick={() => {
                        clearSearch();
                        setDateFilter('');
                        setDepartmentFilter('All Departments');
                        setStatusFilter('All Status');
                      }}
                      className="mt-2 text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'calendar':
        return (
          <CalendarView 
            events={events}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      
      case 'reports':
        return <ReportsDashboard cases={cases} clients={clients} events={events} />;
      
      default:
        return (
          <div className="bg-white rounded-2xl border border-[#BBE1FA] shadow-premium p-12 text-center">
            <h3 className="text-xl font-semibold text-[#1B262C]">Page not found</h3>
          </div>
        );
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (casesLoading || clientsLoading || eventsLoading || referencesLoading || proceedingsLoading || commentsLoading || partiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3282B8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading your data...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER DASHBOARD
  // ============================================
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#1B262C',
            border: '1px solid #BBE1FA',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(15, 76, 117, 0.12)',
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4F8] via-[#F0F4F8] to-[#BBE1FA]/20 flex flex-col">
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
        
        <Header 
          onAddClick={() => setIsAddModalOpen(true)}
          stats={stats}
          cases={cases}
          onNavigate={handleNavigate}
          activePage={activePage}
          solvedCases={solvedCases}
          referenceCases={references}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>

        <Footer stats={stats} onNavigate={handleNavigate} />

        <AddCaseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addCase} />

        <EditCaseModal
          isOpen={isEditModalOpen}
          case={caseToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setCaseToEdit(null);
          }}
          onUpdate={handleUpdateCase}
          onRefresh={refreshCases}
        />

        {selectedCase && (
          <CaseDetailModal
            key={selectedCase._id || selectedCase.id}
            isOpen={!!selectedCase}
            case={selectedCase}
            onClose={() => {
              console.log('🔴 Closing case detail modal');
              setSelectedCase(null);
              modalRef.current = false;
            }}
            onStatusChange={updateCaseStatus}
            onEdit={(caseItem) => {
              handleEdit(caseItem);
            }}
            onDelete={deleteCase}
            onDeleteComplete={() => {
              console.log('🔄 Delete complete - refreshing data');
              refreshCases();
            }}
            onRefresh={() => {
              console.log('🔄 Refreshing selected case from App');
              refreshSelectedCase();
            }}
            proceedings={caseProceedings}
            onAddProceeding={async (data) => {
              console.log('📝 App: Adding proceeding via prop:', data);
              try {
                const result = await handleAddProceeding(data);
                console.log('✅ Add proceeding result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onAddProceeding:', error);
                throw error;
              }
            }}
            onUpdateProceeding={async (id, data) => {
              console.log('📝 App: Updating proceeding:', id, data);
              try {
                const result = await handleUpdateProceeding(id, data);
                console.log('✅ Update proceeding result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onUpdateProceeding:', error);
                throw error;
              }
            }}
            onDeleteProceeding={async (id) => {
              console.log('🗑️ App: Deleting proceeding:', id);
              try {
                const result = await handleDeleteProceeding(id);
                console.log('✅ Delete proceeding result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onDeleteProceeding:', error);
                throw error;
              }
            }}
            comments={caseComments}
            onAddComment={async (data) => {
              console.log('📝 App: Adding comment via prop:', data);
              try {
                const result = await handleAddComment(data);
                console.log('✅ Add comment result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onAddComment:', error);
                throw error;
              }
            }}
            onUpdateComment={async (id, data) => {
              console.log('📝 App: Updating comment:', id, data);
              try {
                const result = await handleUpdateComment(id, data);
                console.log('✅ Update comment result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onUpdateComment:', error);
                throw error;
              }
            }}
            onDeleteComment={async (id) => {
              console.log('🗑️ App: Deleting comment:', id);
              try {
                const result = await handleDeleteComment(id);
                console.log('✅ Delete comment result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onDeleteComment:', error);
                throw error;
              }
            }}
            parties={caseParties}
            onAddParty={async (data) => {
              console.log('👤 App: Adding party via prop:', data);
              try {
                const result = await handleAddParty(data);
                console.log('✅ Add party result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onAddParty:', error);
                throw error;
              }
            }}
            onUpdateParty={async (id, data) => {
              console.log('👤 App: Updating party - ID:', id);
              console.log('👤 App: Updating party - Data:', data);
              try {
                const result = await handleEditParty({ ...data, id: id, _id: id });
                console.log('✅ Update party result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onUpdateParty:', error);
                throw error;
              }
            }}
            onDeleteParty={async (id) => {
              console.log('🗑️ App: Deleting party:', id);
              try {
                const result = await handleDeleteParty(id);
                console.log('✅ Delete party result:', result);
                await refreshCases();
                await fetchCaseData(selectedCase._id || selectedCase.id);
                return result;
              } catch (error) {
                console.error('❌ Error in onDeleteParty:', error);
                throw error;
              }
            }}
          />
        )}

        <AddReferenceModal
          isOpen={isAddReferenceModalOpen}
          onClose={() => setIsAddReferenceModalOpen(false)}
          onAdd={handleAddReferenceCase}
        />

        <DeleteConfirmModal
          isOpen={deletePartyModal.isOpen}
          onClose={() => setDeletePartyModal({ isOpen: false, party: null })}
          onConfirm={() => {
            if (deletePartyModal.party) {
              const partyId = deletePartyModal.party.id || deletePartyModal.party._id;
              if (partyId) {
                handleDeleteParty(partyId);
              } else {
                toast.error('Party ID not found');
                setDeletePartyModal({ isOpen: false, party: null });
              }
            }
          }}
          title="Delete Party?"
          message={`Are you sure you want to delete "${deletePartyModal.party?.name || 'this party'}"? This action cannot be undone.`}
        />

        <AddPartyModal
          isOpen={showAddPartyModal}
          onClose={() => setShowAddPartyModal(false)}
          onSave={handleAddParty}
        />

        <EditPartyModal
          isOpen={showEditPartyModal}
          party={selectedPartyForEdit}
          onClose={() => {
            console.log('🔴 Closing EditPartyModal');
            setShowEditPartyModal(false);
            setSelectedPartyForEdit(null);
            window.__selectedPartyForEdit = null;
          }}
          onSave={(updatedParty) => {
            console.log('📝 EditPartyModal onSave called with:', updatedParty);
            console.log('📝 Party ID in onSave:', updatedParty?.id, updatedParty?._id);
            handleEditParty(updatedParty);
          }}
        />
      </div>
    </>
  );
};

// ============================================
// MAIN APP WITH ROUTES
// ============================================
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;