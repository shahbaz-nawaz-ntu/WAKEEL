// src/api/clients.js
import { api } from './client.js';

export const clientAPI = {
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await api.get(`/clients?${queryParams.toString()}`);
      console.log('📥 getAll response:', response);
      
      // Handle different response formats
      let data = [];
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          data = response;
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response.clients && Array.isArray(response.clients)) {
          data = response.clients;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          data = response.data;
        }
      }
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch clients',
        data: [],
      };
    }
  },
  
  getById: async (id) => {
    try {
      // Clean the ID
      const cleanId = String(id).replace(/["']/g, '').trim();
      console.log('📥 getById with ID:', cleanId);
      
      const response = await api.get(`/clients/${cleanId}`);
      console.log('📥 getById response:', response);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('❌ Error fetching client:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch client',
      };
    }
  },
  
  create: async (data) => {
    try {
      console.log('📝 Creating client with data:', data);
      const response = await api.post('/clients', data);
      console.log('📝 Create response:', response);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('❌ Error creating client:', error);
      return {
        success: false,
        error: error.message || 'Failed to create client',
      };
    }
  },
  
  update: async (id, data) => {
    try {
      // ✅ Ensure ID is a string without quotes
      const cleanId = String(id).replace(/["']/g, '').trim();
      console.log('📝 Updating client with ID:', cleanId);
      console.log('📝 Update data:', data);
      
      if (!cleanId) {
        throw new Error('Invalid client ID for update');
      }
      
      const response = await api.put(`/clients/${cleanId}`, data);
      console.log('📝 Update response:', response);
      
      // ✅ Return consistent format
      return {
        success: true,
        data: response || data,
      };
    } catch (error) {
      console.error('❌ Error updating client:', error);
      return {
        success: false,
        error: error.message || 'Failed to update client',
      };
    }
  },
  
  delete: async (id) => {
    try {
      // ✅ Ensure ID is a string without quotes
      const cleanId = String(id).replace(/["']/g, '').trim();
      console.log('🗑️ Deleting client with ID:', cleanId);
      
      if (!cleanId) {
        throw new Error('Invalid client ID for deletion');
      }
      
      const response = await api.delete(`/clients/${cleanId}`);
      console.log('🗑️ Delete response:', response);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('❌ Error deleting client:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete client',
      };
    }
  },
  
  getCases: async (id) => {
    try {
      const cleanId = String(id).replace(/["']/g, '').trim();
      const response = await api.get(`/clients/${cleanId}/cases`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('❌ Error fetching client cases:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch client cases',
      };
    }
  },
};