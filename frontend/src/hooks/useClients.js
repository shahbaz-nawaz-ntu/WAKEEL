// src/hooks/useClients.js
import { useState, useCallback, useEffect } from 'react';
import { clientAPI } from '../api/clients';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Helper to clean ID - removes quotes and trims
  const sanitizeId = (id) => {
    console.log('🔍 sanitizeId received:', id, 'type:', typeof id);
    
    if (id === null || id === undefined || id === '') {
      console.log('❌ ID is null/undefined/empty');
      return null;
    }
    
    // Convert to string if it's not already
    let clean = String(id);
    console.log('📝 After String conversion:', clean);
    
    // Remove ALL quotes (both single and double)
    clean = clean.replace(/["']/g, '');
    console.log('📝 After removing quotes:', clean);
    
    // Trim whitespace
    clean = clean.trim();
    console.log('📝 After trim:', clean);
    
    // Check if we have a valid ID after cleaning
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
      
      // Use dummy data as fallback
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

  // ✅ FIXED: updateClient with proper ID handling
  const updateClient = useCallback(async (id, updatedData) => {
    console.log('📝 updateClient called with ID:', id);
    console.log('📝 ID type:', typeof id);
    console.log('📝 Updated data:', updatedData);
    
    setLoading(true);
    setError(null);
    try {
      // ✅ Sanitize the ID
      const sanitizedId = sanitizeId(id);
      
      if (!sanitizedId) {
        console.error('❌ Invalid client ID after sanitization');
        setError('Invalid client ID');
        return { success: false, error: 'Invalid client ID' };
      }

      console.log(`📝 Updating client with ID: "${sanitizedId}"`);
      
      // ✅ Format the data
      const payload = {
        name: updatedData.name || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        company: updatedData.company || '',
        type: updatedData.type || 'Individual',
        status: updatedData.status || 'active',
        address: updatedData.address || '',
        city: updatedData.city || '',
        state: updatedData.state || '',
        zipCode: updatedData.zipCode || '',
        country: updatedData.country || '',
        notes: updatedData.notes || '',
      };
      
      console.log('📝 Request payload:', payload);
      
      // ✅ Call the API with the sanitized ID
      const response = await clientAPI.update(sanitizedId, payload);
      console.log('📝 Update response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update client');
      }

      const updatedClient = response.data ? {
        ...response.data,
        id: response.data.id || response.data._id || sanitizedId
      } : {
        ...payload,
        id: sanitizedId
      };
      
      // ✅ Update the clients state
      setClients(prev => {
        const updated = prev.map(client => {
          const clientId = client.id || client._id;
          return clientId === sanitizedId ? updatedClient : client;
        });
        console.log('📝 Updated clients state:', updated);
        return updated;
      });
      
      console.log('✅ Client updated:', updatedClient);
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
    
    setLoading(true);
    setError(null);
    try {
      // ✅ Sanitize the ID
      const sanitizedId = sanitizeId(id);
      
      if (!sanitizedId) {
        console.error('❌ Invalid client ID for deletion');
        setError('Invalid client ID');
        return { success: false, error: 'Invalid client ID' };
      }

      console.log(`🗑️ Deleting client: "${sanitizedId}"`);
      
      const response = await clientAPI.delete(sanitizedId);
      console.log('🗑️ Delete response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete client');
      }
      
      // ✅ Remove from clients state
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