// src/App.jsx - COMPLETE WORKING VERSION
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// ============================================
// ✅ HOOKS - ALL NAMED IMPORTS
// ============================================
import { useCases } from './hooks/useCases';
import { useClients } from './hooks/useClients';
import { useEvents } from './hooks/useEvents';
import { useReferences } from './hooks/useReferences';
import { useProceedings } from './hooks/useProceedings';
import { useAuth } from './hooks/useAuth';

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
  FaSpinner
} from 'react-icons/fa';
import { GiScales, GiJusticeStar, GiFamilyHouse } from 'react-icons/gi';

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
// EDIT PARTY MODAL
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

    setIsSubmitting(true);
    
    const updatedParty = {
      ...party,
      type: formData.type,
      name: formData.name,
      phone: formData.phone || '-',
      email: formData.email || '-',
      cnic: formData.cnic || '-',
      address: formData.address || '-',
      createdBy: formData.createdBy || 'Current User',
    };
    
    if (onSave) {
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

  const { user, logout } = useAuth();

  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const modalRef = useRef(null);

  // ============================================
  // ✅ FETCH CASE DATA - FILTER FROM EXISTING DATA
  // ============================================
  const filterCaseData = useCallback((caseId) => {
    if (!caseId) {
      console.log('⚠️ No caseId provided');
      return;
    }

    console.log('🔄 Filtering data for case:', caseId);
    setIsDataLoading(true);

    try {
      // ✅ FIX: Direct caseId field - no nesting
      console.log('📊 Total proceedings available:', allProceedings.length);
      const procData = allProceedings.filter(p => {
        // Proceedings have caseId as direct string
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered proceedings:', procData.length);
      setCaseProceedings(procData);

      // 2. Try to fetch parties from API
      console.log('👤 Parties will be fetched from API');
      setCaseParties([]);

      // 3. Try to fetch comments from API
      console.log('💬 Comments will be fetched from API');
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

  // ============================================
  // ✅ FILTER AND SET DATA
  // ============================================
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
      // ✅ FIX: Direct caseId field - no nesting
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

  // ============================================
  // ✅ FORCE MODAL UPDATE WHEN caseProceedings CHANGES
  // ============================================
  useEffect(() => {
    if (selectedCase && caseProceedings.length > 0) {
      console.log('🔄 caseProceedings updated, forcing modal refresh:', caseProceedings.length);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [caseProceedings, selectedCase]);

  // ============================================
  // ✅ MONITOR PROCEEDINGS CHANGES
  // ============================================
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

  // ============================================
  // ✅ FETCH PARTIES FROM API
  // ============================================
  const fetchPartiesForCase = useCallback(async (caseId) => {
    if (!caseId) return;
    
    try {
      console.log('👤 Fetching parties from API for case:', caseId);
      const response = await api.get('/parties');
      const allParties = response.data.data || response.data || [];
      console.log('✅ Total parties fetched:', allParties.length);
      
      const filtered = allParties.filter(p => {
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      console.log('✅ Filtered parties:', filtered.length);
      setCaseParties(filtered);
    } catch (error) {
      console.error('❌ Error fetching parties:', error);
      setCaseParties([]);
    }
  }, []);

  // ============================================
  // ✅ FETCH COMMENTS FROM API
  // ============================================
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

  // ============================================
  // ✅ MAIN FETCH FUNCTION
  // ============================================
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
      
      const caseId = selectedCase?._id || selectedCase?.id;
      
      const partyData = {
        type: newParty.type,
        name: newParty.name,
        phone: newParty.phone || '-',
        email: newParty.email || '-',
        cnic: newParty.cnic || '-',
        address: newParty.address || '-',
        createdBy: newParty.createdBy || 'Current User',
        caseId: caseId || null,
      };
      
      const response = await api.post('/parties', partyData);
      console.log('✅ Party added:', response.data);
      
      if (caseId) {
        await fetchPartiesForCase(caseId);
      }
      
      toast.success('Party added successfully!');
      return response.data;
    } catch (error) {
      console.error('❌ Error adding party:', error);
      toast.error(error.response?.data?.error || 'Failed to add party. Please try again.');
    }
  };

  const handleEditParty = async (updatedParty) => {
    try {
      console.log('📝 Updating party:', updatedParty);
      
      const partyId = updatedParty.id || updatedParty._id;
      
      if (!partyId) {
        toast.error('Party ID is missing');
        return;
      }
      
      const partyData = {
        type: updatedParty.type,
        name: updatedParty.name,
        phone: updatedParty.phone || '-',
        email: updatedParty.email || '-',
        cnic: updatedParty.cnic || '-',
        address: updatedParty.address || '-',
        createdBy: updatedParty.createdBy || 'Current User',
      };
      
      const response = await api.put(`/parties/${partyId}`, partyData);
      console.log('✅ Party updated:', response.data);
      
      const caseId = selectedCase?._id || selectedCase?.id;
      if (caseId) {
        await fetchPartiesForCase(caseId);
      }
      
      setShowEditPartyModal(false);
      setSelectedPartyForEdit(null);
      toast.success('Party updated successfully!');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating party:', error);
      toast.error(error.response?.data?.error || 'Failed to update party. Please try again.');
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
      
      const caseId = selectedCase?._id || selectedCase?.id;
      if (caseId) {
        await fetchPartiesForCase(caseId);
      }
      
      toast.success('Party deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting party:', error);
      toast.error(error.response?.data?.error || 'Failed to delete party. Please try again.');
    }
  };

  // ============================================
  // COMMENT CRUD OPERATIONS
  // ============================================
  const handleAddComment = async (newComment) => {
    try {
      console.log('📝 Adding comment:', newComment);
      
      const caseId = selectedCase?._id || selectedCase?.id;
      
      const commentData = {
        ...newComment,
        caseId: caseId || null,
      };
      
      const response = await api.post('/comments', commentData);
      console.log('✅ Comment added:', response.data);
      
      if (caseId) {
        await fetchCommentsForCase(caseId);
      }
      
      toast.success('Comment added successfully!');
      return response.data;
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error(error.response?.data?.error || 'Failed to add comment. Please try again.');
    }
  };

  const handleUpdateComment = async (id, updatedComment) => {
    try {
      console.log('📝 Updating comment:', id, updatedComment);
      const response = await api.put(`/comments/${id}`, updatedComment);
      console.log('✅ Comment updated:', response.data);
      
      const caseId = selectedCase?._id || selectedCase?.id;
      if (caseId) {
        await fetchCommentsForCase(caseId);
      }
      
      toast.success('Comment updated successfully!');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating comment:', error);
      toast.error(error.response?.data?.error || 'Failed to update comment. Please try again.');
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
      
      const caseId = selectedCase?._id || selectedCase?.id;
      if (caseId) {
        await fetchCommentsForCase(caseId);
      }
      
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      toast.error(error.response?.data?.error || 'Failed to delete comment. Please try again.');
    }
  };

  // ============================================
  // PARTY MODAL HANDLERS
  // ============================================
  const openEditPartyModal = (party) => {
    console.log('✏️ Opening edit modal for party:', party);
    setSelectedPartyForEdit(party);
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
  // FILTERED CASES
  // ============================================
  const filteredCases = useMemo(() => {
    let filtered = cases;

    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.status === activeTab);
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.caseTitle?.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        c.caseNumber?.toLowerCase().includes(query) ||
        c.party?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.caseType?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [cases, activeTab, searchQuery]);

  const stats = getStats();

  const isNewCase = (caseId) => {
    const initialCaseIds = ['1', '2', '3', '4', '5', '6'];
    return !initialCaseIds.includes(caseId);
  };

  const tabs = [
    { id: 'all', label: 'All Cases', count: filteredCases.length },
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      setActivePage('cases');
    }
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
        }
        
        toast.success('Proceeding added successfully!');
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
        }
        
        toast.success('Proceeding updated successfully!');
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
        }
        
        toast.success('Proceeding deleted successfully!');
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
  // ✅ FIXED handleView - WITH DIRECT FILTERING
  // ============================================
  const handleView = useCallback((caseItem) => {
    console.log('👁️ App - Opening view modal for case:', caseItem?._id || caseItem?.id);
    if (caseItem) {
      const caseId = caseItem._id || caseItem.id;
      
      console.log('🔍 Case ID:', caseId);
      console.log('📊 Total allProceedings:', allProceedings.length);
      
      // ✅ FIX: Direct caseId field - no nesting
      const filteredProcs = allProceedings.filter(p => {
        // Proceedings have caseId as direct string
        const pCaseId = p.caseId;
        return pCaseId?.toString() === caseId?.toString();
      });
      
      console.log('✅ Filtered proceedings count:', filteredProcs.length);
      
      // ✅ Set states directly
      setCaseProceedings(filteredProcs);
      setSelectedCase(caseItem);
      modalRef.current = true;
      
      // ✅ Fetch parties and comments
      fetchPartiesForCase(caseId);
      fetchCommentsForCase(caseId);
    }
  }, [allProceedings, fetchPartiesForCase, fetchCommentsForCase]);

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
      toast.success('Case updated successfully!');
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
      toast.success('Party updated successfully!');
    }
    return result;
  };

  window.__editCase = (caseItem) => {
    console.log('🌐 Global edit called for case:', caseItem);
    setCaseToEdit(caseItem);
    setIsEditModalOpen(true);
  };

  // ============================================
  // ✅ REGISTER GLOBAL FUNCTIONS - ALWAYS UP TO DATE
  // ============================================
  useEffect(() => {
    // Register ALL functions that need to be globally accessible
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
    
    // Also expose the data
    window.__selectedCase = selectedCase;
    window.__caseProceedings = caseProceedings;
    window.__caseParties = caseParties;
    window.__caseComments = caseComments;
    window.__cases = cases;
    window.__allProceedings = allProceedings;
    
    console.log('✅ [Global Register] handleView registered:', typeof window.__handleView);
    console.log('✅ [Global Register] allProceedings:', window.__allProceedings?.length);
    console.log('✅ [Global Register] caseProceedings:', window.__caseProceedings?.length);
  }, [
    handleView,
    handleAddProceeding, handleAddComment, handleAddParty,
    handleUpdateProceeding, handleUpdateComment, handleEditParty,
    handleDeleteProceeding, handleDeleteComment, handleDeleteParty,
    refreshCases, refreshSelectedCase, fetchCaseById, fetchProceedings,
    fetchCaseData,
    selectedCase, caseProceedings, caseParties, caseComments, cases, allProceedings
  ]);

  // ============================================
  // ✅ LOAD INITIAL DATA ON MOUNT
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading initial data...');
      await fetchCases();
      await fetchProceedings();
      console.log('✅ Initial data loaded');
    };
    loadData();
  }, []);

  // ============================================
  // ✅ MONITOR PROCEEDINGS CHANGES
  // ============================================
  useEffect(() => {
    if (allProceedings.length > 0) {
      window.__allProceedings = allProceedings;
      
      if (selectedCase) {
        const caseId = selectedCase._id || selectedCase.id;
        const filtered = allProceedings.filter(p => p.caseId === caseId);
        window.__caseProceedings = filtered;
        setCaseProceedings(filtered);
        console.log('✅ Updated caseProceedings:', filtered.length);
      }
    }
  }, [allProceedings, selectedCase]);

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
          toast.success('Profile updated successfully!');
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
        ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.caseType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.referenceCategory?.toLowerCase().includes(searchQuery.toLowerCase())
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
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search reference cases..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
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
                <p className="text-[#6B7280] text-sm">{searchQuery ? 'Try adjusting your search' : 'Add reference cases for legal research'}</p>
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
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search solved cases..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
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
                isNew={isNewCase(caseItem.id || caseItem._id)}
                onRefresh={refreshCases}
                onPartyUpdate={handlePartyUpdate}
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
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search cases..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#1B262C]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              {searchQuery && (
                <span className="text-xs text-[#6B7280] whitespace-nowrap">
                  {filteredCases.length} result{filteredCases.length !== 1 ? 's' : ''}
                </span>
              )}
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
                  isNew={isNewCase(caseItem.id || caseItem._id)}
                  onRefresh={refreshCases}
                  onPartyUpdate={handlePartyUpdate}
                />
              ))}
            </div>
            
            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-base font-semibold text-[#1B262C] mb-1">No cases found</h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchQuery ? `No results found for "${searchQuery}"` : 'Try adjusting your search or filters'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="mt-3 text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
                    >
                      Clear search
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
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
              <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search cases..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#1B262C]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <span className="text-xs text-[#6B7280] whitespace-nowrap">
                  {filteredCases.length} result{filteredCases.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id || caseItem._id}
                  case={caseItem}
                  onView={() => handleView(caseItem)}
                  onEdit={() => handleEdit(caseItem)}
                  onStatusChange={updateCaseStatus}
                  onDelete={deleteCase}
                  isNew={isNewCase(caseItem.id || caseItem._id)}
                  onRefresh={refreshCases}
                  onPartyUpdate={handlePartyUpdate}
                />
              ))}
            </div>
            
            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-base font-semibold text-[#1B262C] mb-1">No cases found</h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Start by adding a new case'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch('')}
                      className="mt-3 text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors font-medium"
                    >
                      Clear search
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
  if (casesLoading || clientsLoading || eventsLoading || referencesLoading || proceedingsLoading) {
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

        {/* ============================================
            ✅ CASE DETAIL MODAL - WITH FORCE RE-RENDER KEY
            ============================================ */}
        {selectedCase && (
          <CaseDetailModal
            key={`${selectedCase._id || selectedCase.id}-${caseProceedings.length}-${refreshTrigger}`}
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
              setSelectedCase(null);
              refreshCases();
            }}
            onRefresh={() => {
              console.log('🔄 Refreshing selected case from App');
              refreshSelectedCase();
            }}
            proceedings={caseProceedings}
            onAddProceeding={handleAddProceeding}
            onUpdateProceeding={handleUpdateProceeding}
            onDeleteProceeding={handleDeleteProceeding}
            comments={caseComments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            parties={caseParties}
            onAddParty={handleAddParty}
            onUpdateParty={handleEditParty}
            onDeleteParty={handleDeleteParty}
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
            setShowEditPartyModal(false);
            setSelectedPartyForEdit(null);
          }}
          onSave={(updatedParty) => {
            console.log('📝 EditPartyModal onSave called with:', updatedParty);
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