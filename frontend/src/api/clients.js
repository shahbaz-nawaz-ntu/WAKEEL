// frontend/src/api/clients.js
import { api } from './client';

export const clientAPI = {
  // Get all clients
  getAll: async () => {
    try {
      console.log('📡 GET /clients');
      const response = await api.get('/clients');
      console.log('📡 Response:', response);
      
      // Handle different response formats
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.clients || []
        };
      }
      
      if (Array.isArray(response)) {
        return {
          success: true,
          data: response
        };
      }
      
      if (response && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Invalid response format'
      };
    } catch (error) {
      console.error('❌ GET /clients error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      };
    }
  },

  // Get single client
  getById: async (id) => {
    try {
      console.log(`📡 GET /clients/${id}`);
      const response = await api.get(`/clients/${id}`);
      console.log('📡 Response:', response);
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.client
        };
      }
      
      if (response && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Client not found'
      };
    } catch (error) {
      console.error(`❌ GET /clients/${id} error:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch client'
      };
    }
  },

  // Create new client
  create: async (clientData) => {
    try {
      console.log('📡 POST /clients', clientData);
      const response = await api.post('/clients', clientData);
      console.log('📡 Response:', response);
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.client
        };
      }
      
      if (response && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Failed to create client'
      };
    } catch (error) {
      console.error('❌ POST /clients error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create client'
      };
    }
  },

  // ✅ FIXED: Update client - uses PATCH
  update: async (id, clientData) => {
    try {
      console.log(`📡 PATCH /clients/${id}`, clientData);
      
      if (!id) {
        console.error('❌ No ID provided for update');
        return {
          success: false,
          error: 'No client ID provided'
        };
      }
      
      let cleanId = String(id).replace(/["']/g, '').trim();
      console.log(`📡 Cleaned ID: ${cleanId}`);
      
      if (!cleanId || cleanId === 'null' || cleanId === 'undefined') {
        return {
          success: false,
          error: 'Invalid client ID format'
        };
      }
      
      // Remove ID fields from the data
      const { _id, id: clientIdField, client_id, ...cleanData } = clientData || {};
      
      // ✅ Use PATCH
      const response = await api.patch(`/clients/${cleanId}`, cleanData);
      console.log('📡 PATCH response:', response);
      
      // Handle different response formats
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.client
        };
      }
      
      if (response && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      if (response && response._id) {
        return {
          success: true,
          data: response
        };
      }
      
      if (response) {
        return {
          success: true,
          data: response
        };
      }
      
      return {
        success: false,
        error: 'Failed to update client'
      };
    } catch (error) {
      console.error(`❌ PATCH /clients/${id} error:`, error);
      
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'Client not found. It may have been deleted.',
          status: 404
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to update client'
      };
    }
  },

  // Delete client
  delete: async (id) => {
    try {
      console.log(`📡 DELETE /clients/${id}`);
      
      if (!id) {
        console.error('❌ No ID provided for deletion');
        return {
          success: false,
          error: 'No client ID provided'
        };
      }
      
      let cleanId = String(id).replace(/["']/g, '').trim();
      console.log(`📡 Cleaned ID: ${cleanId}`);
      
      if (!cleanId || cleanId === 'null' || cleanId === 'undefined') {
        return {
          success: false,
          error: 'Invalid client ID format'
        };
      }
      
      const response = await api.delete(`/clients/${cleanId}`);
      console.log('📡 DELETE response:', response);
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response
        };
      }
      
      if (response && response.message) {
        return {
          success: true,
          data: response
        };
      }
      
      if (response) {
        return {
          success: true,
          data: response
        };
      }
      
      return {
        success: false,
        error: 'Failed to delete client'
      };
    } catch (error) {
      console.error(`❌ DELETE /clients/${id} error:`, error);
      
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'Client not found. It may have already been deleted.',
          status: 404
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      };
    }
  },

  // Search clients
  search: async (query) => {
    try {
      console.log(`📡 GET /clients/search?q=${query}`);
      const response = await api.get(`/clients/search?q=${encodeURIComponent(query)}`);
      console.log('📡 Response:', response);
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.clients || []
        };
      }
      
      if (Array.isArray(response)) {
        return {
          success: true,
          data: response
        };
      }
      
      return {
        success: false,
        error: 'Failed to search clients'
      };
    } catch (error) {
      console.error(`❌ GET /clients/search error:`, error);
      return {
        success: false,
        error: error.message || 'Failed to search clients'
      };
    }
  },

  // Get client stats
  getStats: async () => {
    try {
      console.log('📡 GET /clients/stats');
      const response = await api.get('/clients/stats');
      console.log('📡 Response:', response);
      
      if (response && response.success) {
        return {
          success: true,
          data: response.data || response.stats
        };
      }
      
      return {
        success: false,
        error: 'Failed to get client stats'
      };
    } catch (error) {
      console.error('❌ GET /clients/stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get client stats'
      };
    }
  }
};

export default clientAPI;