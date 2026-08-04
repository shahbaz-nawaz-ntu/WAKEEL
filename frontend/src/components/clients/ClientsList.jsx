// src/components/clients/ClientsList.jsx
import React, { useState, useMemo } from 'react';
import { 
  FaPlusCircle, FaSearch, FaEdit, FaTrash, FaUser, 
  FaEnvelope, FaPhone, FaBriefcase, FaIdCard, FaCheckCircle,
  FaTimesCircle, FaClock, FaUserCircle, FaBuilding,
  FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, FaTag,
  FaChevronRight, FaEye, FaFilter, FaSort, FaSortUp, FaSortDown,
  FaUsers, FaUserPlus, FaUserCheck, FaUserTimes, FaChartPie,
  FaDownload, FaPrint, FaShareAlt, FaStar, FaStarHalfAlt,
  FaRegStar, FaComments, FaHistory, FaFileInvoice,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdBusiness, MdLocationOn, MdVerified, MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';

const ClientsList = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    client: null,
    clientName: '',
  });

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
    gst: '',
    pan: '',
    website: '',
    industry: '',
  });

  // Get unique statuses and types for filters
  const statuses = ['all', ...new Set(clients.map(c => c.status || 'active'))];
  const types = ['all', ...new Set(clients.map(c => c.type || 'Individual'))];

  // Helper function to get client ID
  const getClientId = (client) => {
    return client?._id || client?.id || null;
  };

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      const matchesSearch = client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.includes(searchQuery) ||
        client.clientId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
      const matchesType = selectedType === 'all' || client.type === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [clients, searchQuery, selectedStatus, selectedType, sortField, sortDirection]);

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
        const clientId = getClientId(editingClient);
        
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
          gst: '',
          pan: '',
          website: '',
          industry: '',
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
    const clientId = getClientId(client);
    
    if (!clientId) {
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
      gst: client.gst || '',
      pan: client.pan || '',
      website: client.website || '',
      industry: client.industry || '',
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (client) => {
    const clientId = getClientId(client);
    
    if (!clientId) {
      toast.error('Invalid client ID');
      return;
    }
    
    // ✅ Open the professional delete modal instead of window.confirm
    setDeleteModal({
      isOpen: true,
      client: client,
      clientName: client.name || 'this client',
    });
  };

  const confirmDelete = async () => {
    const client = deleteModal.client;
    const clientId = getClientId(client);
    
    if (!clientId) {
      toast.error('Invalid client ID');
      setDeleteModal({ isOpen: false, client: null, clientName: '' });
      return;
    }
    
    try {
      const result = await onDeleteClient(clientId);
      if (result?.success) {
        toast.success('Client deleted successfully!');
        setDeleteModal({ isOpen: false, client: null, clientName: '' });
      } else {
        toast.error(result?.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Individual':
        return <FaUser className="text-[#3282B8]" />;
      case 'Company':
        return <MdBusiness className="text-[#3282B8]" />;
      case 'Law Firm':
        return <FaBuilding className="text-[#3282B8]" />;
      case 'Government':
        return <FaUsers className="text-[#3282B8]" />;
      default:
        return <FaUser className="text-[#3282B8]" />;
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
              {filteredClients.length} / {clients.length}
            </span>
          </h2>
          <p className="text-sm text-[#6B7280]">Manage your clients and contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#0F4C75] text-white' : 'bg-white text-[#6B7280] border border-[#BBE1FA] hover:bg-[#F8FAFC]'}`}
            title="Grid View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#0F4C75] text-white' : 'bg-white text-[#6B7280] border border-[#BBE1FA] hover:bg-[#F8FAFC]'}`}
            title="List View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
                gst: '',
                pan: '',
                website: '',
                industry: '',
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <FaPlusCircle className="text-xs" />
            Add Client
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
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
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-white border border-[#BBE1FA] rounded-xl px-3 py-1">
            <FaFilter className="text-[#6B7280] text-xs" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-sm text-[#1B262C] focus:outline-none py-1.5"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-white border border-[#BBE1FA] rounded-xl px-3 py-1">
            <FaUser className="text-[#6B7280] text-xs" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-sm text-[#1B262C] focus:outline-none py-1.5"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sort Indicators */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
        <span className="font-medium">Sort by:</span>
        {['name', 'email', 'company', 'type', 'status'].map((field) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
              sortField === field 
                ? 'bg-[#0F4C75]/10 text-[#0F4C75] font-medium' 
                : 'hover:bg-[#F8FAFC]'
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field && (
              sortDirection === 'asc' ? <FaSortUp className="text-[10px]" /> : <FaSortDown className="text-[10px]" />
            )}
          </button>
        ))}
      </div>

      {/* Clients Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((client) => {
            const StatusIcon = getStatusConfig(client.status).icon;
            const statusConfig = getStatusConfig(client.status);
            const clientId = getClientId(client) || Math.random().toString();
            
            return (
              <div 
                key={clientId} 
                className="bg-white rounded-xl border border-[#BBE1FA] overflow-hidden hover:shadow-xl hover:shadow-[#0F4C75]/10 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1B262C] to-[#0F4C75] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                        {client.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[#1B262C] text-sm truncate group-hover:text-[#0F4C75] transition-colors">
                          {client.name || 'Unnamed'}
                        </h3>
                        {client.clientId && (
                          <p className="text-[10px] text-[#6B7280] font-mono truncate">
                            #{client.clientId}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${statusConfig.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-2.5 space-y-1.5">
                    {client.type && (
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <span className="text-[#3282B8]">{getTypeIcon(client.type)}</span>
                        <span>{client.type}</span>
                      </div>
                    )}
                    
                    {client.email && (
                      <div className="flex items-center gap-2 truncate text-xs text-[#6B7280]">
                        <FaEnvelope className="text-[#3282B8] text-[10px] flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <FaPhone className="text-[#3282B8] text-[10px]" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    
                    {client.company && (
                      <div className="flex items-center gap-2 truncate text-xs text-[#6B7280]">
                        <MdBusiness className="text-[#3282B8] text-[10px] flex-shrink-0" />
                        <span className="truncate">{client.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions - Professional Buttons */}
                  <div className="mt-3.5 pt-3 border-t border-[#BBE1FA] flex items-center justify-between">
                    <span className="text-[9px] text-[#6B7280]">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* 👁️ View Button - Professional */}
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="px-3 py-1 text-[10px] font-medium text-white bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-[#0F4C75]/30 flex items-center gap-1.5"
                      >
                        <FaEye className="text-[9px]" />
                        View
                      </button>
                      
                      {/* ✏️ Edit Button */}
                      <button
                        onClick={() => handleEdit(client)}
                        className="px-3 py-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all duration-200 flex items-center gap-1.5"
                      >
                        <FaEdit className="text-[9px]" />
                        Edit
                      </button>
                      
                      {/* 🗑️ Delete Button - Colored */}
                      <button
                        onClick={() => handleDelete(client)}
                        className="px-3 py-1 text-[10px] font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:shadow-md hover:shadow-red-500/30 transition-all duration-200 flex items-center gap-1.5"
                      >
                        <FaTrash className="text-[9px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl border border-[#BBE1FA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#BBE1FA]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BBE1FA]">
                {filteredClients.map((client) => {
                  const statusConfig = getStatusConfig(client.status);
                  const clientId = getClientId(client);
                  
                  return (
                    <tr key={clientId || Math.random().toString()} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B262C] to-[#0F4C75] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {client.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-[#1B262C]">{client.name || 'Unnamed'}</div>
                            {client.clientId && (
                              <div className="text-[10px] text-[#6B7280] font-mono">#{client.clientId}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                              <FaEnvelope className="text-[#3282B8] text-[10px]" />
                              <span>{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                              <FaPhone className="text-[#3282B8] text-[10px]" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">
                        {client.company || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
                          {getTypeIcon(client.type)}
                          {client.type || 'Individual'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusConfig.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* 👁️ View Button - Professional */}
                          <button
                            onClick={() => handleViewDetails(client)}
                            className="px-3 py-1.5 text-[10px] font-medium text-white bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-[#0F4C75]/30 flex items-center gap-1.5"
                          >
                            <FaEye className="text-[9px]" />
                            View
                          </button>
                          
                          {/* ✏️ Edit Button */}
                          <button
                            onClick={() => handleEdit(client)}
                            className="px-3 py-1.5 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all duration-200 flex items-center gap-1.5"
                          >
                            <FaEdit className="text-[9px]" />
                            Edit
                          </button>
                          
                          {/* 🗑️ Delete Button - Colored */}
                          <button
                            onClick={() => handleDelete(client)}
                            className="px-3 py-1.5 text-[10px] font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:shadow-md hover:shadow-red-500/30 transition-all duration-200 flex items-center gap-1.5"
                          >
                            <FaTrash className="text-[9px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#BBE1FA]">
          <div className="max-w-md mx-auto">
            <div className="text-7xl mb-4 flex justify-center">
              <FaUserCircle className="text-[#BBE1FA]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
              {searchQuery || selectedStatus !== 'all' || selectedType !== 'all' ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-[#6B7280] text-sm mb-6">
              {searchQuery || selectedStatus !== 'all' || selectedType !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for'
                : 'Start by adding your first client to the system'}
            </p>
            {!searchQuery && selectedStatus === 'all' && selectedType === 'all' && (
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
                    gst: '',
                    pan: '',
                    website: '',
                    industry: '',
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

      {/* Add/Edit Modal - Same as before */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsAddModalOpen(false)}>
              <div className="absolute inset-0 bg-[#1B262C] opacity-50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g. Legal, IT, Finance"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">GST Number</label>
                      <input
                        type="text"
                        name="gst"
                        value={formData.gst}
                        onChange={handleInputChange}
                        placeholder="GSTIN"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1.5">PAN Number</label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        placeholder="PAN"
                        className="w-full px-4 py-2.5 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1.5">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
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

      {/* Client Detail Modal */}
      {isDetailModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsDetailModalOpen(false)}>
              <div className="absolute inset-0 bg-[#1B262C] opacity-50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                      {selectedClient.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedClient.name}</h3>
                      {selectedClient.clientId && (
                        <p className="text-white/70 text-sm">#{selectedClient.clientId}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailModalOpen(false)} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Email</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Company</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.company || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Type</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.type || 'Individual'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusConfig(selectedClient.status).color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(selectedClient.status).dotColor}`}></span>
                      {getStatusConfig(selectedClient.status).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Industry</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.industry || 'N/A'}</p>
                  </div>
                </div>

                {selectedClient.address && (
                  <div className="mt-4 pt-4 border-t border-[#BBE1FA]">
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Address</p>
                    <p className="text-sm text-[#1B262C]">{selectedClient.address}</p>
                    <p className="text-sm text-[#6B7280]">
                      {selectedClient.city && `${selectedClient.city}, `}
                      {selectedClient.state && `${selectedClient.state} `}
                      {selectedClient.zipCode && `- ${selectedClient.zipCode}`}
                      {selectedClient.country && `, ${selectedClient.country}`}
                    </p>
                  </div>
                )}

                {(selectedClient.gst || selectedClient.pan) && (
                  <div className="mt-4 pt-4 border-t border-[#BBE1FA] grid grid-cols-2 gap-4">
                    {selectedClient.gst && (
                      <div>
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">GST</p>
                        <p className="text-sm text-[#1B262C]">{selectedClient.gst}</p>
                      </div>
                    )}
                    {selectedClient.pan && (
                      <div>
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">PAN</p>
                        <p className="text-sm text-[#1B262C]">{selectedClient.pan}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedClient.website && (
                  <div className="mt-4 pt-4 border-t border-[#BBE1FA]">
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Website</p>
                    <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#3282B8] hover:underline">
                      {selectedClient.website}
                    </a>
                  </div>
                )}

                {selectedClient.notes && (
                  <div className="mt-4 pt-4 border-t border-[#BBE1FA]">
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Notes</p>
                    <p className="text-sm text-[#6B7280]">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-[#BBE1FA] flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleEdit(selectedClient);
                    }}
                    className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium bg-[#F8FAFC] text-[#6B7280] hover:text-[#1B262C] rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Professional Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B262C]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200 border border-red-500/20">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                <FaExclamationTriangle className="text-3xl text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#1B262C] text-center mb-2">
              Delete Client?
            </h3>
            <p className="text-[#6B7280] text-center text-sm mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-[#1B262C] text-center font-semibold text-base mb-6">
              "{deleteModal.clientName}"
            </p>
            <p className="text-[#6B7280] text-center text-xs mb-6">
              This action cannot be undone. All client data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, client: null, clientName: '' })}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaTrash className="text-sm" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;