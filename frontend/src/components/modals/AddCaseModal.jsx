// src/components/modals/CaseDetailModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaBuilding, FaTag, FaGavel, FaFileAlt, FaDownload, FaPrint, FaSave, FaPlus, FaPlusCircle, FaComment, FaUsers, FaInfoCircle, FaClock, FaChevronDown, FaChevronUp, FaEye, FaFile, FaCalendarCheck, FaClipboardList, FaBookmark } from 'react-icons/fa';
import { GiJusticeStar } from 'react-icons/gi';
import toast from 'react-hot-toast';

const CaseDetailModal = ({
  isOpen,
  case: caseData,
  onClose,
  onStatusChange,
  onEdit,
  onDelete,
  onDeleteComplete,
  onRefresh,
  // ===== COMMENTS PROPS =====
  comments = [],
  commentsLoading = false,
  onAddComment,
  onEditComment,
  onDeleteComment,
  openEditCommentModal,
  openDeleteCommentConfirm,
  showAddCommentModal,
  setShowAddCommentModal,
  // ===== PARTIES PROPS =====
  parties = [],
  partiesLoading = false,
  onAddParty,
  onEditParty,
  onDeleteParty,
  openEditPartyModal,
  openDeletePartyConfirm,
  showAddPartyModal,
  setShowAddPartyModal,
  // ===== PROCEEDINGS PROPS =====
  proceedings = [],
  proceedingsLoading = false,
  onAddProceeding,
  onUpdateProceeding,
  onDeleteProceeding,
  openEditProceedingForm,
  openDeleteConfirm,
  openProceedingDetail,
  showProceedingForm,
  setShowProceedingForm,
  proceedingFormData,
  handleProceedingFormChange,
  handleProceedingSubmit,
  showEditProceedingForm,
  setShowEditProceedingForm,
  editingProceeding,
  editProceedingFormData,
  handleEditProceedingFormChange,
  handleEditProceedingSubmit,
  statusOptions,
  customStatus,
  setCustomStatus,
  showCustomStatusInput,
  setShowCustomStatusInput,
  addCustomStatus,
  editStatusOptions,
  editCustomStatus,
  setEditCustomStatus,
  showEditCustomStatusInput,
  setShowEditCustomStatusInput,
  addEditCustomStatus,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Comment form state
  const [commentFormData, setCommentFormData] = useState({
    caseId: '',
    commentedBy: '',
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  // Party form state
  const [partyFormData, setPartyFormData] = useState({
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
    createdBy: '',
  });

  if (!isOpen || !caseData) return null;

  const caseId = caseData.id || caseData._id;

  // Filter comments for this case
  const caseComments = comments.filter(c => c.caseId === caseId);
  // Filter parties for this case
  const caseParties = parties.filter(p => p.caseId === caseId);
  // Filter proceedings for this case
  const caseProceedings = proceedings.filter(p => p.caseId === caseId);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'pending': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'closed': return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20';
      default: return 'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '🟢';
      case 'pending': return '🟡';
      case 'closed': return '🔴';
      default: return '⚪';
    }
  };

  // ============================================
  // REFRESH DATA
  // ============================================
  const refreshData = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        console.log('✅ Data refreshed');
      } catch (error) {
        console.error('❌ Error refreshing data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // ============================================
  // STATUS HANDLER
  // ============================================
  const handleStatusChange = async (newStatus) => {
    if (!caseId) return;
    setIsStatusUpdating(true);
    try {
      await onStatusChange(caseId, newStatus);
      await refreshData();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  // ============================================
  // DELETE HANDLER
  // ============================================
  const handleDelete = async () => {
    if (!caseId) return;
    setIsDeleting(true);
    try {
      await onDelete(caseId);
      toast.success('Case deleted successfully');
      setShowDeleteConfirm(false);
      if (onDeleteComplete) onDeleteComplete();
    } catch (error) {
      toast.error('Failed to delete case');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(caseData);
  };

  // ============================================
  // PROCEEDING SUBMIT HANDLER - FIXED
  // ============================================
  const handleProceedingSubmitWrapper = async (e) => {
    e.preventDefault();
    
    if (!proceedingFormData.caseId) {
      toast.error('Please select a case');
      return;
    }
    
    if (!proceedingFormData.createdBy) {
      toast.error('Please enter your name');
      return;
    }
    if (!proceedingFormData.progress) {
      toast.error('Please enter progress details');
      return;
    }
    if (!proceedingFormData.nextHearingDate) {
      toast.error('Please select next hearing date');
      return;
    }
    if (!proceedingFormData.status) {
      toast.error('Please select status');
      return;
    }

    try {
      const proceedingData = {
        caseId: proceedingFormData.caseId,
        createdBy: proceedingFormData.createdBy,
        progress: proceedingFormData.progress,
        nextHearingDate: proceedingFormData.nextHearingDate,
        status: proceedingFormData.status,
        date: proceedingFormData.date || new Date().toISOString().split('T')[0],
        attachment: proceedingFormData.attachment || null
      };

      console.log('📤 Submitting proceeding:', proceedingData);
      
      if (onAddProceeding) {
        const result = await onAddProceeding(proceedingData);
        console.log('✅ Proceeding added:', result);
        
        // Close the form
        setShowProceedingForm(false);
        
        // Refresh data
        await refreshData();
        
        toast.success('Proceeding added successfully!');
      } else {
        console.error('❌ onAddProceeding is not defined');
        toast.error('Cannot add proceeding: function not available');
      }
    } catch (error) {
      console.error('❌ Error adding proceeding:', error);
      toast.error('Failed to add proceeding');
    }
  };

  // ============================================
  // EDIT PROCEEDING SUBMIT HANDLER - FIXED
  // ============================================
  const handleEditProceedingSubmitWrapper = async (e) => {
    e.preventDefault();
    
    if (!editProceedingFormData.createdBy) {
      toast.error('Please enter your name');
      return;
    }
    if (!editProceedingFormData.progress) {
      toast.error('Please enter progress details');
      return;
    }
    if (!editProceedingFormData.nextHearingDate) {
      toast.error('Please select next hearing date');
      return;
    }
    if (!editProceedingFormData.status) {
      toast.error('Please select status');
      return;
    }

    const id = editingProceeding?.id || editingProceeding?._id;
    if (!id) {
      toast.error('Proceeding ID not found');
      return;
    }

    try {
      if (onUpdateProceeding) {
        await onUpdateProceeding(id, editProceedingFormData);
        setShowEditProceedingForm(false);
        setEditingProceeding(null);
        await refreshData();
        toast.success('Proceeding updated successfully!');
      } else {
        console.error('❌ onUpdateProceeding is not defined');
        toast.error('Cannot update proceeding: function not available');
      }
    } catch (error) {
      console.error('❌ Error updating proceeding:', error);
      toast.error('Failed to update proceeding');
    }
  };

  // ============================================
  // ADD COMMENT HANDLER - FIXED
  // ============================================
  const handleAddCommentWrapper = async () => {
    if (!commentFormData.commentedBy) {
      toast.error('Please enter your name');
      return;
    }

    try {
      const commentData = {
        caseId: caseId,
        commentedBy: commentFormData.commentedBy,
        remarks: commentFormData.remarks || '',
        requestToClientDepartment: commentFormData.requestToClientDepartment || '',
        clientDepartments: commentFormData.clientDepartments || '',
        attachments: commentFormData.attachments || [],
        status: commentFormData.status,
        date: commentFormData.date || new Date().toISOString().split('T')[0]
      };

      console.log('📤 Submitting comment:', commentData);
      
      if (onAddComment) {
        await onAddComment(commentData);
        setShowAddCommentModal(false);
        await refreshData();
        toast.success('Comment added successfully!');
      } else {
        console.error('❌ onAddComment is not defined');
        toast.error('Cannot add comment: function not available');
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  // ============================================
  // ADD PARTY HANDLER - FIXED
  // ============================================
  const handleAddPartyWrapper = async () => {
    if (!partyFormData.type) {
      toast.error('Please select party type');
      return;
    }
    if (!partyFormData.name) {
      toast.error('Please enter party name');
      return;
    }

    try {
      const partyData = {
        caseId: caseId,
        type: partyFormData.type,
        name: partyFormData.name,
        phone: partyFormData.phone || '-',
        email: partyFormData.email || '-',
        cnic: partyFormData.cnic || '-',
        address: partyFormData.address || '-',
        createdBy: partyFormData.createdBy || 'Current User'
      };

      console.log('📤 Submitting party:', partyData);
      
      if (onAddParty) {
        await onAddParty(partyData);
        setShowAddPartyModal(false);
        await refreshData();
        toast.success('Party added successfully!');
      } else {
        console.error('❌ onAddParty is not defined');
        toast.error('Cannot add party: function not available');
      }
    } catch (error) {
      console.error('❌ Error adding party:', error);
      toast.error('Failed to add party');
    }
  };

  // ============================================
  // RENDER CASE DETAILS TAB
  // ============================================
  const renderDetails = () => (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono text-[#6B7280] bg-[#F0F4F8] px-3 py-1 rounded-lg">
              #{caseData.caseNumber || 'N/A'}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(caseData.status)}`}>
              {getStatusIcon(caseData.status)} {caseData.status || 'Unknown'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1B262C] mt-2">{caseData.caseTitle || caseData.title || 'Untitled Case'}</h2>
          <p className="text-sm text-[#6B7280]">Created: {caseData.date ? new Date(caseData.date).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#F59E0B] text-white rounded-xl text-sm font-medium hover:bg-[#D97706] transition-all duration-200 flex items-center gap-2"
          >
            <FaEdit className="text-sm" /> Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
          >
            <FaTrash className="text-sm" /> Delete
          </button>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      </div>

      {/* Status Update */}
      <div className="flex items-center gap-3 p-3 bg-[#F0F4F8] rounded-xl">
        <span className="text-sm font-medium text-[#6B7280]">Update Status:</span>
        <select
          value={caseData.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isStatusUpdating}
          className="px-3 py-1.5 bg-white border border-[#BBE1FA] rounded-lg text-sm text-[#1B262C] focus:outline-none focus:ring-2 focus:ring-[#3282B8] transition-all duration-200"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        {isStatusUpdating && <span className="text-xs text-[#6B7280]">Updating...</span>}
      </div>

      {/* Case Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaBuilding className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Department</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.department || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaTag className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Board</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.board || caseData.courtName || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaUser className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Plaintiff</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.plaintiff || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaUser className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Defendant</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.defendant || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaCalendarAlt className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Next Hearing</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.nextDateOfHearing || caseData.nextHearing || caseData.nexthearing || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <div className="flex items-start gap-3">
            <FaGavel className="text-[#3282B8] text-sm mt-0.5" />
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Case Type</p>
              <p className="text-sm text-[#1B262C] font-medium">{caseData.caseType || caseData.natureOfCase || 'Civil'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Law Officer */}
      {caseData.lawOfficer && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <h4 className="text-sm font-semibold text-[#0F4C75] mb-3 flex items-center gap-2">
            <FaUser className="text-sm" /> Law Officer
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Name</p>
              <p className="text-sm text-[#1B262C]">{caseData.lawOfficer.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Designation</p>
              <p className="text-sm text-[#1B262C]">{caseData.lawOfficer.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Office</p>
              <p className="text-sm text-[#1B262C]">{caseData.lawOfficer.officeAddress || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Contact</p>
              <p className="text-sm text-[#1B262C]">{caseData.lawOfficer.cellNumber || caseData.lawOfficer.officialNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alternate Law Officer */}
      {caseData.alternateLawOfficer && caseData.alternateLawOfficer.name && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <h4 className="text-sm font-semibold text-[#0F4C75] mb-3 flex items-center gap-2">
            <FaUser className="text-sm" /> Alternate Law Officer
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Name</p>
              <p className="text-sm text-[#1B262C]">{caseData.alternateLawOfficer.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Designation</p>
              <p className="text-sm text-[#1B262C]">{caseData.alternateLawOfficer.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Office</p>
              <p className="text-sm text-[#1B262C]">{caseData.alternateLawOfficer.officeAddress || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Contact</p>
              <p className="text-sm text-[#1B262C]">{caseData.alternateLawOfficer.cellNumber || caseData.alternateLawOfficer.officialNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Written Statements */}
      {caseData.writtenStatements && caseData.writtenStatements.length > 0 && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4">
          <h4 className="text-sm font-semibold text-[#0F4C75] mb-3 flex items-center gap-2">
            <FaFileAlt className="text-sm" /> Written Statements ({caseData.writtenStatements.length})
          </h4>
          <div className="space-y-2">
            {caseData.writtenStatements.map((statement, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded-lg border border-[#BBE1FA]/30">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-[#3282B8]" />
                  <div>
                    <p className="text-sm font-medium text-[#1B262C]">{statement.title || 'Statement'}</p>
                    <p className="text-xs text-[#6B7280]">
                      {statement.content ? `${statement.content.length} characters` : statement.fileName || ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {statement.content && (
                    <button className="p-1.5 text-[#0F4C75] hover:bg-blue-50 rounded-lg transition-all" title="View">
                      <FaEye className="text-sm" />
                    </button>
                  )}
                  {statement.fileName && (
                    <button className="p-1.5 text-[#0F4C75] hover:bg-blue-50 rounded-lg transition-all" title="Download">
                      <FaDownload className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER COMMENTS TAB
  // ============================================
  const renderComments = () => (
    <div className="space-y-4">
      {/* Add Comment Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaComment className="text-[#0F4C75]" />
          <span className="text-sm font-semibold text-[#1B262C]">Comments ({caseComments.length})</span>
        </div>
        <button
          onClick={() => {
            setCommentFormData({ ...commentFormData, caseId: caseId });
            setShowAddCommentModal(true);
          }}
          className="px-4 py-2 bg-[#0F4C75] text-white rounded-xl text-sm font-medium hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2"
        >
          <FaPlusCircle className="text-xs" /> Add Comment
        </button>
      </div>

      {commentsLoading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0F4C75] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#6B7280]">Loading comments...</span>
          </div>
        </div>
      ) : caseComments.length > 0 ? (
        <div className="space-y-3">
          {caseComments.map((comment, index) => (
            <div key={comment.id || comment._id || index} className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#1B262C]">{comment.commentedBy}</span>
                    <span className="text-xs text-[#6B7280]">{comment.date ? new Date(comment.date).toLocaleDateString() : 'N/A'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      comment.status === 'Completed' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                      comment.status === 'In Progress' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                      comment.status === 'Closed' ? 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' :
                      'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20'
                    }`}>
                      {comment.status || 'Pending'}
                    </span>
                  </div>
                  {comment.remarks && (
                    <p className="text-sm text-[#6B7280] mt-1">{comment.remarks}</p>
                  )}
                  {comment.requestToClientDepartment && (
                    <p className="text-xs text-[#0F4C75] mt-1">📌 {comment.requestToClientDepartment}</p>
                  )}
                  {comment.clientDepartments && (
                    <p className="text-xs text-[#6B7280]">Department: {comment.clientDepartments}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => openEditCommentModal(comment)}
                    className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => openDeleteCommentConfirm(comment)}
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
        <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/40">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm text-[#6B7280]">No comments added yet</p>
          <button
            onClick={() => {
              setCommentFormData({ ...commentFormData, caseId: caseId });
              setShowAddCommentModal(true);
            }}
            className="mt-2 text-sm text-[#0F4C75] hover:text-[#3282B8] font-medium"
          >
            Add first comment →
          </button>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER PARTIES TAB
  // ============================================
  const renderParties = () => (
    <div className="space-y-4">
      {/* Add Party Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUsers className="text-[#0F4C75]" />
          <span className="text-sm font-semibold text-[#1B262C]">Parties ({caseParties.length})</span>
        </div>
        <button
          onClick={() => {
            setPartyFormData({ ...partyFormData, caseId: caseId });
            setShowAddPartyModal(true);
          }}
          className="px-4 py-2 bg-[#0F4C75] text-white rounded-xl text-sm font-medium hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2"
        >
          <FaPlusCircle className="text-xs" /> Add Party
        </button>
      </div>

      {partiesLoading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0F4C75] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#6B7280]">Loading parties...</span>
          </div>
        </div>
      ) : caseParties.length > 0 ? (
        <div className="space-y-3">
          {caseParties.map((party, index) => (
            <div key={party.id || party._id || index} className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded text-xs font-medium border border-[#3282B8]/20">
                      {party.type || 'Party'}
                    </span>
                    <span className="font-medium text-[#1B262C]">{party.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                    {party.phone && party.phone !== '-' && (
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <span>📞</span> {party.phone}
                      </p>
                    )}
                    {party.email && party.email !== '-' && (
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <span>✉️</span> {party.email}
                      </p>
                    )}
                    {party.cnic && party.cnic !== '-' && (
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <span>🪪</span> {party.cnic}
                      </p>
                    )}
                    {party.address && party.address !== '-' && (
                      <p className="text-xs text-[#6B7280] flex items-center gap-1 col-span-2">
                        <span>📍</span> {party.address}
                      </p>
                    )}
                  </div>
                  {party.createdBy && (
                    <p className="text-[10px] text-[#9CA3AF] mt-1">Added by: {party.createdBy}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => openEditPartyModal(party)}
                    className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => openDeletePartyConfirm(party)}
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
        <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/40">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-sm text-[#6B7280]">No parties added yet</p>
          <button
            onClick={() => {
              setPartyFormData({ ...partyFormData, caseId: caseId });
              setShowAddPartyModal(true);
            }}
            className="mt-2 text-sm text-[#0F4C75] hover:text-[#3282B8] font-medium"
          >
            Add first party →
          </button>
        </div>
      )}
    </div>
  );

  // ============================================
  // RENDER PROCEEDINGS TAB
  // ============================================
  const renderProceedings = () => (
    <div className="space-y-4">
      {/* Add Proceeding Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGavel className="text-[#0F4C75]" />
          <span className="text-sm font-semibold text-[#1B262C]">Proceedings ({caseProceedings.length})</span>
        </div>
        <button
          onClick={() => {
            setShowProceedingForm(!showProceedingForm);
          }}
          className="px-4 py-2 bg-[#0F4C75] text-white rounded-xl text-sm font-medium hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2"
        >
          {showProceedingForm ? <FaTimes className="text-xs" /> : <FaPlusCircle className="text-xs" />}
          {showProceedingForm ? 'Close Form' : 'Add Proceeding'}
        </button>
      </div>

      {/* Add Proceeding Form */}
      {showProceedingForm && (
        <div className="bg-white rounded-xl border-2 border-[#3282B8] p-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#BBE1FA]/30">
            <div className="flex items-center gap-2">
              <FaGavel className="text-[#0F4C75]" />
              <span className="text-sm font-semibold text-[#1B262C]">New Proceeding</span>
            </div>
          </div>
          <form onSubmit={handleProceedingSubmitWrapper}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Created By *</label>
                <input
                  type="text"
                  value={proceedingFormData.createdBy}
                  onChange={(e) => handleProceedingFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Date *</label>
                <input
                  type="date"
                  value={proceedingFormData.date}
                  onChange={(e) => handleProceedingFormChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Progress on Date of Hearing *</label>
              <textarea
                value={proceedingFormData.progress}
                onChange={(e) => handleProceedingFormChange('progress', e.target.value)}
                placeholder="Enter progress"
                required
                rows="2"
                className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Next Hearing Date *</label>
                <input
                  type="date"
                  value={proceedingFormData.nextHearingDate}
                  onChange={(e) => handleProceedingFormChange('nextHearingDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Status</label>
                <select
                  value={proceedingFormData.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Others') {
                      setShowCustomStatusInput(true);
                      handleProceedingFormChange('status', '');
                    } else {
                      setShowCustomStatusInput(false);
                      handleProceedingFormChange('status', value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-sm"
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
                      className="flex-1 px-3 py-1.5 border border-[#3282B8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customStatus.trim()) {
                          addCustomStatus(customStatus.trim());
                        }
                      }}
                      className="px-3 py-1.5 bg-[#0F4C75] text-white rounded-lg text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomStatusInput(false);
                        setCustomStatus('');
                      }}
                      className="px-3 py-1.5 text-sm text-[#6B7280] hover:text-[#1B262C]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Attachment</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-3 py-2 border-2 border-dashed border-[#BBE1FA] rounded-lg cursor-pointer hover:border-[#3282B8] transition-all bg-[#F8FAFC] text-center">
                  <span className="text-sm text-[#6B7280]">Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleProceedingFormChange('attachment', e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {proceedingFormData.attachment && (
                  <span className="text-sm text-[#0F4C75] font-medium">{proceedingFormData.attachment}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={() => {
                  setShowProceedingForm(false);
                  setShowCustomStatusInput(false);
                  setCustomStatus('');
                }}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] transition-all flex items-center gap-2"
              >
                <FaPlus className="text-xs" /> Add Proceeding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Proceeding Form */}
      {showEditProceedingForm && editingProceeding && (
        <div className="bg-white rounded-xl border-2 border-[#F59E0B] p-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#BBE1FA]/30">
            <div className="flex items-center gap-2">
              <FaEdit className="text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#1B262C]">Edit Proceeding</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowEditProceedingForm(false);
                setEditingProceeding(null);
              }}
              className="p-1 text-[#9CA3AF] hover:text-[#1B262C]"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleEditProceedingSubmitWrapper}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Created By *</label>
                <input
                  type="text"
                  value={editProceedingFormData.createdBy}
                  onChange={(e) => handleEditProceedingFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Date *</label>
                <input
                  type="date"
                  value={editProceedingFormData.date}
                  onChange={(e) => handleEditProceedingFormChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Progress on Date of Hearing *</label>
              <textarea
                value={editProceedingFormData.progress}
                onChange={(e) => handleEditProceedingFormChange('progress', e.target.value)}
                placeholder="Enter progress"
                required
                rows="2"
                className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Next Hearing Date *</label>
                <input
                  type="date"
                  value={editProceedingFormData.nextHearingDate}
                  onChange={(e) => handleEditProceedingFormChange('nextHearingDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">Status</label>
                <select
                  value={editProceedingFormData.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Others') {
                      setShowEditCustomStatusInput(true);
                      handleEditProceedingFormChange('status', '');
                    } else {
                      setShowEditCustomStatusInput(false);
                      handleEditProceedingFormChange('status', value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm"
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
                      className="flex-1 px-3 py-1.5 border border-[#F59E0B] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editCustomStatus.trim()) {
                          addEditCustomStatus(editCustomStatus.trim());
                        }
                      }}
                      className="px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCustomStatusInput(false);
                        setEditCustomStatus('');
                      }}
                      className="px-3 py-1.5 text-sm text-[#6B7280] hover:text-[#1B262C]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-[#6B7280] mb-1">Attachment</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-3 py-2 border-2 border-dashed border-[#BBE1FA] rounded-lg cursor-pointer hover:border-[#F59E0B] transition-all bg-[#F8FAFC] text-center">
                  <span className="text-sm text-[#6B7280]">Choose File</span>
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
                {editProceedingFormData.attachment && (
                  <span className="text-sm text-[#F59E0B] font-medium">{editProceedingFormData.attachment}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#BBE1FA]/30">
              <button
                type="button"
                onClick={() => {
                  setShowEditProceedingForm(false);
                  setEditingProceeding(null);
                  setShowEditCustomStatusInput(false);
                  setEditCustomStatus('');
                }}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-all flex items-center gap-2"
              >
                <FaSave className="text-xs" /> Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Proceedings List */}
      {proceedingsLoading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0F4C75] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[#6B7280]">Loading proceedings...</span>
          </div>
        </div>
      ) : caseProceedings.length > 0 ? (
        <div className="space-y-3">
          {caseProceedings.map((p, index) => (
            <div
              key={p.id || p._id || index}
              className="bg-white rounded-xl border border-[#BBE1FA]/40 p-4 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openProceedingDetail(p)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#1B262C]">{p.createdBy || 'N/A'}</span>
                    <span className="text-xs text-[#6B7280]">{p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      p.status?.toLowerCase().includes('adjournment') ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                      p.status?.toLowerCase().includes('decision') ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                      p.status?.toLowerCase().includes('dismissed') ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                      'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20'
                    }`}>
                      {p.status || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{p.progress || p.description || 'N/A'}</p>
                  {p.nextHearingDate && (
                    <p className="text-xs text-[#0F4C75] mt-1 flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px]" /> Next: {new Date(p.nextHearingDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEditProceedingForm(p)}
                    className="p-1.5 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(p.id || p._id, `${p.createdBy || 'Proceeding'}`)}
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
        <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/40">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-sm text-[#6B7280]">No proceedings recorded yet</p>
          <button
            onClick={() => setShowProceedingForm(true)}
            className="mt-2 text-sm text-[#0F4C75] hover:text-[#3282B8] font-medium"
          >
            Add first proceeding →
          </button>
        </div>
      )}
    </div>
  );

  // ============================================
  // MAIN MODAL RENDER
  // ============================================
  return (
    <>
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1B262C]/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-500/20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                <FaTrash className="text-3xl text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1B262C] text-center mb-2">Delete Case?</h3>
            <p className="text-[#6B7280] text-center text-sm mb-6">
              Are you sure you want to delete this case? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">⟳</span> Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="text-sm" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B262C]/70 backdrop-blur-sm animate-in fade-in duration-200 p-4">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          {/* Modal Header - Always visible */}
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-4 rounded-t-3xl flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <GiJusticeStar className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Case Details</h3>
                  <p className="text-white/70 text-xs">#{caseData.caseNumber || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-[#F0F4F8] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'details'
                    ? 'bg-white text-[#0F4C75] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1B262C]'
                }`}
              >
                <FaInfoCircle className="inline mr-2 text-xs" />
                Details
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'comments'
                    ? 'bg-white text-[#0F4C75] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1B262C]'
                }`}
              >
                <FaComment className="inline mr-2 text-xs" />
                Comments ({caseComments.length})
              </button>
              <button
                onClick={() => setActiveTab('parties')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'parties'
                    ? 'bg-white text-[#0F4C75] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1B262C]'
                }`}
              >
                <FaUsers className="inline mr-2 text-xs" />
                Parties ({caseParties.length})
              </button>
              <button
                onClick={() => setActiveTab('proceedings')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'proceedings'
                    ? 'bg-white text-[#0F4C75] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#1B262C]'
                }`}
              >
                <FaGavel className="inline mr-2 text-xs" />
                Proceedings ({caseProceedings.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && renderDetails()}
            {activeTab === 'comments' && renderComments()}
            {activeTab === 'parties' && renderParties()}
            {activeTab === 'proceedings' && renderProceedings()}

          </div>
        </div>
      </div>
    </>
  );
};

export default CaseDetailModal;