import apiClient from './apiClient';

export const bookmarkApi = {
  getBookmarks: (itemType?: string) => apiClient.get('/bookmarks', { params: { itemType } }),
  addBookmark: (data: { itemType: string; itemId: string; title: string; category?: string; note?: string }) =>
    apiClient.post('/bookmarks', data),
  removeBookmark: (id: string) => apiClient.delete(`/bookmarks/${id}`),
  updateNote: (id: string, note: string) => apiClient.patch(`/bookmarks/${id}/note`, { note }),
  exportBookmarksPDF: () => apiClient.get('/bookmarks/export/pdf', { responseType: 'blob' }),
};
