import { api } from './client.js';

export const clientAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return api.get(`/clients?${queryParams.toString()}`);
  },
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getCases: (id) => api.get(`/clients/${id}/cases`),
};