// src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useCases } from '../hooks/useCases';
import { useClients } from '../hooks/useClients';
import { useEvents } from '../hooks/useEvents';
import { useReferences } from '../hooks/useReferences';
import { useProceedings } from '../hooks/useProceedings';
import { useComments } from '../hooks/useComments';
import { useParties } from '../hooks/useParties';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import Footer from '../components/layout/Footer';
import CaseCard from '../components/cases/CaseCard';
import TabNavigation from '../components/common/TabNavigation';
import AddCaseModal from '../components/modals/AddCaseModal';
import EditCaseModal from '../components/modals/EditCaseModal';
import CaseDetailModal from '../components/modals/CaseDetailModal';
import ClientsList from '../components/clients/ClientsList';
import CalendarView from '../components/calendar/CalendarView';
import ReportsDashboard from '../components/reports/ReportsDashboard';
import AddReferenceModal from '../components/modals/AddReferenceModal';
import DeleteReferenceModal from '../components/modals/DeleteReferenceModal';
import Profile from './Profile';
import Settings from './Settings';
import { 
  FaPlusCircle, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaGavel,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaChartBar,
  FaBook,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  // ============================================
  // HOOKS
  // ============================================
  const {
    cases,
    loading: casesLoading,
    fetchCases,
    addCase,
    updateCase,
    deleteCase,
    updateCaseStatus,
    getStats,
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
    fetchReferences,
  } = useReferences();

  const {
    proceedings,
    loading: proceedingsLoading,
    addProceeding,
    updateProceeding,
    deleteProceeding,
    fetchProceedings,
  } = useProceedings();

  const {
    comments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    fetchComments,
  } = useComments();

  const {
    parties,
    loading: partiesLoading,
    addParty,
    updateParty,
    deleteParty,
    fetchParties,
  } = useParties();

  const { user } = useAuth();

  // ============================================
  // STATE
  // ============================================
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToEdit, setCaseToEdit] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deleteReferenceModal, setDeleteReferenceModal] = useState({ isOpen: false, reference: null });

  const [modalKey, setModalKey] = useState(0);

  // ============================================
  // DEPARTMENT LIST
  // ============================================
  const departments = [
    'Agriculture Department',
    'Aquaculture and Fisheries Department',
    'Board of Revenue Department',
    'Chief Minister Inspection Team',
    'Communication and Works Department',
    'Cooperatives Department',
    'Disaster Management Department',
    'Energy Department',
    'Environment Protection and Climate Change Department',
    'Excise, Taxation and Narcotics Control Department',
    'FBT Department',
    'Finance Department',
    'Food, Safety and Consumer Protection Department',
    'Forestry and Wildlife Department',
    'Health and Population Department',
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
    'Mines and Minerals Department',
    'PITB Department',
    'Planning and Development Board',
    'Public Prosecution Department'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

  // ============================================
  // FETCH DATA ON MOUNT
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading initial data...');
        await fetchCases({ limit: 10 });
        await fetchReferences();
        await fetchProceedings();
        await fetchComments();
        await fetchParties();
        console.log('✅ All data loaded');
        console.log('📊 Proceedings count:', proceedings.length);
      } catch (error) {
        console.error('❌ Error loading data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadData();
  }, []);

  // ✅ FIX: FETCH PROCEEDINGS WHEN CASE IS SELECTED
  // ✅ FIXED: FETCH PROCEEDINGS WHEN CASE IS SELECTED
  useEffect(() => {
  if (selectedCase) {
    console.log('🔄 Case selected - fetching proceedings...');
    const fetchData = async () => {
      await fetchProceedings();
      console.log('📊 Proceedings fetch completed');
      // ✅ Wait for state to update
      setTimeout(() => {
        console.log('📊 Proceedings length after state update:', proceedings.length);
      }, 100);
    };
    fetchData();
  }
}, [selectedCase]);

  // Monitor proceedings changes
  useEffect(() => {
    console.log('📊 Dashboard - proceedings count:', proceedings.length);
  }, [proceedings]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedMonth, selectedYear, activeTab]);

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

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.caseNumber?.toLowerCase().includes(term) ||
        c.caseTitle?.toLowerCase().includes(term) ||
        c.title?.toLowerCase().includes(term) ||
        c.party?.toLowerCase().includes(term) ||
        c.plaintiff?.toLowerCase().includes(term) ||
        c.defendant?.toLowerCase().includes(term) ||
        c.department?.toLowerCase().includes(term) ||
        c.caseType?.toLowerCase().includes(term)
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(c => 
        c.department === selectedDepartment ||
        c.caseType === selectedDepartment ||
        c.nameOfCourt === selectedDepartment
      );
    }

    if (selectedMonth) {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      filtered = filtered.filter(c => {
        if (!c.nextHearingDate && !c.nextDate && !c.courtDetails?.nextDate) return false;
        const date = c.nextHearingDate || c.nextDate || c.courtDetails?.nextDate;
        const d = new Date(date);
        return d.getMonth() + 1 === monthIndex;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(c => {
        if (!c.nextHearingDate && !c.nextDate && !c.courtDetails?.nextDate) return false;
        const date = c.nextHearingDate || c.nextDate || c.courtDetails?.nextDate;
        const d = new Date(date);
        return d.getFullYear().toString() === selectedYear;
      });
    }

    return filtered;
  }, [cases, activeTab, searchQuery, selectedDepartment, selectedMonth, selectedYear]);

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

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentCases = filteredCases.slice(startIndex, endIndex);

  // ============================================
  // STATS CARDS DATA
  // ============================================
  const statsCards = [
    { 
      title: 'Total Cases', 
      value: stats.total, 
      icon: FaGavel, 
      color: 'text-[#3282B8]',
      bg: 'bg-[#3282B8]/10',
      border: 'border-[#3282B8]/20'
    },
    { 
      title: 'Active Cases', 
      value: stats.active, 
      icon: FaClock, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    { 
      title: 'Pending Review', 
      value: stats.pending, 
      icon: FaCheckCircle, 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    { 
      title: 'Closed Cases', 
      value: stats.closed, 
      icon: FaCheckCircle, 
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20'
    },
  ];

  // ============================================
  // HELPERS
  // ============================================
  const getStatusBadge = (status) => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    const s = status.toLowerCase();
    if (s.includes('active')) 
      return 'bg-green-50 text-green-700 border-green-200';
    if (s.includes('pending')) 
      return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s.includes('closed')) 
      return 'bg-gray-50 text-gray-600 border-gray-200';
    if (s.includes('adjournment')) 
      return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const getNextHearing = (c) => {
    return c.nextHearingDate || c.nextDate || c.courtDetails?.nextDate || 'N/A';
  };

  const getDepartment = (c) => {
    return c.department || c.caseType || c.nameOfCourt || 'N/A';
  };

  const getCaseTitle = (c) => {
    if (c.plaintiff && c.defendant) {
      return `${c.plaintiff} vs ${c.defendant}`;
    }
    return c.caseTitle || c.title || 'Untitled Case';
  };

  const getCaseNumber = (c) => {
    return c.caseNumber || c.id?.slice(0, 8) || 'N/A';
  };

  // ============================================
  // NAVIGATION
  // ============================================
  const handleNavigate = (page) => {
    console.log('🔄 Navigating to:', page);
    setActivePage(page);
    
    if (page === 'profile' || page === 'settings') {
      return;
    }
    
    if (['cases', 'active', 'pending', 'closed', 'solved-cases', 'reference-cases'].includes(page)) {
      setActiveTab(page === 'solved-cases' ? 'solved' : page === 'reference-cases' ? 'reference' : page === 'cases' ? 'all' : page);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      setActivePage('cases');
    }
  };

  const handleHeroSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      setActivePage('cases');
    }
  };

  // ============================================
  // CLIENT HANDLERS
  // ============================================
  const handleAddClient = async (newClient) => {
    const result = await addClient(newClient);
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

  // ============================================
  // EVENT HANDLERS
  // ============================================
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

  // ============================================
  // REFERENCE HANDLERS
  // ============================================
  const handleAddReferenceCase = async (newReference) => {
    const result = await addReference(newReference);
    if (result.success) {
      setIsAddReferenceModalOpen(false);
      await fetchReferences();
    }
    return result;
  };

  const handleDeleteReferenceClick = (reference) => {
    setDeleteReferenceModal({ isOpen: true, reference });
  };

  const handleConfirmDeleteReference = async () => {
    const ref = deleteReferenceModal.reference;
    if (ref) {
      const result = await deleteReference(ref.id || ref._id);
      if (result.success) {
        await fetchReferences();
        setDeleteReferenceModal({ isOpen: false, reference: null });
      }
    }
  };

  const handleCloseDeleteReferenceModal = () => {
    setDeleteReferenceModal({ isOpen: false, reference: null });
  };

  // ============================================
  // CASE HANDLERS
  // ============================================
  const handleEdit = (caseItem) => {
    console.log('📝 App - Opening edit modal for case:', caseItem?.id || caseItem?._id);
    setCaseToEdit(caseItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateCase = async (id, updatedData) => {
    console.log('📝 App - Updating case:', id);
    const result = await updateCase(id, updatedData);
    if (result.success) {
      setCaseToEdit(null);
      setIsEditModalOpen(false);
    }
    return result;
  };

  // ============================================
  // PROCEEDINGS HANDLERS
  // ============================================
  const handleAddProceeding = async (newProceeding) => {
    console.log('📝 Dashboard - handleAddProceeding called with:', newProceeding);
    
    if (!newProceeding.caseId) {
      console.error('❌ Case ID is required');
      toast.error('Please select a case');
      return { success: false, error: 'Case ID is required' };
    }
    
    try {
      const result = await addProceeding(newProceeding);
      console.log('📝 Result from addProceeding:', result);
      
      if (result && result.success) {
        await fetchProceedings();
        setModalKey(prev => prev + 1);
        toast.success('Proceeding added successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to add proceeding');
        return result;
      }
    } catch (error) {
      console.error('❌ Error adding proceeding:', error);
      toast.error(error.message || 'Failed to add proceeding');
      return { success: false, error: error.message };
    }
  };

  const handleUpdateProceeding = async (id, updatedData) => {
    console.log('📝 Dashboard - handleUpdateProceeding called with:', id, updatedData);
    try {
      const result = await updateProceeding(id, updatedData);
      if (result && result.success) {
        await fetchProceedings();
        setModalKey(prev => prev + 1);
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
    console.log('🗑️ Dashboard - handleDeleteProceeding called with:', id);
    try {
      const result = await deleteProceeding(id);
      if (result && result.success) {
        await fetchProceedings();
        setModalKey(prev => prev + 1);
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
  // COMMENT HANDLERS
  // ============================================
  const handleAddComment = async (newComment) => {
    console.log('📝 Dashboard - handleAddComment called with:', newComment);
    
    if (!newComment.caseId) {
      console.error('❌ Case ID is required');
      toast.error('Please select a case');
      return { success: false, error: 'Case ID is required' };
    }
    
    try {
      const result = await addComment(newComment);
      console.log('📝 Result from addComment:', result);
      
      if (result && result.success) {
        await fetchComments();
        setModalKey(prev => prev + 1);
        toast.success('Comment added successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to add comment');
        return result;
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
      return { success: false, error: error.message };
    }
  };

  const handleUpdateComment = async (id, updatedData) => {
    console.log('📝 Dashboard - handleUpdateComment called with:', id, updatedData);
    try {
      const result = await updateComment(id, updatedData);
      if (result && result.success) {
        await fetchComments();
        setModalKey(prev => prev + 1);
        toast.success('Comment updated successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to update comment');
        return result;
      }
    } catch (error) {
      console.error('❌ Error updating comment:', error);
      toast.error(error.message || 'Failed to update comment');
      return { success: false, error: error.message };
    }
  };

  const handleDeleteComment = async (id) => {
    console.log('🗑️ Dashboard - handleDeleteComment called with:', id);
    try {
      const result = await deleteComment(id);
      if (result && result.success) {
        await fetchComments();
        setModalKey(prev => prev + 1);
        toast.success('Comment deleted successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to delete comment');
        return result;
      }
    } catch (error) {
      console.error('❌ Error deleting comment:', error);
      toast.error(error.message || 'Failed to delete comment');
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // PARTY HANDLERS
  // ============================================
  const handleAddParty = async (newParty) => {
    console.log('📝 Dashboard - handleAddParty called with:', newParty);
    
    if (!newParty.caseId) {
      console.error('❌ Case ID is required');
      toast.error('Please select a case');
      return { success: false, error: 'Case ID is required' };
    }
    
    try {
      const result = await addParty(newParty);
      console.log('📝 Result from addParty:', result);
      
      if (result && result.success) {
        await fetchParties();
        setModalKey(prev => prev + 1);
        toast.success('Party added successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to add party');
        return result;
      }
    } catch (error) {
      console.error('❌ Error adding party:', error);
      toast.error(error.message || 'Failed to add party');
      return { success: false, error: error.message };
    }
  };

  const handleUpdateParty = async (id, updatedData) => {
    console.log('📝 Dashboard - handleUpdateParty called with:', id, updatedData);
    try {
      const result = await updateParty(id, updatedData);
      if (result && result.success) {
        await fetchParties();
        setModalKey(prev => prev + 1);
        toast.success('Party updated successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to update party');
        return result;
      }
    } catch (error) {
      console.error('❌ Error updating party:', error);
      toast.error(error.message || 'Failed to update party');
      return { success: false, error: error.message };
    }
  };

  const handleDeleteParty = async (id) => {
    console.log('🗑️ Dashboard - handleDeleteParty called with:', id);
    try {
      const result = await deleteParty(id);
      if (result && result.success) {
        await fetchParties();
        setModalKey(prev => prev + 1);
        toast.success('Party deleted successfully!');
        return result;
      } else {
        toast.error(result?.error || 'Failed to delete party');
        return result;
      }
    } catch (error) {
      console.error('❌ Error deleting party:', error);
      toast.error(error.message || 'Failed to delete party');
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // REFRESH HANDLER
  // ============================================
  const handleRefresh = async () => {
    console.log('🔄 Refreshing data from Dashboard');
    await Promise.all([
      fetchCases({ limit: 10 }),
      fetchProceedings(),
      fetchReferences(),
      fetchComments(),
      fetchParties(),
    ]);
    console.log('✅ All data refreshed');
    setModalKey(prev => prev + 1);
  };

  // ============================================
  // REGISTER GLOBAL HELPERS
  // ============================================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__handleRefresh = handleRefresh;
      window.__handleAddProceeding = handleAddProceeding;
      window.__handleAddComment = handleAddComment;
      window.__handleAddParty = handleAddParty;
      window.__handleFetchProceedings = fetchProceedings;
      window.__handleRefreshSelectedCase = handleRefresh;
      window.__handleFetchCaseById = fetchCases;
      window.__proceedings = proceedings;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__handleRefresh;
        delete window.__handleAddProceeding;
        delete window.__handleAddComment;
        delete window.__handleAddParty;
        delete window.__handleFetchProceedings;
        delete window.__handleRefreshSelectedCase;
        delete window.__handleFetchCaseById;
        delete window.__proceedings;
      }
    };
  }, [handleRefresh, handleAddProceeding, handleAddComment, handleAddParty, fetchProceedings, fetchCases, proceedings]);

  // ============================================
  // RENDER REFERENCE CASES
  // ============================================
  const renderReferenceCases = () => {
    const filteredReferences = references.filter(ref =>
      ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.citation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.court?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.practiceArea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#1B262C]">Reference Cases</h2>
              <span className="px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-xs font-medium border border-[#8B5CF6]/20">
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
        
        {referencesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0F4C75] border-t-transparent mx-auto"></div>
            <p className="text-[#6B7280] mt-4">Loading references...</p>
          </div>
        ) : filteredReferences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReferences.map((ref) => (
              <div key={ref.id || ref._id} className="bg-white rounded-xl border border-[#BBE1FA] p-5 hover:shadow-premium hover:border-[#8B5CF6]/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1B262C] text-base leading-tight truncate">
                      {ref.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#6B7280] font-mono">#{ref.caseNumber}</span>
                      <span className="text-xs px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full border border-[#8B5CF6]/20">
                        {ref.practiceArea || 'General'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-3 ${
                    ref.verdict === 'Upheld' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                    ref.verdict === 'Reversed' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                    ref.verdict === 'Modified' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                    'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20'
                  }`}>
                    {ref.verdict || 'Pending'}
                  </span>
                </div>
                
                <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">{ref.description || ref.summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {ref.tags?.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-[#F0F4F8] text-[#6B7280] rounded-full border border-[#BBE1FA]/30">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-[#BBE1FA]/50">
                  <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <FaGavel className="text-[10px] text-[#8B5CF6]" />
                      {ref.court || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px] text-[#8B5CF6]" />
                      {ref.dateDecided ? new Date(ref.dateDecided).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toast.info(`📋 Viewing: ${ref.title}`)} 
                      className="p-1.5 text-[#1B262C] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-all"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button 
                      onClick={() => handleDeleteReferenceClick(ref)} 
                      className="p-1.5 text-[#EF4444] hover:text-[#EF4444]/80 hover:bg-[#EF4444]/10 rounded-lg transition-all"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-[#BBE1FA]">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-[#1B262C] mb-1">No reference cases found</h3>
              <p className="text-[#6B7280] text-sm">
                {searchQuery ? 'Try adjusting your search' : 'Add reference cases for legal research'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsAddReferenceModalOpen(true)}
                  className="mt-4 px-4 py-2 btn-primary rounded-lg text-sm font-medium"
                >
                  <FaPlusCircle className="inline mr-2" /> Add First Reference
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER DASHBOARD HOME
  // ============================================
  const renderDashboardHome = () => {
    if (isInitialLoad || casesLoading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border ${stat.border} p-4 hover:shadow-premium transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-[#1B262C] mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`${stat.color} text-lg`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CASES TABLE ===== */}
        <div className="bg-white rounded-2xl border border-[#BBE1FA]/40 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B262C] to-[#0F4C75] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaFileAlt className="text-[#3282B8]" />
              Civil Cases
            </h2>
            <p className="text-white/60 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Search & Tabs */}
          <div className="px-6 pt-4 pb-2 bg-[#F8FAFC] border-b border-[#BBE1FA]/30">
            {/* Search */}
            <div className="relative mb-3">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
              <input
                type="text"
                placeholder="Search cases by number, title, party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-md shadow-[#0F4C75]/25'
                      : 'text-[#6B7280] bg-white hover:bg-gray-50 border border-[#BBE1FA]/40'
                  }`}
                >
                  {tab.label} <span className="ml-1 text-xs opacity-70">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 bg-white border-b border-[#BBE1FA]/30 flex flex-wrap items-center gap-3">
            {/* Department */}
            <div className="relative">
              <button
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#BBE1FA] rounded-lg text-sm text-[#1B262C] hover:border-[#3282B8] transition-all duration-200"
              >
                <FaFilter className="text-[#9CA3AF] text-xs" />
                <span className="truncate max-w-[120px]">
                  {selectedDepartment || 'Department'}
                </span>
                <FaChevronDown className={`text-[#9CA3AF] text-xs transition-transform duration-200 ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDepartmentDropdown && (
                <div className="absolute z-10 top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-[#BBE1FA] rounded-xl shadow-lg">
                  <div 
                    className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30"
                    onClick={() => {
                      setSelectedDepartment('');
                      setShowDepartmentDropdown(false);
                    }}
                  >
                    All Departments
                  </div>
                  {departments.map((dept) => (
                    <div 
                      key={dept}
                      className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30 last:border-0"
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setShowDepartmentDropdown(false);
                      }}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Month */}
            <div className="relative">
              <button
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#BBE1FA] rounded-lg text-sm text-[#1B262C] hover:border-[#3282B8] transition-all duration-200"
              >
                <FaCalendarAlt className="text-[#9CA3AF] text-xs" />
                <span className="truncate max-w-[100px]">
                  {selectedMonth || 'Month'}
                </span>
                <FaChevronDown className={`text-[#9CA3AF] text-xs transition-transform duration-200 ${showMonthDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showMonthDropdown && (
                <div className="absolute z-10 top-full left-0 mt-1 w-40 max-h-48 overflow-y-auto bg-white border border-[#BBE1FA] rounded-xl shadow-lg">
                  <div 
                    className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30"
                    onClick={() => {
                      setSelectedMonth('');
                      setShowMonthDropdown(false);
                    }}
                  >
                    All Months
                  </div>
                  {months.map((month) => (
                    <div 
                      key={month}
                      className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30 last:border-0"
                      onClick={() => {
                        setSelectedMonth(month);
                        setShowMonthDropdown(false);
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year */}
            <div className="relative">
              <button
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#BBE1FA] rounded-lg text-sm text-[#1B262C] hover:border-[#3282B8] transition-all duration-200"
              >
                <span className="truncate max-w-[80px]">
                  {selectedYear || 'Year'}
                </span>
                <FaChevronDown className={`text-[#9CA3AF] text-xs transition-transform duration-200 ${showYearDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showYearDropdown && (
                <div className="absolute z-10 top-full left-0 mt-1 w-28 max-h-48 overflow-y-auto bg-white border border-[#BBE1FA] rounded-xl shadow-lg">
                  <div 
                    className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30"
                    onClick={() => {
                      setSelectedYear('');
                      setShowYearDropdown(false);
                    }}
                  >
                    All Years
                  </div>
                  {years.map((year) => (
                    <div 
                      key={year}
                      className="px-4 py-2 hover:bg-[#F0F4F8] cursor-pointer text-sm text-[#1B262C] border-b border-[#BBE1FA]/30 last:border-0"
                      onClick={() => {
                        setSelectedYear(year);
                        setShowYearDropdown(false);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedDepartment || selectedMonth || selectedYear || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('');
                  setSelectedMonth('');
                  setSelectedYear('');
                  setActiveTab('all');
                }}
                className="px-3 py-2 text-sm font-medium text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-lg transition-all duration-200 whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Table Controls */}
          <div className="px-6 py-3 bg-white border-b border-[#BBE1FA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280]">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-[#BBE1FA] rounded-lg text-sm text-[#1B262C] focus:outline-none focus:ring-2 focus:ring-[#3282B8] bg-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-[#6B7280]">entries</span>
            </div>
            <div className="text-sm text-[#6B7280]">
              Showing {filteredCases.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} entries
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {casesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#3282B8] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0F4C75] border-b border-[#BBE1FA]/40">
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-white uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-white uppercase tracking-wider">Case #</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-white uppercase tracking-wider">Case Title</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-white uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-white uppercase tracking-wider">Next Hearing</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-white uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold text-white uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length > 0 ? (
                    currentCases.map((c, index) => (
                      <tr 
                        key={c.id || c._id || index} 
                        className="border-b border-[#BBE1FA]/20 hover:bg-[#F0F4F8] transition-all cursor-pointer"
                        onClick={() => setSelectedCase(c)}
                      >
                        <td className="px-4 py-3 text-center text-sm text-[#6B7280]">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#0F4C75]">
                          #{getCaseNumber(c)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#1B262C]">
                          {getCaseTitle(c)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6B7280] max-w-[200px] truncate">
                          {getDepartment(c)}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-[#1B262C] font-medium">
                          {formatDate(getNextHearing(c))}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-medium border ${getStatusBadge(c.status)}`}>
                            {c.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              className="p-1.5 text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
                              title="View Case"
                              onClick={() => setSelectedCase(c)}
                            >
                              <FaEye className="text-sm" />
                            </button>
                            <button 
                              className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                              title="Edit Case"
                              onClick={() => handleEdit(c)}
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button 
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete Case"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this case?')) {
                                  deleteCase(c.id || c._id);
                                }
                              }}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center text-[#6B7280]">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-sm">No cases found</p>
                        <p className="text-xs mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredCases.length > 0 && (
            <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#BBE1FA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-[#6B7280]">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm text-[#6B7280] border border-[#BBE1FA] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#0F4C75] text-white'
                          : 'text-[#6B7280] hover:bg-white border border-transparent hover:border-[#BBE1FA]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm text-[#6B7280] border border-[#BBE1FA] rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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

    if (activePage === 'reference-cases') {
      return renderReferenceCases();
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
                onView={() => setSelectedCase(caseItem)}
                onEdit={() => handleEdit(caseItem)}
                onStatusChange={updateCaseStatus}
                onDelete={deleteCase}
                isNew={isNewCase(caseItem.id || caseItem._id)}
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

    if (activePage === 'dashboard') {
      return renderDashboardHome();
    }

    switch (activePage) {
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
                  onView={() => setSelectedCase(caseItem)}
                  onEdit={() => handleEdit(caseItem)}
                  onStatusChange={updateCaseStatus}
                  onDelete={deleteCase}
                  isNew={isNewCase(caseItem.id || caseItem._id)}
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
      
      case 'clients':
        return (
          <ClientsList 
            clients={clients}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
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
  if (isInitialLoad || casesLoading || clientsLoading || eventsLoading || referencesLoading || proceedingsLoading || commentsLoading || partiesLoading) {
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
  // RENDER
  // ============================================
  return (
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
        onLogout={() => {
          window.location.href = '/login';
        }}
      />

      {activePage === 'dashboard' && (
        <HeroSection 
          stats={stats} 
          onSearch={handleHeroSearch}
        />
      )}

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
      />

      {/* ===== FIXED: CaseDetailModal - Only render when case exists ===== */}
      {console.log('🔴🔴🔴 BEFORE MODAL - proceedings length:', proceedings.length)}
      {console.log('🔴🔴🔴 BEFORE MODAL - selectedCase:', selectedCase)}

      {selectedCase && (
        <CaseDetailModal
          key={modalKey}
          isOpen={!!selectedCase}
          case={selectedCase}
          onClose={() => {
            console.log('🔴 Closing case detail modal');
            setSelectedCase(null);
          }}
          onStatusChange={updateCaseStatus}
          onEdit={(caseItem) => {
            handleEdit(caseItem);
          }}
          onDelete={deleteCase}
          onDeleteComplete={() => {
            setSelectedCase(null);
          }}
          onRefresh={handleRefresh}
          // ===== PROCEEDINGS PROPS =====
          proceedings={proceedings}
          onAddProceeding={handleAddProceeding}
          onUpdateProceeding={handleUpdateProceeding}
          onDeleteProceeding={handleDeleteProceeding}
          // ===== COMMENTS PROPS =====
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          // ===== PARTIES PROPS =====
          parties={parties}
          onAddParty={handleAddParty}
          onUpdateParty={handleUpdateParty}
          onDeleteParty={handleDeleteParty}
        />
      )}

      <AddReferenceModal
        isOpen={isAddReferenceModalOpen}
        onClose={() => setIsAddReferenceModalOpen(false)}
        onAdd={handleAddReferenceCase}
      />

      <DeleteReferenceModal
        isOpen={deleteReferenceModal.isOpen}
        reference={deleteReferenceModal.reference}
        onClose={handleCloseDeleteReferenceModal}
        onConfirm={handleConfirmDeleteReference}
      />
    </div>
  );
};

export default Dashboard;