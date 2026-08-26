import apiClient from './apiClient';

export const logUserActivity = async (
  action: string,
  category: 'SEARCH' | 'VIDEO_PLAY' | 'QUIZ_ATTEMPT' | 'RESOURCE_DOWNLOAD' | 'AI_CHAT' | 'PAGE_VIEW' | 'GENERAL' = 'GENERAL',
  details?: string,
  metadata?: Record<string, any>
) => {
  try {
    await apiClient.post('/activity/log', {
      action,
      category,
      details,
      metadata,
    });
  } catch (e) {
    // Fail silently in background
  }
};
