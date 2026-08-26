import apiClient from './apiClient';

export const adminApi = {
  getAnalyticsOverview: () => apiClient.get('/admin/analytics'),
  getUsers: (params?: { search?: string; role?: string; page?: number; limit?: number }) =>
    apiClient.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) => apiClient.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  toggleBanUser: (id: string) => apiClient.patch(`/admin/users/${id}/toggle-ban`),

  approveStory: (id: string) => apiClient.patch(`/admin/stories/${id}/approve`),
  rejectStory: (id: string) => apiClient.patch(`/admin/stories/${id}/reject`),

  getAllFeedback: () => apiClient.get('/admin/feedback'),
  updateFeedbackStatus: (id: string, status: string) => apiClient.patch(`/admin/feedback/${id}/status`, { status }),
};
