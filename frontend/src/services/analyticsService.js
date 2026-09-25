import api from './api';

export const analyticsService = {
  async getSummary() {
    const response = await api.get('/analytics/summary');
    return response.data;
  },

  async getSymptoms() {
    const response = await api.get('/analytics/symptoms');
    return response.data;
  },

  async getFlow() {
    const response = await api.get('/analytics/flow');
    return response.data;
  },

  async getMood() {
    const response = await api.get('/analytics/mood');
    return response.data;
  },

  async getSleep() {
    const response = await api.get('/analytics/sleep');
    return response.data;
  },
};
