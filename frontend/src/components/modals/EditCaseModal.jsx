// src/components/modals/EditCaseModal.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const EditCaseModal = ({ isOpen, case: caseData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    // Case Identification
    caseNumber: '',
    courtNo: '',
    cmsNo: '',
    officeNo: '',
    
    // Basic Information
    caseTitle: '',
    description: '',
    party: 'N/A',
    
    // Status & Priority
    status: 'active',
    priority: 'Medium',
    
    // Case Type
    caseType: 'Civil',
    
    // Case Nature
    trial: '',
    appeal: '',
    
    // Court Details
    courtName: '',
    district: '',
    courtPreviousDate: '',
    nextDate: '',
    
    // Remarks
    remarks: '',
    
    // Institute
    instituteDate: '',
    instituteNo: '',
    
    // Associate
    associateName: '',
    associateDistrict: '',
    
    // Additional fields
    amount: 'N/A',
    judge: 'N/A',
    attorneys: 'N/A',
    assignedTo: 'N/A',
    location: 'N/A',
    court: 'N/A',
    nexthearing: 'N/A',
    hearings: 0,
    documentsCount: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caseData) {
      console.log('📝 EditModal - Loading case data:', caseData);
      
      setFormData({
        // Case Identification
        caseNumber: caseData.caseNumber || '',
        courtNo: caseData.courtNo || '',
        cmsNo: caseData.cmsNo || '',
        officeNo: caseData.officeNo || '',
        
        // Basic Information
        caseTitle: caseData.caseTitle || caseData.title || '',
        description: caseData.description || '',
        party: caseData.party || 'N/A',
        
        // Status & Priority
        status: caseData.status || 'active',
        priority: caseData.priority || 'Medium',
        caseType: caseData.caseType || 'Civil',
        
        // Case Nature
        trial: caseData.caseNature?.trial || '',
        appeal: caseData.caseNature?.appeal || '',
        
        // Court Details
        courtName: caseData.courtDetails?.courtName || '',
        district: caseData.courtDetails?.district || '',
        courtPreviousDate: caseData.courtDetails?.courtPreviousDate || '',
        nextDate: caseData.courtDetails?.nextDate || '',
        
        // Remarks
        remarks: caseData.remarks || '',
        
        // Institute
        instituteDate: caseData.instituteDate || '',
        instituteNo: caseData.instituteNo || '',
        
        // Associate
        associateName: caseData.associate?.name || '',
        associateDistrict: caseData.associate?.district || '',
        
        // Additional fields
        amount: caseData.amount || 'N/A',
        judge: caseData.judge || 'N/A',
        attorneys: caseData.attorneys || 'N/A',
        assignedTo: caseData.assignedTo || 'N/A',
        location: caseData.location || 'N/A',
        court: caseData.court || 'N/A',
        nexthearing: caseData.nexthearing || 'N/A',
        hearings: caseData.hearings || 0,
        documentsCount: caseData.documentsCount || 0,
      });
    }
  }, [caseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const caseId = caseData._id || caseData.id;
      console.log(`📤 Submitting update for case: ${caseId}`);
      
      const updateData = {
        // Case Identification
        caseNumber: formData.caseNumber || caseData.caseNumber,
        courtNo: formData.courtNo || caseData.courtNo,
        cmsNo: formData.cmsNo || caseData.cmsNo,
        officeNo: formData.officeNo || caseData.officeNo,
        
        // Basic Information
        caseTitle: formData.caseTitle || caseData.caseTitle,
        title: formData.caseTitle || caseData.caseTitle,
        description: formData.description || '',
        party: formData.party || 'N/A',
        
        // Status & Priority
        status: formData.status || 'active',
        priority: formData.priority || 'Medium',
        caseType: formData.caseType || 'Civil',
        
        // Case Nature
        caseNature: {
          trial: formData.trial || caseData.caseNature?.trial || '',
          appeal: formData.appeal || caseData.caseNature?.appeal || '',
        },
        
        // Court Details
        courtDetails: {
          courtName: formData.courtName || caseData.courtDetails?.courtName || '',
          district: formData.district || caseData.courtDetails?.district || '',
          courtPreviousDate: formData.courtPreviousDate || caseData.courtDetails?.courtPreviousDate || '',
          nextDate: formData.nextDate || caseData.courtDetails?.nextDate || '',
        },
        
        // Remarks
        remarks: formData.remarks || '',
        
        // Institute
        instituteDate: formData.instituteDate || '',
        instituteNo: formData.instituteNo || '',
        
        // Associate
        associate: {
          name: formData.associateName || caseData.associate?.name || '',
          district: formData.associateDistrict || caseData.associate?.district || '',
        },
        
        // Additional fields
        amount: formData.amount || 'N/A',
        judge: formData.judge || 'N/A',
        attorneys: formData.attorneys || 'N/A',
        assignedTo: formData.assignedTo || 'N/A',
        location: formData.location || 'N/A',
        court: formData.court || 'N/A',
        nexthearing: formData.nexthearing || 'N/A',
        hearings: parseInt(formData.hearings) || 0,
        documentsCount: parseInt(formData.documentsCount) || 0,
      };

      console.log('📤 Update data:', updateData);
      
      const result = await onUpdate(caseId, updateData);
      console.log('📥 Update result:', result);
      
      if (result.success) {
        toast.success('Case updated successfully!');
        onClose();
      } else {
        toast.error(result.error || 'Failed to update case');
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      toast.error('Failed to update case');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#BBE1FA] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#1B262C]">Edit Case</h2>
                <p className="text-sm text-[#6B7280]">Update case details below</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="editCaseForm"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0F4C75] text-white text-sm font-medium rounded-xl hover:bg-[#1B262C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0F4C75]/25 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content - SAME AS ADD CASE */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form id="editCaseForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* ===== CASE IDENTIFICATION ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6 border-l-4 border-[#0F4C75]">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Case Identification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Case No.</label>
                  <input
                    type="text"
                    name="caseNumber"
                    value={formData.caseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Court No.</label>
                  <input
                    type="text"
                    name="courtNo"
                    value={formData.courtNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Court Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">CMS No.</label>
                  <input
                    type="text"
                    name="cmsNo"
                    value={formData.cmsNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="CMS Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Office No.</label>
                  <input
                    type="text"
                    name="officeNo"
                    value={formData.officeNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Office Number"
                  />
                </div>
              </div>
            </div>

            {/* ===== BASIC INFORMATION ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Case Title *</label>
                  <input
                    type="text"
                    name="caseTitle"
                    value={formData.caseTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Party</label>
                  <input
                    type="text"
                    name="party"
                    value={formData.party}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="e.g., Plaintiff / Defendant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Case Type</label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  >
                    <option value="Civil">Civil</option>
                    <option value="Labour">Labour</option>
                    <option value="Service">Service</option>
                    <option value="Tax">Tax</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Family">Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Brief description of the case..."
                  />
                </div>
              </div>
            </div>

            {/* ===== CASE NATURE ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Case Nature
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Trial</label>
                  <input
                    type="text"
                    name="trial"
                    value={formData.trial}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Trial details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Appeal</label>
                  <input
                    type="text"
                    name="appeal"
                    value={formData.appeal}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Appeal details"
                  />
                </div>
              </div>
            </div>

            {/* ===== COURT DETAILS ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Court Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Court Name</label>
                  <input
                    type="text"
                    name="courtName"
                    value={formData.courtName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="e.g., District Court"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="District name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Previous Date</label>
                  <input
                    type="date"
                    name="courtPreviousDate"
                    value={formData.courtPreviousDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Next Date</label>
                  <input
                    type="date"
                    name="nextDate"
                    value={formData.nextDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* ===== STATUS & PRIORITY ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Status & Priority
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ===== REMARKS ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Remarks
              </h3>
              <div>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  placeholder="Any additional remarks..."
                />
              </div>
            </div>

            {/* ===== INSTITUTE ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Institute
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Institute Date</label>
                  <input
                    type="date"
                    name="instituteDate"
                    value={formData.instituteDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Institute No.</label>
                  <input
                    type="text"
                    name="instituteNo"
                    value={formData.instituteNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Institute Number"
                  />
                </div>
              </div>
            </div>

            {/* ===== ASSOCIATE ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Associate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Name</label>
                  <input
                    type="text"
                    name="associateName"
                    value={formData.associateName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Associate name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">District</label>
                  <input
                    type="text"
                    name="associateDistrict"
                    value={formData.associateDistrict}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Associate district"
                  />
                </div>
              </div>
            </div>

            {/* ===== ADDITIONAL INFORMATION ===== */}
            <div className="bg-[#F0F4F8] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#0F4C75] mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#0F4C75] rounded-full"></span>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Amount</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="e.g., $50,000 or N/A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Judge</label>
                  <input
                    type="text"
                    name="judge"
                    value={formData.judge}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="e.g., Hon. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    placeholder="Attorney name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Next Hearing</label>
                  <input
                    type="date"
                    name="nexthearing"
                    value={formData.nexthearing}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Hearings</label>
                  <input
                    type="number"
                    name="hearings"
                    value={formData.hearings}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Documents Count</label>
                  <input
                    type="number"
                    name="documentsCount"
                    value={formData.documentsCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCaseModal;