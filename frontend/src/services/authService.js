import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('menstruai_token');
      localStorage.removeItem('menstruai_user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  async deleteAccount(confirmation = 'DELETE') {
    const response = await api.delete('/users/me', {
      data: { confirmation },
    });
    return response.data;
  },
};
