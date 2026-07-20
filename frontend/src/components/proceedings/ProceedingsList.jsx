// frontend/src/components/proceedings/ProceedingsList.jsx
import React, { useState } from 'react';
import { 
  FaPlusCircle, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaClock, 
  FaGavel,
  FaUser,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProceedingsList = ({ 
  proceedings, 
  cases,
  onAddProceeding, 
  onUpdateProceeding, 
  onDeleteProceeding,
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProceeding, setEditingProceeding] = useState(null);
  const [selectedCase, setSelectedCase] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    caseId: '',
    type: 'Hearing',
    status: 'Scheduled',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '',
    location: '',
    courtroom: '',
    judge: '',
    description: '',
    agenda: '',
    outcome: '',
    remarks: '',
    attendees: '',
    opposingCounsel: '',
    notes: '',
  });

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProceedings = proceedings.filter(proceeding => {
    const matchSearch = 
      proceeding.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proceeding.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proceeding.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proceeding.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proceeding.judge?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || proceeding.status === statusFilter;
    const matchCase = !selectedCase || proceeding.caseId === selectedCase;
    
    return matchSearch && matchStatus && matchCase;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Adjourned': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'Rescheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <FaCalendarAlt className="text-blue-500" />;
      case 'In Progress': return <FaHourglassHalf className="text-yellow-500" />;
      case 'Completed': return <FaCheckCircle className="text-green-500" />;
      case 'Adjourned': return <FaClock className="text-orange-500" />;
      case 'Cancelled': return <FaTimesCircle className="text-red-500" />;
      case 'Rescheduled': return <FaClock className="text-purple-500" />;
      default: return <FaGavel className="text-gray-500" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingProceeding) {
        result = await onUpdateProceeding(editingProceeding.id || editingProceeding._id, formData);
      } else {
        result = await onAddProceeding(formData);
      }
      
      if (result.success) {
        toast.success(editingProceeding ? 'Proceeding updated!' : 'Proceeding added!');
        setIsModalOpen(false);
        setEditingProceeding(null);
        resetForm();
      } else {
        toast.error(result.error || 'Failed to save proceeding');
      }
    } catch (error) {
      console.error('Error saving proceeding:', error);
      toast.error('Failed to save proceeding');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      caseId: '',
      type: 'Hearing',
      status: 'Scheduled',
      date: new Date().toISOString().split('T')[0],
      time: '',
      duration: '',
      location: '',
      courtroom: '',
      judge: '',
      description: '',
      agenda: '',
      outcome: '',
      remarks: '',
      attendees: '',
      opposingCounsel: '',
      notes: '',
    });
    setSelectedCase('');
  };

  const handleEdit = (proceeding) => {
    setEditingProceeding(proceeding);
    setFormData({
      title: proceeding.title || '',
      caseId: proceeding.caseId || '',
      type: proceeding.type || 'Hearing',
      status: proceeding.status || 'Scheduled',
      date: proceeding.date ? new Date(proceeding.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: proceeding.time || '',
      duration: proceeding.duration || '',
      location: proceeding.location || '',
      courtroom: proceeding.courtroom || '',
      judge: proceeding.judge || '',
      description: proceeding.description || '',
      agenda: proceeding.agenda || '',
      outcome: proceeding.outcome || '',
      remarks: proceeding.remarks || '',
      attendees: proceeding.attendees ? proceeding.attendees.join(', ') : '',
      opposingCounsel: proceeding.opposingCounsel || '',
      notes: proceeding.notes || '',
    });
    setSelectedCase(proceeding.caseId || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this proceeding?')) {
      const result = await onDeleteProceeding(id);
      if (result.success) {
        toast.success('Proceeding deleted!');
      } else {
        toast.error(result.error || 'Failed to delete proceeding');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await onUpdateStatus(id, newStatus);
    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const getCaseTitle = (caseId) => {
    const found = cases.find(c => c.id === caseId || c._id === caseId);
    return found ? found.caseTitle || found.title : 'Unknown Case';
  };

  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Adjourned', 'Cancelled', 'Rescheduled'];
  const typeOptions = ['Hearing', 'Trial', 'Mediation', 'Arbitration', 'Conference', 'Filing', 'Order', 'Judgment', 'Other'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1B262C]">Proceedings</h2>
          <p className="text-sm text-[#6B7280]">Track case hearings and proceedings</p>
        </div>
        <button
          onClick={() => {
            setEditingProceeding(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium"
        >
          <FaPlusCircle className="text-xs" />
          Add Proceeding
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proceedings..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
        >
          <option value="all">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="px-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
        >
          <option value="">All Cases</option>
          {cases.map(c => (
            <option key={c.id || c._id} value={c.id || c._id}>
              {c.caseTitle || c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Proceedings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProceedings.map((proceeding) => (
          <div key={proceeding.id || proceeding._id} className="premium-card hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[#1B262C] text-sm truncate">{proceeding.title}</h3>
                <p className="text-xs text-[#6B7280]">{proceeding.caseNumber}</p>
                <p className="text-xs text-[#0F4C75]">{getCaseTitle(proceeding.caseId)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 ${getStatusColor(proceeding.status)}`}>
                {getStatusIcon(proceeding.status)}
                {proceeding.status || 'Scheduled'}
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              <p className="text-[#6B7280] flex items-center gap-2">
                <FaCalendarAlt className="text-[#3282B8] text-xs" />
                <span>{proceeding.date ? new Date(proceeding.date).toLocaleDateString() : 'N/A'}</span>
                {proceeding.time && (
                  <>
                    <FaClock className="text-[#3282B8] text-xs ml-2" />
                    <span>{proceeding.time}</span>
                  </>
                )}
              </p>
              {proceeding.location && (
                <p className="text-[#6B7280] flex items-center gap-2">
                  <FaBuilding className="text-[#3282B8] text-xs" />
                  <span>{proceeding.location}</span>
                </p>
              )}
              {proceeding.judge && (
                <p className="text-[#6B7280] flex items-center gap-2">
                  <FaUser className="text-[#3282B8] text-xs" />
                  <span>Judge: {proceeding.judge}</span>
                </p>
              )}
              <p className="text-[#6B7280] flex items-center gap-2">
                <FaGavel className="text-[#3282B8] text-xs" />
                <span>{proceeding.type || 'Hearing'}</span>
              </p>
            </div>

            {proceeding.description && (
              <p className="text-xs text-[#6B7280] mt-2 line-clamp-2 border-t border-[#BBE1FA] pt-2">
                {proceeding.description}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[#BBE1FA]">
              <select
                value={proceeding.status || 'Scheduled'}
                onChange={(e) => handleStatusChange(proceeding.id || proceeding._id, e.target.value)}
                className="text-xs px-2 py-1 border border-[#BBE1FA] rounded-lg bg-white text-[#1B262C] focus:outline-none focus:ring-2 focus:ring-[#3282B8]/20"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={() => handleEdit(proceeding)}
                className="p-1.5 text-[#0F4C75] hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(proceeding.id || proceeding._id)}
                className="p-1.5 text-[#EF4444] hover:text-[#EF4444]/80 hover:bg-[#EF4444]/10 rounded-lg transition-all"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProceedings.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">⚖️</div>
            <h3 className="text-lg font-semibold text-[#1B262C] mb-1">No proceedings found</h3>
            <p className="text-[#6B7280] text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Add a proceeding to track case hearings'}
            </p>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-[#1B262C] opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#1B262C]">
                    {editingProceeding ? 'Edit Proceeding' : 'Add New Proceeding'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#6B7280] hover:text-[#1B262C]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      required
                      placeholder="e.g., Pre-Trial Conference"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Associated Case *</label>
                    <select
                      name="caseId"
                      value={formData.caseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      required
                    >
                      <option value="">Select a case...</option>
                      {cases.map(c => (
                        <option key={c.id || c._id} value={c.id || c._id}>
                          {c.caseTitle || c.title} - {c.caseNumber || 'No number'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      >
                        {typeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Courtroom</label>
                      <input
                        type="text"
                        name="courtroom"
                        value={formData.courtroom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Judge</label>
                    <input
                      type="text"
                      name="judge"
                      value={formData.judge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Agenda</label>
                    <textarea
                      name="agenda"
                      value={formData.agenda}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Outcome</label>
                    <input
                      type="text"
                      name="outcome"
                      value={formData.outcome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Attendees (comma separated)</label>
                    <input
                      type="text"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      placeholder="e.g., John Doe, Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Opposing Counsel</label>
                    <input
                      type="text"
                      name="opposingCounsel"
                      value={formData.opposingCounsel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#BBE1FA]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#0F4C75] text-white text-sm font-medium rounded-xl hover:bg-[#1B262C] transition-all"
                    >
                      {editingProceeding ? 'Update Proceeding' : 'Add Proceeding'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProceedingsList;