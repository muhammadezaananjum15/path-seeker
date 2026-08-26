import apiClient from './apiClient';

export const careerApi = {
  getCareers: (params?: { domain?: string; demand?: string; search?: string; sortBy?: string; page?: number; limit?: number }) =>
    apiClient.get('/careers', { params }),
  getTrendingCareers: () => apiClient.get('/careers/trending'),
  getAiCareerAdvisor: (data: { query?: string; userRole?: string }) => apiClient.post('/careers/ai-advisor', data),
  getCareerById: (id: string) => apiClient.get(`/careers/${id}`),
  createCareer: (data: any) => apiClient.post('/careers', data),
  updateCareer: (id: string, data: any) => apiClient.put(`/careers/${id}`, data),
  deleteCareer: (id: string) => apiClient.delete(`/careers/${id}`),
};
