import apiClient from './apiClient';

export const publicApi = {
  getRemoteJobs: (category = 'software-development') => apiClient.get('/public-apis/remote-jobs', { params: { category } }),
  getDevToBlogs: (tag = 'career') => apiClient.get('/public-apis/devto-blogs', { params: { tag } }),
  getGithubProjects: (topic = 'react') => apiClient.get('/public-apis/github-projects', { params: { topic } }),
  getWikiSummary: (query = 'Software_engineering') => apiClient.get('/public-apis/wiki-summary', { params: { query } }),
  getCurrencyRates: () => apiClient.get('/public-apis/currency-rates'),
  getHackerNewsTop: () => apiClient.get('/public-apis/hackernews-top'),
};
