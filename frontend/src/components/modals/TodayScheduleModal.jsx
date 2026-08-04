// src/components/modals/TodayScheduleModal.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaEye,
  FaCalendarDay,
  FaChevronUp,
  FaCalendarCheck,
  FaSave,
  FaSpinner,
  FaStickyNote,
  FaPlusCircle,
  FaSync,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import CaseReportModal from './CaseReportModal';

const TodayScheduleModal = ({ isOpen, onClose, cases = [], onRefresh }) => {
  const [viewingCase, setViewingCase] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localCases, setLocalCases] = useState([]);

  const [showAddHearingForm, setShowAddHearingForm] = useState(null);
  const [hearingData, setHearingData] = useState({
    nextDateOfHearing: '',
    hearingNotes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const hasLoadedRef = useRef(false);
  const refreshTimeoutRef = useRef(null);

  // ============================================
  // Today's date
  // ============================================
  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // ============================================
  // Normalize date
  // ============================================
  const normalizeDate = (dateValue) => {
    if (!dateValue) return null;
    try {
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      if (typeof dateValue === 'string') {
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateValue;
        }
      }
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // ============================================
  // Filter today's cases
  // ============================================
  const todayCases = useMemo(() => {
    const casesToUse = localCases.length > 0 ? localCases : cases;
    if (!casesToUse || casesToUse.length === 0) return [];

    return casesToUse.filter(c => {
      const hearingDate = c.nextDateOfHearing || c.nextHearing || c.nexthearing || c.courtDetails?.nextDate;
      if (!hearingDate) return false;
      const normalized = normalizeDate(hearingDate);
      if (!normalized) return false;
      return normalized === todayStr;
    });
  }, [cases, localCases, todayStr]);

  // ============================================
  // Sync local cases
  // ============================================
  useEffect(() => {
    if (cases && cases.length > 0) {
      setLocalCases(cases);
    }
  }, [cases]);

  // ============================================
  // Refresh data
  // ============================================
  const refreshData = async () => {
    if (onRefresh) {
      setIsLoading(true);
      try {
        const result = await onRefresh();
        if (result && result.data) {
          setLocalCases(result.data);
        } else if (result && Array.isArray(result)) {
          setLocalCases(result);
        } else if (result) {
          setLocalCases(result);
        }
        return result;
      } catch (error) {
        console.error('❌ Refresh error:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    return null;
  };

  useEffect(() => {
    if (isOpen && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      refreshData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasLoadedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isOpen) {
        refreshData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  // ============================================
  // Date formatting
  // ============================================
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateLong = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // ============================================
  // View case
  // ============================================
  const handleViewCase = (caseItem) => {
    if (!caseItem) {
      toast.error('No case data available');
      return;
    }
    setViewingCase(caseItem);
    setIsReportOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
    setViewingCase(null);
  };

  // ============================================
  // Add hearing panel
  // ============================================
  const toggleAddHearingForm = (caseItem) => {
    const caseId = caseItem._id || caseItem.id;
    if (showAddHearingForm === caseId) {
      setShowAddHearingForm(null);
      setHearingData({ nextDateOfHearing: '', hearingNotes: '' });
    } else {
      setShowAddHearingForm(caseId);
      setHearingData({ nextDateOfHearing: '', hearingNotes: '' });
    }
  };

  // ============================================
  // Save hearing
  // ============================================
  const handleSaveHearing = async (caseItem) => {
    const caseId = caseItem._id || caseItem.id;

    if (!hearingData.nextDateOfHearing) {
      toast.error('Please select a hearing date');
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {
        nextDateOfHearing: hearingData.nextDateOfHearing,
        nextHearing: hearingData.nextDateOfHearing,
        nexthearing: hearingData.nextDateOfHearing,
        hearingNotes: hearingData.hearingNotes || '',
        remarks: hearingData.hearingNotes || caseItem.remarks || '',
        updatedAt: new Date().toISOString()
      };

      const response = await api.patch(`/cases/${caseId}`, updateData);

      if (response && response.success === true) {
        toast.success('✅ Next hearing date added successfully!');

        const updatedCase = response.data || response;

        setLocalCases(prev =>
          prev.map(c => (c._id === caseId || c.id === caseId) ? { ...c, ...updatedCase } : c)
        );

        if (onRefresh) {
          await refreshData();
        }

        setShowAddHearingForm(null);
        setHearingData({ nextDateOfHearing: '', hearingNotes: '' });
      } else {
        toast.error(response?.error || 'Failed to add hearing date');
      }
    } catch (error) {
      console.error('❌ Error saving hearing:', error);
      toast.error('Failed to add hearing date. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // Field helpers - ONLY 6 FIELDS
  // ============================================
  
  // Name of the Court
  const getCourtName = (caseItem) => {
    return caseItem.nameOfCourt || caseItem.courtDetails?.courtName || caseItem.courtName || 'N/A';
  };

  // Nature of the Case
  const getNatureOfCase = (caseItem) => {
    return caseItem.natureOfCase || caseItem.caseType || caseItem.natureOfSuit || 'N/A';
  };

  // Title of the Case / Plaintiff VS Defendant
  const getCaseTitle = (caseItem) => {
    if (caseItem.caseTitle || caseItem.title) return caseItem.caseTitle || caseItem.title;
    if (caseItem.plaintiff || caseItem.defendant) {
      return `${caseItem.plaintiff || 'N/A'} VS ${caseItem.defendant || 'N/A'}`;
    }
    return 'Untitled Case';
  };

  // Hearing heading (Today's Hearing or Next Hearing)
  const getHearingHeading = (caseItem) => {
    const hearingDate = caseItem.nextDateOfHearing || caseItem.nextHearing || caseItem.nexthearing || caseItem.courtDetails?.nextDate;
    if (!hearingDate) return 'Hearing';
    
    const normalized = normalizeDate(hearingDate);
    if (normalized === todayStr) {
      return "Today's Hearing";
    }
    return 'Next Hearing';
  };

  const hasNextHearing = (caseItem) => {
    return caseItem.nextDateOfHearing || caseItem.nextHearing || caseItem.nexthearing;
  };

  const getHearingNotes = (caseItem) => {
    return caseItem.hearingNotes || caseItem.remarks || '';
  };

  // ============================================
  // Manual refresh
  // ============================================
  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      const result = await refreshData();
      if (result) {
        toast.success('🔄 Schedule refreshed successfully');
      } else {
        toast.error('Failed to refresh schedule');
      }
    } catch (error) {
      toast.error('Failed to refresh schedule');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Loading state
  // ============================================
  if (isLoading && localCases.length === 0) {
    return (
      <React.Fragment>
        <div className="modal-overlay" onClick={onClose} />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="modal-container max-w-6xl">
            <div className="modal-header bg-gradient-to-r from-[#0F4C75] to-[#3282B8]">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaCalendarDay className="text-base sm:text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-xl font-bold text-white">Today's Schedule</h3>
                  <p className="text-white/70 text-[10px] sm:text-sm">Loading...</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <FaTimes className="text-base sm:text-xl" />
              </button>
            </div>
            <div className="p-12 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-[#3282B8] mx-auto mb-4" />
                <p className="text-[#6B7280]">Loading today's schedule...</p>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (!isOpen) return null;

  return (
    <React.Fragment>
      {/* Main Modal */}
      <div className="modal-overlay" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
        <div className="modal-container max-w-6xl w-full">

          {/* Header */}
          <div className="modal-header bg-gradient-to-r from-[#0F4C75] to-[#3282B8]">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                <FaCalendarDay className="text-base sm:text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-xl font-bold text-white">Today's Schedule</h3>
                <p className="text-white/70 text-[10px] sm:text-sm">
                  {todayCases.length} case{todayCases.length !== 1 ? 's' : ''} scheduled for today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50"
                title="Refresh"
              >
                <FaSync className={`text-sm sm:text-base ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0"
              >
                <FaTimes className="text-base sm:text-xl" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3 sm:p-4">

            {/* Status bar */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-[#6B7280]">
                Showing <strong className="text-[#0F4C75]">{todayCases.length}</strong> case{todayCases.length !== 1 ? 's' : ''} for today
              </span>
              {isLoading && (
                <span className="text-xs text-[#3282B8] flex items-center gap-1">
                  <FaSpinner className="animate-spin" />
                  Refreshing...
                </span>
              )}
            </div>

            {/* Cases List View */}
            {todayCases.length > 0 ? (
              <div className="border border-[#BBE1FA]/40 rounded-xl overflow-hidden">
                <div className="max-h-[65vh] overflow-y-auto scrollbar-hide">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white">
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">Case No.</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider min-w-[160px]">Title of Case</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider min-w-[160px]">Plaintiff VS Defendant</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">Court Name</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">Nature of Case</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">Hearing Date</th>
                        <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayCases.map((caseItem, idx) => {
                        const caseId = caseItem._id || caseItem.id;
                        const showForm = showAddHearingForm === caseId;
                        const hasExistingHearing = hasNextHearing(caseItem);
                        const hearingHeading = getHearingHeading(caseItem);

                        return (
                          <React.Fragment key={caseId}>
                            <tr
                              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} border-b border-[#BBE1FA]/20 hover:bg-[#3282B8]/5 transition-colors align-top`}
                            >
                              {/* Case Number */}
                              <td className="px-3 py-3 text-xs font-semibold text-[#0F4C75] whitespace-nowrap">
                                #{caseItem.caseNumber || 'N/A'}
                              </td>

                              {/* Title of the Case */}
                              <td className="px-3 py-3 text-xs text-[#1B262C]">
                                <span className="font-medium">{caseItem.caseTitle || caseItem.title || 'N/A'}</span>
                              </td>

                              {/* Plaintiff VS Defendant */}
                              <td className="px-3 py-3">
                                <div className="text-xs font-semibold text-[#1B262C] flex items-center gap-1.5 flex-wrap">
                                  <FaUser className="text-[9px] text-[#0F4C75] flex-shrink-0" />
                                  <span>{caseItem.plaintiff || 'N/A'} <span className="text-[#3282B8] font-bold">VS</span> {caseItem.defendant || 'N/A'}</span>
                                </div>
                              </td>

                              {/* Name of the Court */}
                              <td className="px-3 py-3 text-xs text-[#1B262C]">
                                <span className="flex items-center gap-1.5">
                                  <FaBuilding className="text-[10px] text-[#3282B8] flex-shrink-0" />
                                  <span>{getCourtName(caseItem)}</span>
                                </span>
                              </td>

                              {/* Nature of the Case */}
                              <td className="px-3 py-3 text-xs text-[#1B262C] whitespace-nowrap">
                                {getNatureOfCase(caseItem)}
                              </td>

                              {/* Date of Hearing */}
                              <td className="px-3 py-3 text-xs whitespace-nowrap">
                                {hasExistingHearing ? (
                                  <div>
                                    <span className="flex items-center gap-1.5">
                                      <FaCalendarCheck className="text-[10px] text-[#0F4C75]" />
                                      <span className="text-[#1B262C] font-medium">
                                        {formatDate(caseItem.nextDateOfHearing || caseItem.nextHearing || caseItem.nexthearing)}
                                      </span>
                                    </span>
                                    <span className="text-[9px] font-medium text-[#0F4C75] bg-[#3282B8]/10 px-1.5 py-0.5 rounded-full border border-[#3282B8]/30 mt-0.5 inline-block">
                                      {hearingHeading}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[#9CA3AF] italic">Not scheduled</span>
                                )}
                                {getHearingNotes(caseItem) && (
                                  <div className="text-[10px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                                    <FaStickyNote className="text-[9px] flex-shrink-0" />
                                    <span className="truncate max-w-[140px]">{getHearingNotes(caseItem)}</span>
                                  </div>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5 justify-end">
                                  <button
                                    onClick={() => toggleAddHearingForm(caseItem)}
                                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${
                                      showForm
                                        ? 'bg-[#0F4C75] text-white shadow-sm'
                                        : 'bg-[#F0F4F8] text-[#0F4C75] hover:bg-[#3282B8]/20'
                                    }`}
                                    title="Add New Hearing"
                                  >
                                    <FaPlusCircle className="text-[10px]" />
                                    {showForm ? <FaChevronUp className="text-[9px]" /> : 'Add Hearing'}
                                  </button>
                                  <button
                                    onClick={() => handleViewCase(caseItem)}
                                    className="btn btn-primary btn-sm text-[11px] px-2.5 py-1 whitespace-nowrap"
                                  >
                                    <FaEye className="text-[10px]" /> View
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Inline Add Hearing panel row */}
                            {showForm && (
                              <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                                <td colSpan={7} className="px-3 pb-3">
                                  <div className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/40 animate-slide-down">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-5 h-5 rounded-full bg-[#0F4C75]/10 flex items-center justify-center">
                                        <FaCalendarCheck className="text-[10px] text-[#0F4C75]" />
                                      </div>
                                      <h5 className="text-xs font-semibold text-[#1B262C]">
                                        Add Further Hearing — {caseItem.caseNumber || 'N/A'}
                                      </h5>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[10px] font-medium text-[#6B7280] block mb-0.5">
                                          Hearing Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="date"
                                          value={hearingData.nextDateOfHearing}
                                          onChange={(e) => setHearingData(prev => ({
                                            ...prev,
                                            nextDateOfHearing: e.target.value
                                          }))}
                                          className="w-full px-2.5 py-1.5 border border-[#BBE1FA] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent bg-white"
                                          min={new Date().toISOString().split('T')[0]}
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-medium text-[#6B7280] block mb-0.5">
                                          Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={hearingData.hearingNotes}
                                          onChange={(e) => setHearingData(prev => ({
                                            ...prev,
                                            hearingNotes: e.target.value
                                          }))}
                                          placeholder="e.g. Client requests adjournment"
                                          className="w-full px-2.5 py-1.5 border border-[#BBE1FA] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-end mt-2 pt-2 border-t border-[#BBE1FA]/30">
                                      <button
                                        onClick={() => {
                                          setShowAddHearingForm(null);
                                          setHearingData({ nextDateOfHearing: '', hearingNotes: '' });
                                        }}
                                        className="px-3 py-1 text-xs text-[#6B7280] hover:text-[#1B262C] rounded-lg transition-all"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleSaveHearing(caseItem)}
                                        disabled={isSaving}
                                        className="px-3 py-1 text-xs bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1"
                                      >
                                        {isSaving ? (
                                          <React.Fragment>
                                            <FaSpinner className="animate-spin text-[10px]" />
                                            Saving...
                                          </React.Fragment>
                                        ) : (
                                          <React.Fragment>
                                            <FaSave className="text-[10px]" />
                                            Save Hearing
                                          </React.Fragment>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-state py-8">
                <div className="empty-icon text-5xl">📅</div>
                <h3 className="text-base font-semibold text-[#1B262C] mt-2">No cases scheduled for today</h3>
                <p className="text-sm text-[#6B7280]">You have no hearings or cases scheduled for today</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button onClick={onClose} className="btn btn-secondary text-sm">Close</button>
                </div>
              </div>
            )}

            {/* Footer */}
            {todayCases.length > 0 && (
              <div className="mt-3 p-2.5 bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg border border-[#BBE1FA]/30 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#6B7280]">
                  <strong className="text-[#0F4C75]">{todayCases.length}</strong> case{todayCases.length !== 1 ? 's' : ''} scheduled today
                </span>
                <button onClick={onClose} className="btn btn-secondary btn-sm text-xs px-3 py-1">Close</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Detail Report */}
      <CaseReportModal
        isOpen={isReportOpen}
        onClose={handleCloseReport}
        caseData={viewingCase}
        onAddHearing={(caseItem) => {
          handleCloseReport();
          setTimeout(() => {
            toggleAddHearingForm(caseItem);
          }, 300);
        }}
      />
    </React.Fragment>
  );
};

export default TodayScheduleModal;