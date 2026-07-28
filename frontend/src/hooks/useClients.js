// src/hooks/useClients.js
import { useState, useCallback, useEffect } from 'react';

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

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('👥 Fetching clients from:', `${API_URL}/clients`);
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      console.log('👥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('👥 Response data:', data);

      if (data.success && data.data) {
        console.log('✅ Clients loaded:', data.data.length, 'clients');
        const formattedClients = data.data.map(client => ({
          ...client,
          id: client.id || client._id
        }));
        setClients(formattedClients);
        return { success: true, data: formattedClients };
      }
      
      throw new Error(data.error || 'Failed to fetch clients');
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
      
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(clientData),
      });

      const result = await response.json();
      console.log('👤 Add client response:', result);

      if (result.success && result.data) {
        const newClient = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setClients(prev => [newClient, ...prev]);
        console.log('✅ Client added:', newClient);
        return { success: true, data: newClient };
      }
      return { success: false, error: result.error || 'Failed to add client' };
    } catch (err) {
      console.error('❌ Add client error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClient = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating client: ${id}`);
      
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log('📝 Update client response:', result);

      if (result.success && result.data) {
        const updatedClient = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setClients(prev => prev.map(client => 
          (client.id === id || client._id === id) ? updatedClient : client
        ));
        console.log('✅ Client updated:', updatedClient);
        return { success: true, data: updatedClient };
      }
      return { success: false, error: result.error || 'Failed to update client' };
    } catch (err) {
      console.error('❌ Update client error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting client: ${id}`);
      
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete client response:', result);

      if (result.success) {
        setClients(prev => prev.filter(client => (client.id !== id && client._id !== id)));
        console.log('✅ Client deleted:', id);
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to delete client' };
    } catch (err) {
      console.error('❌ Delete client error:', err);
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