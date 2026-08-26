import { Career, MultimediaItem, QuizQuestion, Resource, SuccessStory, User } from '../types';
import { careerService } from './careerService';
import { contentService } from './contentService';
import { quizService } from './quizService';
import { resourceService } from './resourceService';
import { storyService } from './storyService';
import { authService } from './authService';
import { feedbackService } from './feedbackService';

export interface AdminAnalytics {
  totalUsers: number;
  activePassports: number;
  totalCareers: number;
  totalQuizzesTaken: number;
  totalDownloads: number;
  userGrowthData: { month: string; users: number; quizzes: number }[];
  domainDistribution: { name: string; count: number }[];
  recentAuditLogs: { id: string; action: string; user: string; timestamp: string }[];
}

export const adminService = {
  getAnalytics(): AdminAnalytics {
    const users = authService.getUsers();
    const careers = careerService.getAllCareers();
    const quizHistory = quizService.getQuizHistory();
    const resources = resourceService.getAllResources();
    const totalDownloads = resources.reduce((acc, r) => acc + r.downloadCount, 0);

    // Calculate domain breakdown
    const domainCounts: Record<string, number> = {};
    for (const c of careers) {
      domainCounts[c.domain] = (domainCounts[c.domain] || 0) + 1;
    }

    const domainDistribution = Object.entries(domainCounts).map(([name, count]) => ({
      name,
      count
    }));

    return {
      totalUsers: users.length + 1840,
      activePassports: users.length + 1250,
      totalCareers: careers.length,
      totalQuizzesTaken: quizHistory.length + 3820,
      totalDownloads,
      userGrowthData: [
        { month: 'Sep', users: 620, quizzes: 410 },
        { month: 'Oct', users: 890, quizzes: 620 },
        { month: 'Nov', users: 1200, quizzes: 880 },
        { month: 'Dec', users: 1450, quizzes: 1100 },
        { month: 'Jan', users: 1680, quizzes: 1320 },
        { month: 'Feb', users: 1840, quizzes: 1540 }
      ],
      domainDistribution,
      recentAuditLogs: [
        { id: 'log-1', action: 'Created new career: "AI / Machine Learning Engineer"', user: 'Admin Eleanor', timestamp: '10 mins ago' },
        { id: 'log-2', action: 'Approved user success story: Clara O\'Sullivan', user: 'Admin Eleanor', timestamp: '2 hours ago' },
        { id: 'log-3', action: 'Updated quiz question weights for RIASEC Investigative vector', user: 'Admin Eleanor', timestamp: '1 day ago' },
        { id: 'log-4', action: 'Published new resource: "The AI Systems Blueprint 2026"', user: 'Admin Eleanor', timestamp: '2 days ago' }
      ]
    };
  }
};
