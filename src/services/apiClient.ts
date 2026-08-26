import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pathseeker_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('pathseeker_refresh_token');
        if (refreshToken) {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          if (res.data.success && res.data.accessToken) {
            localStorage.setItem('pathseeker_access_token', res.data.accessToken);
            if (res.data.refreshToken) {
              localStorage.setItem('pathseeker_refresh_token', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshErr) {
        localStorage.removeItem('pathseeker_access_token');
        localStorage.removeItem('pathseeker_refresh_token');
        localStorage.removeItem('pathseeker_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
