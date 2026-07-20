import { api } from './client.js';

export const eventAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return api.get(`/events?${queryParams.toString()}`);
  },
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getByDate: (date) => api.get(`/events/date/${date}`),
  getByRange: (start, end) => api.get(`/events/range/${start}/${end}`),
};