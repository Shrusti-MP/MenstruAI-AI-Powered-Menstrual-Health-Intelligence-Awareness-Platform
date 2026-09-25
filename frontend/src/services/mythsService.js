import api from './api';

export const mythsService = {
  async getMythsFacts() {
    const response = await api.get('/myths-facts');
    return response.data;
  },
};
