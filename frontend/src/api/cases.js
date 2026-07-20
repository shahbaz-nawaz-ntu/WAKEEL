import { api } from './client.js';

export const caseAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/cases?${queryParams.toString()}`);
  },
  getById: (id) => api.get(`/cases/${id}`),
  create: (data) => api.post('/cases', data),
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
  updateStatus: (id, status) => api.patch(`/cases/${id}/status`, { status }),
  uploadDocument: (id, formData) => api.upload(`/cases/${id}/documents`, formData),
  deleteDocument: (caseId, documentId) => api.delete(`/cases/${caseId}/documents/${documentId}`),
  getDocuments: (id) => api.get(`/cases/${id}/documents`),
  addComment: (id, comment) => api.post(`/cases/${id}/comments`, { comment }),
  getComments: (id) => api.get(`/cases/${id}/comments`),
};