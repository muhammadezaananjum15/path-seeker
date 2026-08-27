import { SuccessStory } from '../types';
import { mockStories } from '../data/mockStories';
import { storyApi } from './storyApi';

export const storyService = {
  async fetchApprovedStories(domain?: string): Promise<SuccessStory[]> {
    try {
      const res = await storyApi.getApprovedStories({ domain: domain === 'All' ? undefined : domain });
      if (res.data.success && Array.isArray(res.data.stories)) {
        return res.data.stories.map((s: any) => ({
          ...s,
          id: s._id || s.id,
        }));
      }
    } catch (e) {
      console.warn('[storyService] Failed to fetch backend stories, using local fallback:', e);
    }
    const stored = localStorage.getItem('pathseeker_stories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return mockStories;
  },

  async fetchStoryById(id: string): Promise<SuccessStory | undefined> {
    try {
      const res = await storyApi.getStoryById(id);
      if (res.data.success && res.data.story) {
        return {
          ...res.data.story,
          id: res.data.story._id || res.data.story.id,
        };
      }
    } catch (e) {
      console.warn('[storyService] Failed to fetch story by ID from backend:', e);
    }
    const all = this.getAllStories();
    return all.find((s) => s.id === id || (s as any)._id === id);
  },

  getAllStories(): SuccessStory[] {
    const stored = localStorage.getItem('pathseeker_stories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return mockStories;
  },

  saveStories(stories: SuccessStory[]) {
    localStorage.setItem('pathseeker_stories', JSON.stringify(stories));
  },

  async submitStory(storyData: Omit<SuccessStory, 'id' | 'status'>): Promise<SuccessStory> {
    try {
      const res = await storyApi.submitStory(storyData);
      if (res.data.success && res.data.story) {
        const created = {
          ...res.data.story,
          id: res.data.story._id || res.data.story.id,
        };
        return created;
      }
    } catch (e) {
      console.warn('[storyService] Submit story failed on backend API, using local storage:', e);
    }

    const all = this.getAllStories();
    const newStory: SuccessStory = {
      ...storyData,
      id: `story-${Date.now()}`,
      status: 'pending',
    };
    all.unshift(newStory);
    this.saveStories(all);
    return newStory;
  },
};

