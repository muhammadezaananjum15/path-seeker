import apiClient from './apiClient';

export interface PageActivityRecord {
  page: string;
  enteredAt: string;
  exitedAt?: string;
  durationMs?: number;
}

export interface LinkClickRecord {
  _id: string;
  url: string;
  sourcePage?: string;
  clickedAt: string;
}

export interface QuizAttemptRecord {
  _id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
  createdAt: string;
}

export interface UserSelfStats {
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  quizTaken: boolean;
  quizzes: QuizAttemptRecord[];
  totalPageTimeMs: number;
  totalPagesVisited: number;
  externalClicksCount: number;
  linkClicks: LinkClickRecord[];
  pageBreakdown: {
    page: string;
    totalDurationMs: number;
    visits: number;
    lastVisited: string;
  }[];
}

export const analyticsApi = {
  pageEnter: (page: string) =>
    apiClient.post('/analytics/page-enter', { page }),

  pageExit: (activityId: string) =>
    apiClient.post('/analytics/page-exit', { activityId }),

  linkClick: (url: string, sourcePage?: string) =>
    apiClient.post('/analytics/link-click', { url, sourcePage: sourcePage || window.location.pathname }),

  quizEvent: (data: {
    quizId?: string;
    quizTitle?: string;
    score?: number;
    totalQuestions?: number;
    status?: 'not_started' | 'in_progress' | 'completed';
  }) => apiClient.post('/analytics/quiz-event', data),

  getMyStats: () => apiClient.get<{ success: boolean; stats: UserSelfStats }>('/analytics/my-stats'),
};
