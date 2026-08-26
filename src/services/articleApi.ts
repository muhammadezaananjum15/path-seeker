import apiClient from './apiClient';

export const articleApi = {
  getArticles: (params?: { category?: string; search?: string; role?: string }) =>
    apiClient.get('/articles', { params }),
  generateAiArticle: (data: { topic: string; userRole?: string; targetCareer?: string }) =>
    apiClient.post('/articles/ai-generate', data),
};
