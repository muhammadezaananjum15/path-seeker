import apiClient from './apiClient';

export const chatbotApi = {
  sendMessage: (message: string) => apiClient.post('/chatbot/message', { message }),
  getChatHistory: () => apiClient.get('/chatbot/history'),
  clearChatHistory: () => apiClient.delete('/chatbot/history'),
};
