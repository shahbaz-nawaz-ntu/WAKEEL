// src/store/clientStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clientAPI } from '../api/clients';
import toast from 'react-hot-toast';

export const useClientStore = create(
  persist(
    (set, get) => ({
      clients: [],
      selectedClient: null,
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        type: 'all',
        search: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      fetchClients: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const filters = get().filters;
          const pagination = get().pagination;

          const queryParams = {
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
            ...params,
          };

          Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === 'all' || queryParams[key] === '' || queryParams[key] === undefined || queryParams[key] === null) {
              delete queryParams[key];
            }
          });

          const data = await clientAPI.getAll(queryParams);
          console.log('📦 clientAPI.getAll response:', data);
          
          let clientsData = [];
          let total = 0;
          
          if (Array.isArray(data)) {
            clientsData = data;
            total = data.length;
          } else if (data && typeof data === 'object') {
            if (data.clients) {
              clientsData = Array.isArray(data.clients) ? data.clients : [data.clients];
              total = data.total || data.count || clientsData.length;
            } else if (data.data) {
              clientsData = Array.isArray(data.data) ? data.data : [data.data];
              total = data.count || data.total || clientsData.length;
            } else if (data._id || data.id) {
              clientsData = [data];
              total = 1;
            }
          }
          
          clientsData = clientsData.map(c => ({
            ...c,
            id: c._id || c.id
          }));
          
          set({
            clients: clientsData,
            pagination: {
              ...pagination,
              total: total,
              totalPages: Math.ceil(total / pagination.limit) || 1,
            },
            isLoading: false,
            error: null,
          });
          return { success: true, data: clientsData };
        } catch (error) {
          console.error('❌ Fetch clients error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch clients',
          });
          toast.error(error.response?.data?.message || 'Failed to fetch clients');
          return { success: false, error: error.message };
        }
      },

      fetchClientById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const data = await clientAPI.getById(id);
          const clientData = {
            ...data,
            id: data._id || data.id
          };
          set({
            selectedClient: clientData,
            isLoading: false,
            error: null,
          });
          return clientData;
        } catch (error) {
          console.error('❌ Fetch client error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch client',
          });
          return null;
        }
      },

      createClient: async (clientData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('📤 Creating client:', clientData);
          
          if (!clientData.name || !clientData.name.trim()) {
            throw new Error('Client name is required');
          }
          if (!clientData.email || !clientData.email.trim()) {
            throw new Error('Client email is required');
          }
          if (!clientData.phone || !clientData.phone.trim()) {
            throw new Error('Client phone is required');
          }
          
          const data = await clientAPI.create(clientData);
          console.log('📦 Created client response:', data);
          
          let newClient = data;
          if (data && data.data) {
            newClient = data.data;
          } else if (data && data.client) {
            newClient = data.client;
          }
          
          if (newClient) {
            newClient = {
              ...newClient,
              id: newClient._id || newClient.id
            };
          }
          
          set((state) => ({
            clients: [newClient, ...state.clients],
            isLoading: false,
            error: null,
          }));
          toast.success('Client created successfully');
          return { success: true, data: newClient };
        } catch (error) {
          console.error('❌ Create client error:', error);
          const errorMsg = error.response?.data?.message || error.message || 'Failed to create client';
          set({
            isLoading: false,
            error: errorMsg,
          });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      updateClient: async (id, clientData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('📤 Updating client:', id, clientData);
          const data = await clientAPI.update(id, clientData);
          console.log('📦 Updated client response:', data);
          
          const updatedClient = {
            ...data,
            id: data._id || data.id
          };
          
          set((state) => ({
            clients: state.clients.map((c) => 
              (c._id === id || c.id === id) ? updatedClient : c
            ),
            selectedClient: state.selectedClient?._id === id || state.selectedClient?.id === id 
              ? updatedClient 
              : state.selectedClient,
            isLoading: false,
            error: null,
          }));
          toast.success('Client updated successfully');
          return { success: true, data: updatedClient };
        } catch (error) {
          console.error('❌ Update client error:', error);
          const errorMsg = error.response?.data?.message || 'Failed to update client';
          set({
            isLoading: false,
            error: errorMsg,
          });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      deleteClient: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await clientAPI.delete(id);
          set((state) => ({
            clients: state.clients.filter((c) => c._id !== id && c.id !== id),
            selectedClient: state.selectedClient?._id === id || state.selectedClient?.id === id 
              ? null 
              : state.selectedClient,
            isLoading: false,
            error: null,
          }));
          toast.success('Client deleted successfully');
          return { success: true };
        } catch (error) {
          console.error('❌ Delete client error:', error);
          const errorMsg = error.response?.data?.message || 'Failed to delete client';
          set({
            isLoading: false,
            error: errorMsg,
          });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
        get().fetchClients();
      },

      resetFilters: () => {
        set({
          filters: {
            status: 'all',
            type: 'all',
            search: '',
          },
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
        get().fetchClients();
      },

      setPage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchClients();
      },

      clearSelectedClient: () => set({ selectedClient: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'client-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        clients: state.clients,
      }),
    }
  )
);