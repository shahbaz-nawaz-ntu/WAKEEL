// src/components/modals/AddReferenceModal.jsx
import React, { useState } from 'react';
import { 
  FaTimes, 
  FaBook, 
  FaGavel, 
  FaBuilding, 
  FaUser, 
  FaCalendarAlt,
  FaTag,
  FaFilePdf,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import toast from 'react-hot-toast';

const AddReferenceModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    description: '',
    citation: '',
    court: '',
    judge: '',
    verdict: 'Pending',
    dateDecided: '',
    practiceArea: '',
    summary: '',
    keyIssues: '',
    outcomes: '',
    tags: '',
    url: '',
    status: 'active',
    priority: 'Medium',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FaBook },
    { id: 'legal', label: 'Legal Details', icon: FaGavel },
    { id: 'additional', label: 'Additional', icon: FaInfoCircle },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        setIsSubmitting(false);
        return;
      }

      if (!formData.title || !formData.citation || !formData.court) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const referenceData = {
        ...formData,
        keyIssues: formData.keyIssues ? formData.keyIssues.split(',').map(item => item.trim()).filter(item => item) : [],
        tags: formData.tags ? formData.tags.split(',').map(item => item.trim()).filter(item => item) : [],
      };

      console.log('📤 Sending reference data:', referenceData);

      let result;
      
      if (onAdd) {
        result = await onAdd(referenceData);
      } else {
        const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/references', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(referenceData)
        });
        result = await response.json();
      }

      if (result && result.success) {
        toast.success('✅ Reference case added successfully!');
        onClose();
        resetForm();
      } else {
        toast.error(result?.error || 'Failed to add reference');
      }
    } catch (error) {
      console.error('Error adding reference:', error);
      toast.error(error.message || 'Failed to add reference');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      caseNumber: '',
      description: '',
      citation: '',
      court: '',
      judge: '',
      verdict: 'Pending',
      dateDecided: '',
      practiceArea: '',
      summary: '',
      keyIssues: '',
      outcomes: '',
      tags: '',
      url: '',
      status: 'active',
      priority: 'Medium',
    });
    setActiveTab('basic');
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Smith v. Jones"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Case Number
          </label>
          <input
            type="text"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={handleInputChange}
            placeholder="e.g., REF-2024-0001"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="2"
          placeholder="Brief description of the case"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Citation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="citation"
            value={formData.citation}
            onChange={handleInputChange}
            placeholder="e.g., 123 U.S. 456 (2020)"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Court <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="court"
            value={formData.court}
            onChange={handleInputChange}
            placeholder="e.g., Supreme Court"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Judge
          </label>
          <input
            type="text"
            name="judge"
            value={formData.judge}
            onChange={handleInputChange}
            placeholder="e.g., Justice Roberts"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Date Decided
          </label>
          <input
            type="date"
            name="dateDecided"
            value={formData.dateDecided}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderLegalDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Verdict
          </label>
          <select
            name="verdict"
            value={formData.verdict}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          >
            <option value="Upheld">Upheld</option>
            <option value="Reversed">Reversed</option>
            <option value="Modified">Modified</option>
            <option value="Remanded">Remanded</option>
            <option value="Dismissed">Dismissed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Practice Area
          </label>
          <input
            type="text"
            name="practiceArea"
            value={formData.practiceArea}
            onChange={handleInputChange}
            placeholder="e.g., Criminal Law"
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          Summary
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          rows="3"
          placeholder="Detailed summary of the case"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          Key Issues (comma separated)
        </label>
        <input
          type="text"
          name="keyIssues"
          value={formData.keyIssues}
          onChange={handleInputChange}
          placeholder="e.g., Constitutional Law, Due Process, Equal Protection"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          Outcomes
        </label>
        <textarea
          name="outcomes"
          value={formData.outcomes}
          onChange={handleInputChange}
          rows="2"
          placeholder="What was the result/outcome of the case"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          Tags (comma separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="e.g., Landmark, Precedent, Constitutional"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
          URL / Link
        </label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          placeholder="https://example.com/case"
          className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-[#F0F4F8] border border-[#BBE1FA] rounded-xl text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-4 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
        <div className="flex items-center justify-between w-full pt-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C75]/25">
              <FaBook className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1B262C]">Add Reference Case</h2>
              <p className="text-sm text-[#6B7280]">Add a legal precedent or reference case</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#3282B8]/10 rounded-xl">
            <FaTimes className="text-xl" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto bg-[#F8FAFC] p-6">
        <div className="w-full">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA] w-full">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm flex-1 min-w-[100px] justify-center ${
                  activeTab === tab.id
                    ? 'gradient-accent text-white shadow-lg shadow-[#0F4C75]/25'
                    : 'text-[#6B7280] hover:text-[#1B262C] hover:bg-[#3282B8]/10'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-[#3282B8]/10 text-[#0F4C75]'
                }`}>
                  {index + 1}
                </span>
                <tab.icon className="text-sm" />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-premium w-full">
              {activeTab === 'basic' && renderBasicInfo()}
              {activeTab === 'legal' && renderLegalDetails()}
              {activeTab === 'additional' && renderAdditionalInfo()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200"
              >
                Cancel
              </button>
              
              <div className="flex-1 flex gap-3 justify-end">
                {!isFirstTab && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200"
                  >
                    <FaArrowLeft className="text-sm" />
                    Previous
                  </button>
                )}
                
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 btn-primary"
                  >
                    Next
                    <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Reference Case'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReferenceModal;