import api from './api';

export const quizService = {
  async getQuizQuestions() {
    const response = await api.get('/quiz');
    return response.data;
  },

  async submitQuiz(answers) {
    const response = await api.post('/quiz/submit', { answers });
    return response.data;
  },

  async getQuizHistory() {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};
