// src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useCases } from '../hooks/useCases';
import { useClients } from '../hooks/useClients';
import { useEvents } from '../hooks/useEvents';
import { useReferences } from '../hooks/useReferences';
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
  FaBook
} from 'react-icons/fa';

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

  const { user } = useAuth();

  // ============================================
  // STATE
  // ============================================
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddReferenceModalOpen, setIsAddReferenceModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToEdit, setCaseToEdit] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deleteReferenceModal, setDeleteReferenceModal] = useState({ isOpen: false, reference: null });

  // ============================================
  // FETCH DATA ON MOUNT
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      await fetchCases({ limit: 10 });
      await fetchReferences();
      setIsInitialLoad(false);
    };
    loadData();
  }, []);

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
    { 
      title: 'Clients', 
      value: clients.length, 
      icon: FaUsers, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    { 
      title: 'Events', 
      value: events.length, 
      icon: FaCalendarAlt, 
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    { 
      title: 'References', 
      value: references.length, 
      icon: FaBook, 
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/10',
      border: 'border-[#8B5CF6]/20'
    },
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

  window.__editCase = (caseItem) => {
    console.log('🌐 Global edit called for case:', caseItem);
    setCaseToEdit(caseItem);
    setIsEditModalOpen(true);
  };

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-[#1a1a2e]/50 rounded-xl border border-[rgba(255,255,255,0.05)] p-4 animate-pulse">
                <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700/50 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-[#1a1a2e]/50 rounded-xl border border-[rgba(255,255,255,0.05)] p-6">
            <div className="h-6 bg-gray-700/50 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700/30 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B262C]">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-[#6B7280] mt-1">
              Here's what's happening with your cases today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <span className="text-sm text-[#6B7280]">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white rounded-xl border border-[#BBE1FA] p-4 hover:shadow-premium transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#3282B8]/10 flex items-center justify-center">
              <FaPlusCircle className="text-[#3282B8] text-xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[#1B262C]">New Case</h3>
              <p className="text-xs text-[#6B7280]">Add a new case</p>
            </div>
          </button>
          <button
            onClick={() => handleNavigate('clients')}
            className="bg-white rounded-xl border border-[#BBE1FA] p-4 hover:shadow-premium transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[#1B262C]">Manage Clients</h3>
              <p className="text-xs text-[#6B7280]">View all clients</p>
            </div>
          </button>
          <button
            onClick={() => handleNavigate('calendar')}
            className="bg-white rounded-xl border border-[#BBE1FA] p-4 hover:shadow-premium transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <FaCalendarAlt className="text-rose-500 text-xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[#1B262C]">Calendar</h3>
              <p className="text-xs text-[#6B7280]">View upcoming events</p>
            </div>
          </button>
          <button
            onClick={() => handleNavigate('reference-cases')}
            className="bg-white rounded-xl border border-[#BBE1FA] p-4 hover:shadow-premium transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <FaBook className="text-[#8B5CF6] text-xl" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-[#1B262C]">References</h3>
              <p className="text-xs text-[#6B7280]">View reference cases</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1B262C]">Recent Cases</h2>
            <button
              onClick={() => handleNavigate('cases')}
              className="text-sm text-[#0F4C75] hover:text-[#3282B8] transition-colors"
            >
              View All →
            </button>
          </div>
          {cases.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {cases.slice(0, 5).map((caseItem) => (
                <div
                  key={caseItem.id || caseItem._id}
                  className="flex items-center justify-between p-3 bg-[#F0F4F8] rounded-lg hover:bg-[#D4AF37]/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#3282B8]"></div>
                    <div>
                      <p className="text-sm font-medium text-[#1B262C]">
                        {caseItem.caseTitle || caseItem.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {caseItem.caseNumber || 'No number'} • {caseItem.status || 'active'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    caseItem.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                    caseItem.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                    'bg-gray-500/10 text-gray-600'
                  }`}>
                    {caseItem.status || 'active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#6B7280]">
              <p>No cases yet. Create your first case!</p>
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
  if (isInitialLoad || casesLoading || clientsLoading || eventsLoading || referencesLoading) {
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

      <CaseDetailModal
        isOpen={!!selectedCase}
        case={selectedCase}
        onClose={() => setSelectedCase(null)}
        onStatusChange={updateCaseStatus}
        onEdit={handleEdit}
      />

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