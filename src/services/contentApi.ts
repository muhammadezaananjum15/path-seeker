import apiClient from './apiClient';

export interface ContentItem {
  _id: string;
  title: string;
  body: string;
  images: string[];
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  author?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  readTimeMinutes: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tag?: string;
  sort?: string;
}

export const contentApi = {
  // Public published articles
  getPublishedArticles: (params?: ContentQueryParams) =>
    apiClient.get('/content', { params }),

  getArticleById: (id: string) =>
    apiClient.get(`/content/${id}`),

  // Admin content management CRUD
  getAdminContent: (params?: ContentQueryParams) =>
    apiClient.get('/admin/content', { params }),

  getContentById: (id: string) =>
    apiClient.get(`/admin/content/${id}`),

  createContent: (payload: Partial<ContentItem>) =>
    apiClient.post('/admin/content', payload),

  updateContent: (id: string, payload: Partial<ContentItem>) =>
    apiClient.put(`/admin/content/${id}`, payload),

  deleteContent: (id: string) =>
    apiClient.delete(`/admin/content/${id}`),
};
