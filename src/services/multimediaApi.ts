import apiClient from './apiClient';

export const multimediaApi = {
  getMedia: (params?: { category?: string; type?: string; search?: string }) => apiClient.get('/multimedia', { params }),
  searchYouTube: (query?: string) => apiClient.get('/youtube/search', { params: { q: query, query } }),
  getMediaById: (id: string) => apiClient.get(`/multimedia/${id}`),
  rateMedia: (id: string, rating: number) => apiClient.post(`/multimedia/${id}/rate`, { rating }),
  createMedia: (data: any) => apiClient.post('/multimedia', data),
  updateMedia: (id: string, data: any) => apiClient.put(`/multimedia/${id}`, data),
  deleteMedia: (id: string) => apiClient.delete(`/multimedia/${id}`),
};
