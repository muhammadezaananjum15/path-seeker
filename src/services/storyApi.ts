import apiClient from './apiClient';

export const storyApi = {
  getApprovedStories: (params?: { domain?: string }) => apiClient.get('/stories', { params }),
  getStoryById: (id: string) => apiClient.get(`/stories/${id}`),
  submitStory: (data: any) => apiClient.post('/stories/submit', data),
  adminGetStories: (params?: { status?: string }) => apiClient.get('/stories/admin/all', { params }),
  adminUpdateStoryStatus: (id: string, status: 'approved' | 'rejected' | 'pending') =>
    apiClient.patch(`/stories/admin/${id}/status`, { status }),
};
