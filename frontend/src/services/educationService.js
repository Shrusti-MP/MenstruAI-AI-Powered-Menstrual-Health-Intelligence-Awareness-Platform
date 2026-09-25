import api from './api';

export const educationService = {
  async getArticles(category = '', search = '') {
    const params = {};
    if (category && category !== 'ALL') params.category = category;
    if (search && search.trim()) params.search = search.trim();
    const response = await api.get('/education', { params });
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/education/categories/list');
    return response.data;
  },

  async getArticleById(id) {
    const response = await api.get(`/education/${id}`);
    return response.data;
  },

  async getRelatedArticles(id) {
    const response = await api.get(`/education/${id}/related`);
    return response.data;
  },
};
