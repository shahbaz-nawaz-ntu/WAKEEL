// src/components/clients/ClientsList.jsx
import React, { useState } from 'react';
import { FaPlusCircle, FaSearch, FaEdit, FaTrash, FaUser, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ClientsList = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
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

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingClient) {
        result = await onEditClient(editingClient.id || editingClient._id, formData);
      } else {
        result = await onAddClient(formData);
      }
      
      if (result.success) {
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
        toast.error(result.error || 'Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Failed to save client');
    }
  };

  const handleEdit = (client) => {
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
    if (window.confirm('Are you sure you want to delete this client?')) {
      const result = await onDeleteClient(id);
      if (result.success) {
        toast.success('Client deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete client');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1B262C]">Clients</h2>
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
          className="flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium"
        >
          <FaPlusCircle className="text-xs" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-3.5 w-3.5 text-[#9CA3AF]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-[#BBE1FA] rounded-xl text-sm text-[#1B262C] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8] transition-all duration-200"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <div key={client.id || client._id} className="premium-card hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B262C] to-[#0F4C75] flex items-center justify-center text-white font-semibold text-sm">
                  {client.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B262C] text-sm">{client.name}</h3>
                  <p className="text-xs text-[#6B7280]">{client.clientId || 'N/A'}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(client.status)}`}>
                {client.status || 'active'}
              </span>
            </div>

            <div className="space-y-1.5 text-sm">
              {client.email && (
                <p className="text-[#6B7280] flex items-center gap-2">
                  <FaEnvelope className="text-[#3282B8] text-xs" />
                  <span className="truncate">{client.email}</span>
                </p>
              )}
              {client.phone && (
                <p className="text-[#6B7280] flex items-center gap-2">
                  <FaPhone className="text-[#3282B8] text-xs" />
                  <span>{client.phone}</span>
                </p>
              )}
              {client.company && (
                <p className="text-[#6B7280] flex items-center gap-2">
                  <FaBuilding className="text-[#3282B8] text-xs" />
                  <span>{client.company}</span>
                </p>
              )}
              <p className="text-[#6B7280] flex items-center gap-2">
                <FaUser className="text-[#3282B8] text-xs" />
                <span>{client.type || 'Individual'}</span>
              </p>
            </div>

            {client.notes && (
              <p className="text-xs text-[#6B7280] mt-2 line-clamp-2 border-t border-[#BBE1FA] pt-2">
                {client.notes}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[#BBE1FA]">
              <button
                onClick={() => handleEdit(client)}
                className="p-1.5 text-[#0F4C75] hover:text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(client.id || client._id)}
                className="p-1.5 text-[#EF4444] hover:text-[#EF4444]/80 hover:bg-[#EF4444]/10 rounded-lg transition-all"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-[#1B262C] mb-1">No clients found</h3>
            <p className="text-[#6B7280] text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Add your first client to get started'}
            </p>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsAddModalOpen(false)}>
              <div className="absolute inset-0 bg-[#1B262C] opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#1B262C]">
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-[#6B7280] hover:text-[#1B262C]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
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
                        <option value="Individual">Individual</option>
                        <option value="Company">Company</option>
                        <option value="Law Firm">Law Firm</option>
                        <option value="Government">Government</option>
                        <option value="Other">Other</option>
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1B262C] mb-1">ZIP</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3282B8]/10 focus:border-[#3282B8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1B262C] mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
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
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#0F4C75] text-white text-sm font-medium rounded-xl hover:bg-[#1B262C] transition-all"
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