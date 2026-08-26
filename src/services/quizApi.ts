import apiClient from './apiClient';

export const quizApi = {
  getQuestions: (params?: { category?: string; role?: string }) => apiClient.get('/quiz/questions', { params }),
  submitQuiz: (answers: { questionId: string; selectedValues: string | string[] }[]) =>
    apiClient.post('/quiz/submit', { answers }),
  getQuizHistory: () => apiClient.get('/quiz/history'),
  createQuestion: (data: any) => apiClient.post('/quiz/questions', data),
  updateQuestion: (id: string, data: any) => apiClient.put(`/quiz/questions/${id}`, data),
  deleteQuestion: (id: string) => apiClient.delete(`/quiz/questions/${id}`),
};
