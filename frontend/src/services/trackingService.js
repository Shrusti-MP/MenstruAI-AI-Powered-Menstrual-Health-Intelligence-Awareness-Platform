import api from './api';

export const trackingService = {
  async getSymptoms() {
    const response = await api.get('/tracking/symptoms');
    return response.data;
  },

  async createRecord(recordData) {
    const response = await api.post('/tracking', recordData);
    return response.data;
  },

  async getRecords() {
    const response = await api.get('/tracking');
    return response.data;
  },

  async getRecordById(id) {
    const response = await api.get(`/tracking/${id}`);
    return response.data;
  },

  async updateRecord(id, updateData) {
    const response = await api.put(`/tracking/${id}`, updateData);
    return response.data;
  },

  async deleteRecord(id) {
    const response = await api.delete(`/tracking/${id}`);
    return response.data;
  },
};
