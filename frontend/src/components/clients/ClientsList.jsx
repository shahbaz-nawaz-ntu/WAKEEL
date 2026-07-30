// src/components/clients/ClientsList.jsx
import React, { useState } from 'react';
import { 
  FaPlusCircle, FaSearch, FaEdit, FaTrash, FaUser, 
  FaEnvelope, FaPhone, FaBriefcase, FaIdCard, FaCheckCircle,
  FaTimesCircle, FaClock, FaUserCircle, FaBuilding,
  FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, FaTag,
  FaChevronRight, FaEye
} from 'react-icons/fa';
import { MdBusiness, MdLocationOn, MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';

const ClientsList = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'Individual',
    status: 'active',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: '',
  });

  // Get unique statuses for filter
  const statuses = ['all', ...new Set(clients.map(c => c.status || 'active'))];

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery) ||
      client.clientId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name?.trim()) {
        toast.error('Client name is required');
        return;
      }

      let result;
      
      if (editingClient) {
        const clientId = editingClient.id || editingClient._id;
        
        if (!clientId) {
          toast.error('Invalid client ID');
          return;
        }
        
        result = await onEditClient(clientId, formData);
      } else {
        result = await onAddClient(formData);
      }
      
      if (result?.success) {
        toast.success(editingClient ? 'Client updated successfully!' : 'Client added successfully!');
        setIsAddModalOpen(false);
        setEditingClient(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          type: 'Individual',
          status: 'active',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          notes: '',
        });
      } else {
        toast.error(result?.error || 'Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(error.message || 'Failed to save client');
    }
  };

  const handleEdit = (client) => {
    if (!client || (!client.id && !client._id)) {
      toast.error('Cannot edit client - invalid data');
      return;
    }
    
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      type: client.type || 'Individual',
      status: client.status || 'active',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      country: client.country || '',
      notes: client.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid client ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const result = await onDeleteClient(id);
        if (result?.success) {
          toast.success('Client deleted successfully!');
        } else {
          toast.error(result?.error || 'Failed to delete client');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { 
          color: 'bg-emerald-100 text-emerald-700',
          dotColor: 'bg-emerald-500',
          icon: FaCheckCircle,
          label: 'Active'
        };
      case 'inactive':
        return { 
          color: 'bg-amber-100 text-amber-700',
          dotColor: 'bg-amber-500',
          icon: FaClock,
          label: 'Inactive'
        };
      case 'archived':
        return { 
          color: 'bg-gray-100 text-gray-700',
          dotColor: 'bg-gray-500',
          icon: FaTimesCircle,
          label: 'Archived'
        };
      default:
        return { 
          color: 'bg-blue-100 text-blue-700',
          dotColor: 'bg-blue-500',
          icon: FaUser,
          label: status || 'Active'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1B262C] flex items-center gap-3">
            <span>Clients</span>
            <span className="text-sm font-normal text-[#6B7280] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#BBE1FA]">
              {filteredClients.length} total
            </span>
          </h2>
          <p className="text-sm text-[#6B7280]">Manage your clients and contacts</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              type: 'Individual',
              status: 'active',
              address: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
              notes: '',
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FaPlusCircle className="text-xs" />
          Add Client
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#0F4C75] text-white shadow-md shadow-[#0F4C75]/20'
                  : 'bg-white text-[#6B7280] border border-[#BBE1FA] hover:bg-[#F8FAFC]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid - Ultra Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredClients.map((client) => {
          const StatusIcon = getStatusConfig(client.status).icon;
          const statusConfig = getStatusConfig(client.status);
          const clientId = client.id || client._id || Math.random().toString();
          
          return (
            <div 
              key={clientId} 
              className="bg-white rounded-lg border border-[#BBE1FA] overflow-hidden hover:shadow-md hover:shadow-[#0F4C75]/5 transition-all duration-200"
            >
              <div className="p-3">
                {/* Header - Client Name & ID */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B262C] to-[#0F4C75] flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0">
                      {client.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#1B262C] text-xs truncate">
                        {client.name || 'Unnamed'}
                      </h3>
                      {client.clientId && (
                        <p className="text-[9px] text-[#6B7280] font-mono truncate">
                          #{client.clientId}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium whitespace-nowrap ${statusConfig.color}`}>
                    <span className={`w-1 h-1 rounded-full ${statusConfig.dotColor}`}></span>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Client Details - Compact */}
                <div className="mt-1.5 space-y-0.5">
                  {client.type && (
                    <div className="flex items-center gap-1">
                      <FaTag className="text-[#3282B8] text-[8px]" />
                      <span className="text-[9px] text-[#6B7280]">{client.type}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-1 truncate">
                      <FaEnvelope className="text-[#3282B8] text-[8px] flex-shrink-0" />
                      <span className="text-[9px] text-[#6B7280] truncate">{client.email}</span>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <FaPhone className="text-[#3282B8] text-[8px]" />
                      <span className="text-[9px] text-[#6B7280]">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="flex items-center gap-1 truncate">
                      <MdBusiness className="text-[#3282B8] text-[8px] flex-shrink-0" />
                      <span className="text-[9px] text-[#6B7280] truncate">{client.company}</span>
                    </div>
                  )}
                </div>

                {/* Footer - Date & Actions */}
                <div className="mt-2 pt-1.5 border-t border-[#BBE1FA] flex items-center justify-between">
                  <span className="text-[8px] text-[#6B7280]">
                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-1.5 py-0.5 text-[8px] font-medium text-[#3282B8] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(clientId)}
                      className="px-1.5 py-0.5 text-[8px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-1.5 py-0.5 text-[8px] font-medium text-[#3282B8] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded transition-all duration-200"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#BBE1FA]">
          <div className="max-w-md mx-auto">
            <div className="text-7xl mb-4 flex justify-center">
              <FaUserCircle className="text-[#BBE1FA]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
              {searchQuery || selectedStatus !== 'all' ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-[#6B7280] text-sm mb-6">
              {searchQuery || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for'
                : 'Start by adding your first client to the system'}
            </p>
            {!searchQuery && selectedStatus === 'all' && (
              <button
                onClick={() => {
                  setEditingClient(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    type: 'Individual',
                    status: 'active',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                    notes: '',
                  });
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FaPlusCircle className="text-xs" />
                Add Your First Client
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsAddModalOpen(false)}>
              <div className="absolute inset-0 bg-[#1B262C] opacity-50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {editingClient ? (
                      <>
                        <FaEdit className="text-lg" />
                        Edit Client
                      </>
                    ) : (
                      <>
                        <FaPlusCircle className="text-lg" />
                        Add New Client
                      </>
                    )}
                  </h3>
                  <button 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  {editingClient ? 'Update client information' : 'Fill in the details to add a new client'}
                </p>
              </div>

              <div className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter client name"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="client@example.com"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Client Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                        <option value="Law Firm">Law Firm</option>
                        <option value="Government">Government</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 bg-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="ZIP"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Additional notes about this client..."
                      className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#BBE1FA]">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F8FAFC] rounded-xl transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {editingClient ? 'Update Client' : 'Add Client'}
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

export default ClientsList;