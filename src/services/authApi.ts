import apiClient from './apiClient';

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    apiClient.post('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => apiClient.post('/auth/verify-otp', data),
  resendOtp: (data: { email: string }) => apiClient.post('/auth/resend-otp', data),
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (data: { email: string }) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', data),
  getMe: () => apiClient.get('/auth/me'),
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data: any) => apiClient.put('/profile', data),
  uploadAvatar: (formData: FormData) =>
    apiClient.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadResume: (formData: FormData) =>
    apiClient.post('/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
