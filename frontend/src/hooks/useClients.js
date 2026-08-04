// src/hooks/useClients.js
import { useState, useCallback, useEffect } from 'react';
import { clientAPI } from '../api/clients';

// ✅ FIX: Use relative URL for development with proxy
// The proxy will forward /api to http://localhost:5000/api
let API_URL = import.meta.env.VITE_API_URL || '/api';
if (API_URL && API_URL !== '/api' && !API_URL.endsWith('/api')) {
  API_URL = `${API_URL.replace(/\/+$/, '')}/api`;
}

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to clean ID
  const sanitizeId = (id) => {
    console.log('🔍 sanitizeId received:', id, 'type:', typeof id);
    
    if (id === null || id === undefined || id === '') {
      console.log('❌ ID is null/undefined/empty');
      return null;
    }
    
    if (typeof id === 'object') {
      console.log('📝 ID is an object, extracting _id or id');
      const objId = id._id || id.id || null;
      console.log('📝 Extracted ID from object:', objId);
      if (objId) {
        return sanitizeId(objId);
      }
      console.log('❌ Object has no _id or id property');
      return null;
    }
    
    let clean = String(id);
    clean = clean.replace(/["']/g, '');
    clean = clean.trim();
    
    if (!clean || clean === '' || clean === 'null' || clean === 'undefined') {
      console.log('❌ ID is invalid after cleaning');
      return null;
    }
    
    console.log('✅ Valid clean ID:', clean);
    return clean;
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('👥 Fetching clients...');
      const response = await clientAPI.getAll();
      console.log('👥 Response:', response);

      if (response.success && response.data) {
        console.log('✅ Clients loaded:', response.data.length, 'clients');
        const formattedClients = response.data.map(client => ({
          ...client,
          id: client.id || client._id
        }));
        setClients(formattedClients);
        return { success: true, data: formattedClients };
      }
      
      throw new Error(response.error || 'Failed to fetch clients');
    } catch (err) {
      console.error('❌ Error fetching clients:', err);
      setError(err.message);
      const dummyClients = getDummyClients();
      setClients(dummyClients);
      return { success: false, error: err.message, data: dummyClients };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('🔄 useClients mounted - fetching clients...');
    fetchClients();
  }, [fetchClients]);

  const addClient = useCallback(async (clientData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('👤 Adding new client:', clientData);
      const response = await clientAPI.create(clientData);
      console.log('👤 Add client response:', response);

      if (response.success && response.data) {
        const newClient = {
          ...response.data,
          id: response.data.id || response.data._id
        };
        setClients(prev => [newClient, ...prev]);
        console.log('✅ Client added:', newClient);
        return { success: true, data: newClient };
      }
      return { success: false, error: response.error || 'Failed to add client' };
    } catch (err) {
      console.error('❌ Add client error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ SIMPLIFIED FIXED: updateClient
  const updateClient = useCallback(async (id, updatedData) => {
    console.log('📝 updateClient called with ID:', id);
    console.log('📝 ID type:', typeof id);
    console.log('📝 Updated data:', updatedData);
    
    // If ID is undefined/null, try to get it from updatedData
    let finalId = id;
    let finalData = updatedData;
    
    // If id is undefined/null and updatedData is an object with ID
    if (!finalId && updatedData && typeof updatedData === 'object') {
      finalId = updatedData._id || updatedData.id || updatedData.clientId || null;
      finalData = updatedData;
      console.log('📝 Found ID in updatedData object:', finalId);
    }
    
    // If finalId is an object with ID
    if (finalId && typeof finalId === 'object') {
      finalId = finalId._id || finalId.id || null;
      console.log('📝 Extracted ID from object:', finalId);
    }
    
    const sanitizedId = sanitizeId(finalId);
    
    if (!sanitizedId) {
      console.error('❌ Invalid client ID after sanitization');
      return { success: false, error: 'Invalid client ID' };
    }

    console.log(`📝 Updating client with ID: "${sanitizedId}"`);
    
    setLoading(true);
    setError(null);
    
    try {
      // Remove ID fields from data
      const { _id, id: clientIdField, client_id, ...cleanData } = finalData || {};
      
      const payload = {
        name: cleanData.name || '',
        email: cleanData.email || '',
        phone: cleanData.phone || '',
        company: cleanData.company || '',
        type: cleanData.type || 'Individual',
        status: cleanData.status || 'active',
        address: cleanData.address || '',
        city: cleanData.city || '',
        state: cleanData.state || '',
        zipCode: cleanData.zipCode || '',
        country: cleanData.country || '',
        notes: cleanData.notes || '',
        gst: cleanData.gst || '',
        pan: cleanData.pan || '',
        website: cleanData.website || '',
        industry: cleanData.industry || '',
      };
      
      console.log('📝 Request payload:', payload);
      
      // Call the API with the sanitized ID
      const response = await clientAPI.update(sanitizedId, payload);
      console.log('📝 Update response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update client');
      }

      // Get the updated client data
      const updatedClient = response.data ? {
        ...response.data,
        id: response.data.id || response.data._id || sanitizedId,
        _id: response.data._id || response.data.id || sanitizedId
      } : {
        ...payload,
        id: sanitizedId,
        _id: sanitizedId
      };
      
      console.log('📝 Updated client data:', updatedClient);
      
      // ✅ Update the clients state - find and replace the updated client
      setClients(prevClients => {
        const updated = prevClients.map(client => {
          const clientIdField = client.id || client._id;
          if (clientIdField === sanitizedId) {
            console.log('✅ Found and updating client:', client.name);
            return { ...client, ...updatedClient };
          }
          return client;
        });
        console.log('📝 Updated clients state length:', updated.length);
        return updated;
      });
      
      console.log('✅ Client updated successfully:', updatedClient);
      return { success: true, data: updatedClient };
    } catch (err) {
      console.error('❌ Update client error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClient = useCallback(async (id) => {
    console.log('🗑️ deleteClient called with ID:', id);
    
    const sanitizedId = sanitizeId(id);
    
    if (!sanitizedId) {
      console.error('❌ Invalid client ID for deletion');
      return { success: false, error: 'Invalid client ID' };
    }

    console.log(`🗑️ Deleting client: "${sanitizedId}"`);
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await clientAPI.delete(sanitizedId);
      console.log('🗑️ Delete response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete client');
      }
      
      setClients(prev => prev.filter(client => {
        const clientId = client.id || client._id;
        return clientId !== sanitizedId;
      }));
      
      console.log('✅ Client deleted:', sanitizedId);
      return { success: true };
    } catch (err) {
      console.error('❌ Delete client error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDummyClients = () => {
    return [
      {
        id: 'dummy1',
        _id: 'dummy1',
        clientId: 'CLI-0001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Smith & Associates',
        type: 'Individual',
        status: 'active',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        notes: 'VIP client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'dummy2',
        _id: 'dummy2',
        clientId: 'CLI-0002',
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        phone: '+1 (555) 987-6543',
        company: 'Johnson Law Firm',
        type: 'Company',
        status: 'active',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        notes: 'Corporate client',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
  };
};