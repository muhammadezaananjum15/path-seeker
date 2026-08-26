import apiClient from './apiClient';

export const feedbackApi = {
  submitFeedback: (data: { name?: string; email?: string; category?: string; message: string }) =>
    apiClient.post('/feedback', data),
  adminGetFeedback: () => apiClient.get('/feedback/admin'),
  adminUpdateFeedbackStatus: (id: string, status: 'open' | 'reviewed' | 'resolved') =>
    apiClient.patch(`/feedback/admin/${id}/status`, { status }),
};
