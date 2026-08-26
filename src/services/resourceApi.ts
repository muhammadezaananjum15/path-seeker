import apiClient from './apiClient';

export const resourceApi = {
  getResources: (params?: { category?: string; type?: string; search?: string }) =>
    apiClient.get('/resources', { params }),
  downloadResource: (id: string) => apiClient.post(`/resources/${id}/download`),
  incrementDownload: (id: string) => apiClient.post(`/resources/${id}/download`),
  createResource: (data: any) => apiClient.post('/resources', data),
  updateResource: (id: string, data: any) => apiClient.put(`/resources/${id}`, data),
  deleteResource: (id: string) => apiClient.delete(`/resources/${id}`),
};
