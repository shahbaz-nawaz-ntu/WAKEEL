import { create } from 'zustand';
import { caseAPI } from '../api/cases';
import toast from 'react-hot-toast';

export const useCaseStore = create((set, get) => ({
  cases: [],
  selectedCase: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    caseType: 'all',
    assignedTo: '',
    fromDate: '',
    toDate: '',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  sort: {
    field: 'createdAt',
    order: 'desc',
  },

  // Fetch all cases
  fetchCases: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const pagination = get().pagination;
      const sort = get().sort;

      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortField: sort.field,
        sortOrder: sort.order,
        ...params,
      };

      const data = await caseAPI.getAll(queryParams);
      set({
        cases: data.cases || data,
        pagination: {
          ...pagination,
          total: data.total || data.length,
          totalPages: data.totalPages || Math.ceil((data.total || data.length) / pagination.limit),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch cases',
      });
    }
  },

  // Fetch single case
  fetchCaseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await caseAPI.getById(id);
      set({
        selectedCase: data,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch case',
      });
      return null;
    }
  },

  // Create case
  createCase: async (caseData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await caseAPI.create(caseData);
      set((state) => ({
        cases: [data, ...state.cases],
        isLoading: false,
        error: null,
      }));
      toast.success('Case created successfully');
      return { success: true, data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create case',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Update case
  updateCase: async (id, caseData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await caseAPI.update(id, caseData);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? data : c)),
        selectedCase: state.selectedCase?.id === id ? data : state.selectedCase,
        isLoading: false,
        error: null,
      }));
      toast.success('Case updated successfully');
      return { success: true, data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update case',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Delete case
  deleteCase: async (id) => {
    if (!window.confirm('Are you sure you want to delete this case?')) {
      return { success: false };
    }
    set({ isLoading: true, error: null });
    try {
      await caseAPI.delete(id);
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== id),
        selectedCase: state.selectedCase?.id === id ? null : state.selectedCase,
        isLoading: false,
        error: null,
      }));
      toast.success('Case deleted successfully');
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete case',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Update case status
  updateCaseStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const data = await caseAPI.updateStatus(id, status);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? data : c)),
        selectedCase: state.selectedCase?.id === id ? data : state.selectedCase,
        isLoading: false,
        error: null,
      }));
      toast.success(`Case status updated to ${status}`);
      return { success: true, data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update status',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Upload document
  uploadDocument: async (caseId, formData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await caseAPI.uploadDocument(caseId, formData);
      set((state) => ({
        cases: state.cases.map((c) => 
          c.id === caseId ? { ...c, documents: c.documents + 1 } : c
        ),
        selectedCase: state.selectedCase?.id === caseId 
          ? { ...state.selectedCase, documents: state.selectedCase.documents + 1 }
          : state.selectedCase,
        isLoading: false,
        error: null,
      }));
      toast.success('Document uploaded successfully');
      return { success: true, data };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to upload document',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Set filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchCases();
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        status: 'all',
        priority: 'all',
        caseType: 'all',
        assignedTo: '',
        fromDate: '',
        toDate: '',
        search: '',
      },
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    get().fetchCases();
  },

  // Set page
  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchCases();
  },

  // Set sort
  setSort: (field, order) => {
    set({ sort: { field, order } });
    get().fetchCases();
  },

  // Clear selected case
  clearSelectedCase: () => set({ selectedCase: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));