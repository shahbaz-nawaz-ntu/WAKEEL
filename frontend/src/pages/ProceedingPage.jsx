// frontend/src/pages/ProceedingPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  FaTimes, 
  FaFilePdf, 
  FaDownload, 
  FaEye, 
  FaUser,
  FaFileAlt,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUpload,
  FaGavel,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaUserFriends,
  FaBriefcase,
  FaBookOpen,
  FaSave,
  FaTimes as FaTimesIcon,
  FaFolderOpen,
  FaSpinner,
  FaFileWord,
  FaFileImage,
  FaFileExcel,
  FaFileArchive,
  FaFile,
  FaFileCode,
  FaFilePowerpoint,
  FaFileVideo
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useProceedings } from '../hooks/useProceedings';

const ProceedingPage = ({ isOpen, onClose, caseItem }) => {
  const {
    proceedings,
    loading,
    fetchProceedingsByCase,
    addProceeding: addProceedingToBackend,
    updateProceeding: updateProceedingInBackend,
    deleteProceeding: deleteProceedingFromBackend,
    uploadDocument,
    deleteDocument,
    viewDocument
  } = useProceedings();

  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('proceedings');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [documents, setDocuments] = useState({
    petitioner: [],
    research: [],
    defendant: [],
  });

  // ============================================
  // DOCUMENT VIEW MODAL STATE
  // ============================================
  const [showDocViewModal, setShowDocViewModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);

  // ============================================
  // DELETE CONFIRMATION STATE
  // ============================================
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDocTarget, setDeleteDocTarget] = useState(null);
  const [showDocDeleteConfirm, setShowDocDeleteConfirm] = useState(false);

  // ============================================
  // GET CASE ID
  // ============================================
  const getCaseId = () => {
    if (!caseItem) return null;
    return caseItem._id || caseItem.id || caseItem.caseId || null;
  };

  // ============================================
  // FETCH PROCEEDINGS ON MOUNT
  // ============================================
  useEffect(() => {
    if (isOpen && caseItem) {
      const caseId = getCaseId();
      if (caseId) {
        fetchProceedingsByCase(caseId);
      }
    }
  }, [isOpen, caseItem]);

  // ============================================
  // UPDATE DOCUMENTS
  // ============================================
  useEffect(() => {
    if (proceedings.length > 0) {
      const first = proceedings[0];
      if (first && first.documents) {
        setDocuments({
          petitioner: first.documents.petitioner || [],
          research: first.documents.research || [],
          defendant: first.documents.defendant || [],
        });
      }
    }
  }, [proceedings]);

  // ============================================
  // HANDLE ADD PROCEEDING
  // ============================================
  const handleAddProceeding = async (newProceeding) => {
    setIsLoading(true);
    try {
      const caseId = getCaseId();
      if (!caseId) {
        toast.error('Case ID not found');
        setIsLoading(false);
        return;
      }
      
      const data = {
        ...newProceeding,
        caseId: caseId,
        date: newProceeding.date || new Date().toISOString().split('T')[0],
        status: newProceeding.status || 'Scheduled',
        type: newProceeding.type || 'Hearing',
      };
      
      const result = await addProceedingToBackend(data);
      
      if (result.success) {
        toast.success('Proceeding added successfully! ✅');
        setShowAddModal(false);
        fetchProceedingsByCase(caseId);
      } else {
        toast.error(result.error || 'Failed to add proceeding');
      }
    } catch (error) {
      toast.error('Failed to add proceeding');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // OTHER HANDLERS
  // ============================================
  const handleEditProceeding = async (updated) => {
    setIsLoading(true);
    try {
      const result = await updateProceedingInBackend(updated.id || updated._id, updated);
      if (result.success) {
        toast.success('Proceeding updated! 📝');
        setShowEditModal(false);
        setSelectedProceeding(null);
        const caseId = getCaseId();
        if (caseId) fetchProceedingsByCase(caseId);
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // DELETE HANDLER WITH CONFIRMATION
  // ============================================
  const handleDeleteClick = (proceeding) => {
    setDeleteTarget(proceeding);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      setIsLoading(true);
      try {
        const result = await deleteProceedingFromBackend(deleteTarget.id || deleteTarget._id);
        if (result.success) {
          toast.success('Proceeding deleted! 🗑️');
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
          const caseId = getCaseId();
          if (caseId) fetchProceedingsByCase(caseId);
        } else {
          toast.error(result.error || 'Failed to delete');
        }
      } catch (error) {
        toast.error('Failed to delete');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  // ============================================
  // DOCUMENT DELETE HANDLERS
  // ============================================
  const handleDocDeleteClick = (docName, section) => {
    setDeleteDocTarget({ name: docName, section: section });
    setShowDocDeleteConfirm(true);
  };

  const handleConfirmDocDelete = async () => {
    if (deleteDocTarget) {
      const { name, section } = deleteDocTarget;
      await handleDeleteDocument(section, name);
      setShowDocDeleteConfirm(false);
      setDeleteDocTarget(null);
    }
  };

  const handleCancelDocDelete = () => {
    setShowDocDeleteConfirm(false);
    setDeleteDocTarget(null);
  };

  // ============================================
  // VIEW HANDLER
  // ============================================
  const handleViewProceeding = (proceeding) => {
    toast.success(`📋 Viewing: ${proceeding.title}`);
    setSelectedProceeding(proceeding);
  };

  // ============================================
  // DOCUMENT HANDLERS
  // ============================================
  const handleViewDocument = (docName, section) => {
    const id = proceedings[0]?.id || proceedings[0]?._id;
    if (!id) { 
      toast.error('No proceeding found'); 
      return; 
    }
    const idx = documents[section].findIndex(d => d === docName);
    if (idx === -1) { 
      toast.error('Document not found'); 
      return; 
    }
    
    setViewingDocument({
      name: docName,
      section: section,
      index: idx,
      proceedingId: id,
      size: 'N/A',
      date: new Date().toLocaleDateString(),
      type: docName.split('.').pop().toUpperCase()
    });
    setShowDocViewModal(true);
    toast.info('📄 Viewing document details');
  };

  const handleDownloadDocument = async (docName, section) => {
    const id = proceedings[0]?.id || proceedings[0]?._id;
    if (!id) { 
      toast.error('No proceeding found'); 
      return; 
    }
    const idx = documents[section].findIndex(d => d === docName);
    if (idx === -1) { 
      toast.error('Document not found'); 
      return; 
    }
    
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }
    
    try {
      const loadingToast = toast.loading('Downloading document...');
      
      const url = `https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/proceedings/${id}/documents/${section}/${idx}/file?token=${token}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error('Failed to download document');
        return;
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.dismiss(loadingToast);
      toast.success('📥 Document downloaded!');
    } catch (error) {
      console.error('❌ Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDeleteDocument = async (section, docName) => {
    const id = proceedings[0]?.id || proceedings[0]?._id;
    if (!id) return;
    try {
      const idx = documents[section].findIndex(d => d === docName);
      if (idx === -1) { toast.error('Document not found'); return; }
      const result = await deleteDocument(id, section, idx);
      if (result.success) {
        toast.success('Document deleted! 🗑️');
        const caseId = getCaseId();
        if (caseId) fetchProceedingsByCase(caseId);
      } else {
        toast.error(result.error || 'Delete failed');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleUploadDocument = async (section, file) => {
    const id = proceedings[0]?.id || proceedings[0]?._id;
    if (!id) {
      toast.error('Add a proceeding first');
      return;
    }
    setUploadingDoc(true);
    try {
      const result = await uploadDocument(id, section, file);
      if (result.success) {
        toast.success(`Document uploaded to ${section}! 📄`);
        const caseId = getCaseId();
        if (caseId) fetchProceedingsByCase(caseId);
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingDoc(false);
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status) => {
    const colors = {
      Completed: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
      'In Progress': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      Scheduled: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
      Adjourned: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
      Cancelled: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
      Rescheduled: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    };
    return colors[status] || colors.Scheduled;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Completed: <FaCheckCircle className="text-[#22C55E]" />,
      'In Progress': <FaClock className="text-[#F59E0B]" />,
      Scheduled: <FaCalendarAlt className="text-[#3B82F6]" />,
      Adjourned: <FaClock className="text-[#8B5CF6]" />,
      Cancelled: <FaTimesIcon className="text-[#EF4444]" />,
      Rescheduled: <FaClock className="text-[#F59E0B]" />,
    };
    return icons[status] || <FaClock className="text-[#6B7280]" />;
  };

  const getTypeIcon = (type) => {
    const icons = {
      Petitioner: <FaUser className="text-[#0F4C75]" />,
      Defendant: <FaUsers className="text-[#EF4444]" />,
      Hearing: <FaGavel className="text-[#8B5CF6]" />,
      Trial: <FaGavel className="text-[#8B5CF6]" />,
      Mediation: <FaUserFriends className="text-[#0F4C75]" />,
      Arbitration: <FaGavel className="text-[#0F4C75]" />,
      Conference: <FaUsers className="text-[#0F4C75]" />,
      Filing: <FaFileAlt className="text-[#0F4C75]" />,
      Order: <FaFileAlt className="text-[#0F4C75]" />,
      Judgment: <FaGavel className="text-[#8B5CF6]" />,
    };
    return icons[type] || <FaFileAlt className="text-[#6B7280]" />;
  };

  const getTypeLabel = (type) => type || 'Hearing';
  
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } 
    catch { return date; }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconClass = "text-3xl";
    if (ext === 'pdf') return <FaFilePdf className={`${iconClass} text-red-500`} />;
    if (ext === 'doc' || ext === 'docx') return <FaFileWord className={`${iconClass} text-blue-500`} />;
    if (ext === 'xls' || ext === 'xlsx') return <FaFileExcel className={`${iconClass} text-green-500`} />;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return <FaFileImage className={`${iconClass} text-purple-500`} />;
    if (ext === 'zip' || ext === 'rar') return <FaFileArchive className={`${iconClass} text-yellow-500`} />;
    if (ext === 'ppt' || ext === 'pptx') return <FaFilePowerpoint className={`${iconClass} text-orange-500`} />;
    if (ext === 'mp4' || ext === 'avi' || ext === 'mov') return <FaFileVideo className={`${iconClass} text-pink-500`} />;
    if (ext === 'js' || ext === 'jsx' || ext === 'html' || ext === 'css') return <FaFileCode className={`${iconClass} text-blue-400`} />;
    return <FaFile className={`${iconClass} text-gray-500`} />;
  };

  const getFileColor = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'border-red-500 bg-red-50';
    if (ext === 'doc' || ext === 'docx') return 'border-blue-500 bg-blue-50';
    if (ext === 'xls' || ext === 'xlsx') return 'border-green-500 bg-green-50';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return 'border-purple-500 bg-purple-50';
    if (ext === 'zip' || ext === 'rar') return 'border-yellow-500 bg-yellow-50';
    if (ext === 'ppt' || ext === 'pptx') return 'border-orange-500 bg-orange-50';
    if (ext === 'mp4' || ext === 'avi' || ext === 'mov') return 'border-pink-500 bg-pink-50';
    return 'border-gray-300 bg-gray-50';
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading || isLoading) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC] z-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-[#0F4C75] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  const caseId = getCaseId();

  const formattedDocuments = {
    petitioner: documents.petitioner.map((doc, i) => ({ id: i, name: doc, size: 'N/A', date: new Date().toLocaleDateString() })),
    research: documents.research.map((doc, i) => ({ id: i, name: doc, size: 'N/A', date: new Date().toLocaleDateString() })),
    defendant: documents.defendant.map((doc, i) => ({ id: i, name: doc, size: 'N/A', date: new Date().toLocaleDateString() })),
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#F8FAFC] z-50 flex flex-col">
        {/* ===== HEADER ===== */}
        <div className="w-full px-6 py-4 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
          <div className="flex items-center justify-between w-full pt-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C75]/25">
                <FaFolderOpen className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1B262C]">Proceedings</h2>
                <p className="text-sm text-[#6B7280] flex items-center gap-2">
                  <span>{caseItem?.caseTitle || caseItem?.title || 'Case'}</span>
                  <span className="text-[#BBE1FA]">|</span>
                  <span className="font-mono text-[#0F4C75]">Case #{caseId || 'N/A'}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#3282B8]/10 rounded-xl">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="w-full px-6 py-3 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0">
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('proceedings')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'proceedings' ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25' : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'}`}>
              <FaGavel className="inline mr-2 text-sm" /> Proceedings ({proceedings.length})
            </button>
            <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'documents' ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25' : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'}`}>
              <FaFilePdf className="inline mr-2 text-sm" /> Documents ({documents.petitioner.length + documents.research.length + documents.defendant.length})
            </button>
            <button onClick={() => setActiveTab('summary')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'summary' ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25' : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'}`}>
              <FaInfoCircle className="inline mr-2 text-sm" /> Summary
            </button>
          </div>
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F8FAFC] p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* ============================================
                PROCEEDINGS TAB
            ============================================ */}
            {activeTab === 'proceedings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#1B262C]">{proceedings.length}</p>
                    <p className="text-sm text-[#6B7280]">Total</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#22C55E]">{proceedings.filter(p => p.status === 'Completed').length}</p>
                    <p className="text-sm text-[#6B7280]">Completed</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#F59E0B]">{proceedings.filter(p => p.status === 'Scheduled' || p.status === 'In Progress').length}</p>
                    <p className="text-sm text-[#6B7280]">Active</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#0F4C75]">{documents.petitioner.length + documents.research.length + documents.defendant.length}</p>
                    <p className="text-sm text-[#6B7280]">Documents</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      console.log('🔘 Add Proceeding clicked');
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm font-medium"
                  >
                    <FaPlus className="text-sm" />
                    Add Proceeding
                  </button>
                </div>

                {proceedings.length > 0 ? (
                  <div className="space-y-3">
                    {proceedings.map((proceeding) => (
                      <div key={proceeding.id || proceeding._id} className="border border-[#BBE1FA]/40 rounded-xl overflow-hidden shadow-sm bg-white">
                        <button
                          onClick={() => toggleSection(`proceeding-${proceeding.id || proceeding._id}`)}
                          className="w-full flex items-center justify-between p-4 bg-[#F0F4F8] hover:bg-[#3282B8]/5"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-[#3282B8]/10">{getTypeIcon(proceeding.type)}</div>
                            <div className="text-left">
                              <p className="font-medium text-[#1B262C]">{proceeding.title}</p>
                              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                                <span className="flex items-center gap-1">
                                  <FaCalendarAlt className="text-[10px] text-[#0F4C75]" />
                                  {proceeding.date ? new Date(proceeding.date).toLocaleDateString() : 'N/A'}
                                </span>
                                {proceeding.time && <span className="flex items-center gap-1"><FaClock className="text-[10px] text-[#0F4C75]" />{proceeding.time}</span>}
                                <span className="text-xs px-2 py-0.5 bg-[#F0F4F8] text-[#6B7280] rounded-full border border-[#BBE1FA]/30">{getTypeLabel(proceeding.type)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(proceeding.status)}`}>
                              {getStatusIcon(proceeding.status)} {proceeding.status || 'Scheduled'}
                            </span>
                            {expandedSection === `proceeding-${proceeding.id || proceeding._id}` ? 
                              <FaChevronDown className="text-[#9CA3AF]" /> : <FaChevronRight className="text-[#9CA3AF]" />
                            }
                          </div>
                        </button>
                        
                        {expandedSection === `proceeding-${proceeding.id || proceeding._id}` && (
                          <div className="p-4 bg-white border-t border-[#BBE1FA]/30">
                            <div className="space-y-3">
                              {proceeding.description && <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20"><p className="text-sm text-[#1B262C]">{proceeding.description}</p></div>}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {proceeding.location && <div className="p-2.5 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20"><p className="text-[10px] text-[#6B7280] uppercase">Location</p><p className="text-sm font-medium text-[#1B262C]">{proceeding.location}</p></div>}
                                {proceeding.judge && <div className="p-2.5 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20"><p className="text-[10px] text-[#6B7280] uppercase">Judge</p><p className="text-sm font-medium text-[#1B262C]">{proceeding.judge}</p></div>}
                              </div>
                              <div className="flex gap-2 pt-2 flex-wrap">
                                <button onClick={() => handleViewProceeding(proceeding)} className="px-3 py-1.5 text-sm bg-[#3282B8]/10 text-[#0F4C75] rounded-lg hover:bg-[#3282B8]/20 border border-[#3282B8]/20">
                                  <FaEye className="text-xs inline mr-1" /> View
                                </button>
                                <button onClick={() => { setSelectedProceeding(proceeding); setShowEditModal(true); }} className="px-3 py-1.5 text-sm bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/20 border border-[#F59E0B]/20">
                                  <FaEdit className="text-xs inline mr-1" /> Edit
                                </button>
                                <button onClick={() => handleDeleteClick(proceeding)} className="px-3 py-1.5 text-sm bg-[#EF4444]/10 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/20 border border-[#EF4444]/20">
                                  <FaTrash className="text-xs inline mr-1" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-12 text-center shadow-sm">
                    <FaGavel className="text-5xl text-[#BBE1FA] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1B262C]">No Proceedings Found</h3>
                    <p className="text-[#6B7280] text-sm">Add your first proceeding to get started</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 btn-primary rounded-lg text-sm font-medium">
                      <FaPlus className="inline mr-2" /> Add First Proceeding
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============================================
                DOCUMENTS TAB
            ============================================ */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#0F4C75]/10 to-[#0F4C75]/5 rounded-xl border border-[#0F4C75]/20 p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-[#0F4C75]">{documents.petitioner.length}</p>
                    <p className="text-sm text-[#6B7280]">Petitioner</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/20 p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-[#8B5CF6]">{documents.research.length}</p>
                    <p className="text-sm text-[#6B7280]">Research</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#EF4444]/10 to-[#EF4444]/5 rounded-xl border border-[#EF4444]/20 p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-[#EF4444]">{documents.defendant.length}</p>
                    <p className="text-sm text-[#6B7280]">Defendant</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm">
                  <div className="space-y-3">
                    {['petitioner', 'research', 'defendant'].map((section) => {
                      const titles = { petitioner: 'Petitioner', research: 'Research', defendant: 'Defendant' };
                      const colors = { 
                        petitioner: { bg: 'bg-[#0F4C75]/5', border: 'border-[#0F4C75]/20', icon: 'text-[#0F4C75]' },
                        research: { bg: 'bg-[#8B5CF6]/5', border: 'border-[#8B5CF6]/20', icon: 'text-[#8B5CF6]' },
                        defendant: { bg: 'bg-[#EF4444]/5', border: 'border-[#EF4444]/20', icon: 'text-[#EF4444]' }
                      };
                      const icons = { petitioner: FaUser, research: FaFileAlt, defendant: FaUsers };
                      const Icon = icons[section];
                      const docs = formattedDocuments[section];
                      const isExpanded = expandedSection === titles[section];
                      const color = colors[section];
                      
                      return (
                        <div key={section} className={`border ${color.border} rounded-xl overflow-hidden shadow-sm bg-white`}>
                          <button onClick={() => toggleSection(titles[section])} className="w-full flex items-center justify-between p-4 bg-[#F0F4F8] hover:bg-[#3282B8]/5">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${color.bg}`}>
                                <Icon className={`text-[#0F4C75]`} />
                              </div>
                              <span className="font-medium text-[#1B262C]">{titles[section]}</span>
                              {docs.length > 0 && <span className={`text-xs ${color.bg} text-[#0F4C75] px-2.5 py-0.5 rounded-full`}>{docs.length}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              {docs.length === 0 && <span className="text-xs text-[#9CA3AF]">No documents</span>}
                              {isExpanded ? <FaChevronDown className="text-[#9CA3AF]" /> : <FaChevronRight className="text-[#9CA3AF]" />}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="p-4 bg-white border-t border-[#BBE1FA]/30">
                              <div className="flex justify-end mb-3">
                                <button onClick={() => document.getElementById(`file-${section}`)?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-sm btn-primary rounded-lg">
                                  <FaUpload className="text-xs" /> Upload
                                </button>
                                <input id={`file-${section}`} type="file" className="hidden" onChange={(e) => { if (e.target.files[0]) handleUploadDocument(section, e.target.files[0]); e.target.value = ''; }} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                              </div>
                              {docs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {docs.map((doc) => (
                                    <div key={doc.id} className={`group p-4 ${color.bg} border ${color.border} rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}>
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                          <div className="p-2 bg-white rounded-lg shadow-sm">
                                            {getFileIcon(doc.name)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#1B262C] truncate">{doc.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-[10px] text-[#6B7280]">{doc.size}</span>
                                              <span className="text-[10px] text-[#6B7280]">•</span>
                                              <span className="text-[10px] text-[#6B7280]">{doc.date}</span>
                                            </div>
                                            <span className={`text-[8px] uppercase tracking-wider font-semibold ${color.icon}`}>
                                              {section}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                          <button 
                                            onClick={() => handleViewDocument(doc.name, section)} 
                                            className="p-1.5 text-[#0F4C75] hover:bg-white/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="View Document Details"
                                          >
                                            <FaEye className="text-sm" />
                                          </button>
                                          <button 
                                            onClick={() => handleDownloadDocument(doc.name, section)} 
                                            className="p-1.5 text-[#0F4C75] hover:bg-white/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Download"
                                          >
                                            <FaDownload className="text-sm" />
                                          </button>
                                          <button 
                                            onClick={() => handleDocDeleteClick(doc.name, section)} 
                                            className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                                <div className="text-center py-8 text-[#9CA3AF] text-sm">
                                  <FaFileAlt className="mx-auto text-4xl mb-3 text-[#BBE1FA]" />
                                  <p>No documents uploaded</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================
                SUMMARY TAB - REAL-TIME UPDATED
            ============================================ */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#1B262C] mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-[#0F4C75]" />
                    Case Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Case Title</p>
                      <p className="text-sm font-medium text-[#1B262C] truncate">{caseItem?.caseTitle || caseItem?.title || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Case Number</p>
                      <p className="text-sm font-medium text-[#1B262C]">{caseItem?.caseNumber || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Case Type</p>
                      <p className="text-sm font-medium text-[#1B262C]">{caseItem?.caseType || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Priority</p>
                      <p className="text-sm font-medium text-[#1B262C]">{caseItem?.priority || 'Medium'}</p>
                    </div>
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Judge</p>
                      <p className="text-sm font-medium text-[#1B262C]">{caseItem?.judge || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/20">
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium text-[#1B262C]">{caseItem?.location || caseItem?.court || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#1B262C] mb-4 uppercase flex items-center gap-2">
                      <FaGavel className="text-[#0F4C75]" />
                      Proceeding Status ({proceedings.length})
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-[#22C55E]/5 rounded-lg border border-[#22C55E]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaCheckCircle className="text-[#22C55E]" /> Completed
                        </span>
                        <span className="text-lg font-bold text-[#22C55E]">
                          {proceedings.filter(p => p.status === 'Completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#3B82F6]/5 rounded-lg border border-[#3B82F6]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaCalendarAlt className="text-[#3B82F6]" /> Scheduled
                        </span>
                        <span className="text-lg font-bold text-[#3B82F6]">
                          {proceedings.filter(p => p.status === 'Scheduled').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaClock className="text-[#F59E0B]" /> In Progress
                        </span>
                        <span className="text-lg font-bold text-[#F59E0B]">
                          {proceedings.filter(p => p.status === 'In Progress').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaClock className="text-[#8B5CF6]" /> Adjourned
                        </span>
                        <span className="text-lg font-bold text-[#8B5CF6]">
                          {proceedings.filter(p => p.status === 'Adjourned').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#EF4444]/5 rounded-lg border border-[#EF4444]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaTimesIcon className="text-[#EF4444]" /> Cancelled
                        </span>
                        <span className="text-lg font-bold text-[#EF4444]">
                          {proceedings.filter(p => p.status === 'Cancelled').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaClock className="text-[#F59E0B]" /> Rescheduled
                        </span>
                        <span className="text-lg font-bold text-[#F59E0B]">
                          {proceedings.filter(p => p.status === 'Rescheduled').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#1B262C]/5 rounded-lg border border-[#1B262C]/20">
                        <span className="text-sm font-medium text-[#1B262C]">Total Proceedings</span>
                        <span className="text-lg font-bold text-[#1B262C]">{proceedings.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#1B262C] mb-4 uppercase flex items-center gap-2">
                      <FaFilePdf className="text-[#0F4C75]" />
                      Document Summary ({documents.petitioner.length + documents.research.length + documents.defendant.length})
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-[#0F4C75]/5 rounded-lg border border-[#0F4C75]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaUser className="text-[#0F4C75]" /> Petitioner Documents
                        </span>
                        <span className="text-lg font-bold text-[#0F4C75]">
                          {documents.petitioner.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaFileAlt className="text-[#8B5CF6]" /> Research Documents
                        </span>
                        <span className="text-lg font-bold text-[#8B5CF6]">
                          {documents.research.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#EF4444]/5 rounded-lg border border-[#EF4444]/20">
                        <span className="text-sm text-[#6B7280] flex items-center gap-2">
                          <FaUsers className="text-[#EF4444]" /> Defendant Documents
                        </span>
                        <span className="text-lg font-bold text-[#EF4444]">
                          {documents.defendant.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#1B262C]/5 rounded-lg border border-[#1B262C]/20">
                        <span className="text-sm font-medium text-[#1B262C]">Total Documents</span>
                        <span className="text-lg font-bold text-[#1B262C]">
                          {documents.petitioner.length + documents.research.length + documents.defendant.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 rounded-xl border border-[#22C55E]/20 p-4 text-center hover:shadow-lg transition-all">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaCheckCircle className="text-[#22C55E] text-lg" />
                    </div>
                    <p className="text-2xl font-bold text-[#22C55E]">
                      {proceedings.filter(p => p.status === 'Completed').length}
                    </p>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Completed</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-xl border border-[#F59E0B]/20 p-4 text-center hover:shadow-lg transition-all">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaClock className="text-[#F59E0B] text-lg" />
                    </div>
                    <p className="text-2xl font-bold text-[#F59E0B]">
                      {proceedings.filter(p => p.status === 'Scheduled' || p.status === 'In Progress').length}
                    </p>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Active</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0F4C75]/10 to-[#0F4C75]/5 rounded-xl border border-[#0F4C75]/20 p-4 text-center hover:shadow-lg transition-all">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaFilePdf className="text-[#0F4C75] text-lg" />
                    </div>
                    <p className="text-2xl font-bold text-[#0F4C75]">
                      {documents.petitioner.length + documents.research.length + documents.defendant.length}
                    </p>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Total Documents</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/20 p-4 text-center hover:shadow-lg transition-all">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaGavel className="text-[#8B5CF6] text-lg" />
                    </div>
                    <p className="text-2xl font-bold text-[#8B5CF6]">
                      {proceedings.length}
                    </p>
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Total Proceedings</p>
                  </div>
                </div>

                {proceedings.filter(p => p.status === 'Scheduled' || p.status === 'In Progress').length > 0 && (
                  <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#1B262C] mb-4 uppercase flex items-center gap-2">
                      <FaCalendarAlt className="text-[#0F4C75]" />
                      Upcoming Proceedings
                    </h4>
                    <div className="space-y-3">
                      {proceedings
                        .filter(p => p.status === 'Scheduled' || p.status === 'In Progress')
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 5)
                        .map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 hover:border-[#3282B8] transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${p.status === 'Scheduled' ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'}`}></div>
                              <div>
                                <p className="text-sm font-medium text-[#1B262C]">{p.title}</p>
                                <p className="text-xs text-[#6B7280]">
                                  {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}
                                  {p.time && ` • ${p.time}`}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${p.status === 'Scheduled' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'}`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                    </div>
                    {proceedings.filter(p => p.status === 'Scheduled' || p.status === 'In Progress').length > 5 && (
                      <p className="text-center text-xs text-[#6B7280] mt-3">
                        +{proceedings.filter(p => p.status === 'Scheduled' || p.status === 'In Progress').length - 5} more upcoming
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          DOCUMENT VIEW MODAL - COLORFUL CARD
      ============================================ */}
      {showDocViewModal && viewingDocument && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[75] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#3282B8] p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="bg-gradient-to-r from-[#0F4C75] to-[#3282B8] -m-6 mb-6 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {getFileIcon(viewingDocument.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white truncate max-w-xs">
                      {viewingDocument.name}
                    </h3>
                    <p className="text-sm text-white/70">
                      {viewingDocument.section.charAt(0).toUpperCase() + viewingDocument.section.slice(1)} • {viewingDocument.type}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDocViewModal(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#3B82F6]/5 to-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20 text-center">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">File Name</p>
                  <p className="text-sm font-semibold text-[#1B262C] truncate mt-1">
                    {viewingDocument.name}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/20 text-center">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">File Type</p>
                  <p className="text-sm font-semibold text-[#1B262C] mt-1">
                    {viewingDocument.type || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#22C55E]/5 to-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-center">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">Section</p>
                  <p className="text-sm font-semibold text-[#1B262C] mt-1">
                    {viewingDocument.section.charAt(0).toUpperCase() + viewingDocument.section.slice(1)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">Date Uploaded</p>
                  <p className="text-sm font-semibold text-[#1B262C] flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="text-[#F59E0B]" />
                    {viewingDocument.date || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#EF4444]/5 to-[#EF4444]/10 rounded-xl border border-[#EF4444]/20">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">File Size</p>
                  <p className="text-sm font-semibold text-[#1B262C] flex items-center gap-2 mt-1">
                    <FaFileAlt className="text-[#EF4444]" />
                    {viewingDocument.size || 'N/A'}
                  </p>
                </div>
              </div>

              <div className={`p-8 bg-gradient-to-br rounded-xl border-2 ${getFileColor(viewingDocument.name)} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="flex justify-center">
                    {getFileIcon(viewingDocument.name)}
                  </div>
                  <p className="mt-4 text-sm text-[#6B7280]">
                    {viewingDocument.type === 'PDF' ? '📄 PDF Document' :
                     viewingDocument.type === 'DOC' || viewingDocument.type === 'DOCX' ? '📝 Word Document' :
                     viewingDocument.type === 'XLS' || viewingDocument.type === 'XLSX' ? '📊 Excel Spreadsheet' :
                     viewingDocument.type === 'JPG' || viewingDocument.type === 'JPEG' || viewingDocument.type === 'PNG' ? '🖼️ Image File' :
                     viewingDocument.type === 'ZIP' || viewingDocument.type === 'RAR' ? '📦 Archive File' :
                     '📄 Document'}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Click Download to view the actual file
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                <button
                  onClick={() => {
                    handleDownloadDocument(viewingDocument.name, viewingDocument.section);
                    setShowDocViewModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0F4C75]/30 transition-all"
                >
                  <FaDownload className="inline mr-2" /> Download File
                </button>
                <button
                  onClick={() => {
                    setDeleteDocTarget({ 
                      name: viewingDocument.name, 
                      section: viewingDocument.section 
                    });
                    setShowDocViewModal(false);
                    setShowDocDeleteConfirm(true);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
                >
                  <FaTrash className="inline mr-2" /> Delete
                </button>
                <button
                  onClick={() => setShowDocViewModal(false)}
                  className="px-4 py-3 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          COLORFUL VIEW PROCEEDING MODAL
      ============================================ */}
      {selectedProceeding && !showEditModal && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#3282B8] p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="bg-gradient-to-r from-[#0F4C75] to-[#3282B8] -m-6 mb-6 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {getTypeIcon(selectedProceeding.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedProceeding.title}</h3>
                    <p className="text-sm text-white/70">{selectedProceeding.type} • {selectedProceeding.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProceeding(null)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 ${getStatusColor(selectedProceeding.status)}`}>
                  {getStatusIcon(selectedProceeding.status)} {selectedProceeding.status || 'Scheduled'}
                </span>
                <span className="px-4 py-2 rounded-xl text-sm font-medium bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/20">
                  {selectedProceeding.type || 'Hearing'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProceeding.date && (
                  <div className="p-4 bg-gradient-to-br from-[#3B82F6]/5 to-[#3B82F6]/10 rounded-xl border border-[#3B82F6]/20">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Date</p>
                    <p className="text-lg font-semibold text-[#1B262C] flex items-center gap-2">
                      <FaCalendarAlt className="text-[#3B82F6]" />
                      {new Date(selectedProceeding.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
                
                {selectedProceeding.time && (
                  <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 rounded-xl border border-[#8B5CF6]/20">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Time</p>
                    <p className="text-lg font-semibold text-[#1B262C] flex items-center gap-2">
                      <FaClock className="text-[#8B5CF6]" />
                      {selectedProceeding.time}
                    </p>
                  </div>
                )}
                
                {selectedProceeding.location && (
                  <div className="p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Location</p>
                    <p className="text-lg font-semibold text-[#1B262C] flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#F59E0B]" />
                      {selectedProceeding.location}
                    </p>
                  </div>
                )}
                
                {selectedProceeding.judge && (
                  <div className="p-4 bg-gradient-to-br from-[#22C55E]/5 to-[#22C55E]/10 rounded-xl border border-[#22C55E]/20">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider">Judge</p>
                    <p className="text-lg font-semibold text-[#1B262C] flex items-center gap-2">
                      <FaGavel className="text-[#22C55E]" />
                      {selectedProceeding.judge}
                    </p>
                  </div>
                )}
              </div>

              {selectedProceeding.description && (
                <div className="p-4 bg-gradient-to-br from-[#3282B8]/5 to-[#3282B8]/10 rounded-xl border border-[#3282B8]/20">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-[#1B262C] leading-relaxed">{selectedProceeding.description}</p>
                </div>
              )}

              {selectedProceeding.attendees && selectedProceeding.attendees.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-[#EF4444]/5 to-[#EF4444]/10 rounded-xl border border-[#EF4444]/20">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">Attendees</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProceeding.attendees.map((attendee, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/50 rounded-lg text-sm text-[#1B262C] border border-[#BBE1FA]/30">
                        <FaUser className="inline mr-1.5 text-[#0F4C75] text-xs" />
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                <button
                  onClick={() => { 
                    setShowEditModal(true); 
                    setSelectedProceeding(selectedProceeding); 
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#F59E0B]/30 transition-all"
                >
                  <FaEdit className="inline mr-2" /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(selectedProceeding);
                    setShowDeleteConfirm(true);
                    setSelectedProceeding(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
                >
                  <FaTrash className="inline mr-2" /> Delete
                </button>
                <button
                  onClick={() => setSelectedProceeding(null)}
                  className="px-4 py-3 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          COLORFUL PROCEEDING DELETE CONFIRMATION MODAL
      ============================================ */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-[#EF4444] p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 flex items-center justify-center mb-4 border-4 border-[#EF4444]/30">
                <FaExclamationTriangle className="text-[#EF4444] text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#1B262C] mb-2">Delete Proceeding?</h3>
              <p className="text-[#6B7280] mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-lg font-semibold text-[#1B262C] mb-4">
                "{deleteTarget.title}"
              </p>
              <p className="text-sm text-[#6B7280] mb-6">
                This action <span className="text-[#EF4444] font-bold">cannot be undone</span>. 
                All data associated with this proceeding will be permanently removed.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
                >
                  <FaTrash className="inline mr-2" /> Yes, Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          COLORFUL DOCUMENT DELETE CONFIRMATION MODAL
      ============================================ */}
      {showDocDeleteConfirm && deleteDocTarget && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-[#EF4444] p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 flex items-center justify-center mb-4 border-4 border-[#EF4444]/30">
                <FaFilePdf className="text-[#EF4444] text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#1B262C] mb-2">Delete Document?</h3>
              <p className="text-[#6B7280] mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-lg font-semibold text-[#1B262C] mb-4">
                "{deleteDocTarget.name}"
              </p>
              <p className="text-sm text-[#6B7280] mb-6">
                This action <span className="text-[#EF4444] font-bold">cannot be undone</span>. 
                The file will be permanently removed from this proceeding.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleConfirmDocDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
                >
                  <FaTrash className="inline mr-2" /> Yes, Delete
                </button>
                <button
                  onClick={handleCancelDocDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          ADD PROCEEDING MODAL
      ============================================ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#BBE1FA]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1B262C]">Add New Proceeding</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#3282B8]/10 rounded-lg">
                <FaTimesIcon className="text-[#9CA3AF] text-xl" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const data = {
                title: form.title.value,
                date: form.date.value,
                time: form.time.value || '',
                type: form.type.value,
                status: form.status.value,
                description: form.description.value || '',
                location: form.location.value || '',
                judge: form.judge.value || '',
                attendees: form.attendees.value || '',
              };
              handleAddProceeding(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" required className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" placeholder="Enter proceeding title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Date <span className="text-red-500">*</span></label>
                    <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Time</label>
                    <input type="time" name="time" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Type</label>
                    <select name="type" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none">
                      <option value="Hearing">Hearing</option>
                      <option value="Trial">Trial</option>
                      <option value="Mediation">Mediation</option>
                      <option value="Arbitration">Arbitration</option>
                      <option value="Conference">Conference</option>
                      <option value="Filing">Filing</option>
                      <option value="Order">Order</option>
                      <option value="Judgment">Judgment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Status</label>
                    <select name="status" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none">
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Adjourned">Adjourned</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                  <textarea name="description" rows="2" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" placeholder="Enter description" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Location</label>
                    <input type="text" name="location" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" placeholder="Court location" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Judge</label>
                    <input type="text" name="judge" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" placeholder="Judge name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Attendees (comma separated)</label>
                  <input type="text" name="attendees" className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" placeholder="e.g., John Doe, Jane Smith" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 font-medium">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 btn-primary rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? <><FaSpinner className="animate-spin" /> Adding...</> : <><FaPlus className="text-sm" /> Add Proceeding</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================
          EDIT PROCEEDING MODAL
      ============================================ */}
      {showEditModal && selectedProceeding && (
        <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#BBE1FA]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1B262C]">Edit Proceeding</h3>
              <button onClick={() => { setShowEditModal(false); setSelectedProceeding(null); }} className="p-2 hover:bg-[#3282B8]/10 rounded-lg">
                <FaTimesIcon className="text-[#9CA3AF] text-xl" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const data = {
                id: selectedProceeding.id || selectedProceeding._id,
                title: form.title.value,
                date: form.date.value,
                time: form.time.value || '',
                type: form.type.value,
                status: form.status.value,
                description: form.description.value || '',
                location: form.location.value || '',
                judge: form.judge.value || '',
                attendees: form.attendees.value || '',
              };
              handleEditProceeding(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" required defaultValue={selectedProceeding.title || ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Date <span className="text-red-500">*</span></label>
                    <input type="date" name="date" required defaultValue={selectedProceeding.date ? new Date(selectedProceeding.date).toISOString().split('T')[0] : ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Time</label>
                    <input type="time" name="time" defaultValue={selectedProceeding.time || ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Type</label>
                    <select name="type" defaultValue={selectedProceeding.type || 'Hearing'} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none">
                      <option value="Hearing">Hearing</option>
                      <option value="Trial">Trial</option>
                      <option value="Mediation">Mediation</option>
                      <option value="Arbitration">Arbitration</option>
                      <option value="Conference">Conference</option>
                      <option value="Filing">Filing</option>
                      <option value="Order">Order</option>
                      <option value="Judgment">Judgment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Status</label>
                    <select name="status" defaultValue={selectedProceeding.status || 'Scheduled'} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none">
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Adjourned">Adjourned</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                  <textarea name="description" rows="2" defaultValue={selectedProceeding.description || ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Location</label>
                    <input type="text" name="location" defaultValue={selectedProceeding.location || ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Judge</label>
                    <input type="text" name="judge" defaultValue={selectedProceeding.judge || ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Attendees (comma separated)</label>
                  <input type="text" name="attendees" defaultValue={selectedProceeding.attendees ? selectedProceeding.attendees.join(', ') : ''} className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none" />
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                  <button type="button" onClick={() => { setShowEditModal(false); setSelectedProceeding(null); }} className="flex-1 px-4 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 font-medium">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 btn-primary rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? <><FaSpinner className="animate-spin" /> Saving...</> : <><FaSave className="text-sm" /> Update</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProceedingPage;