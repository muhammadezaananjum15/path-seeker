import { SuccessStory } from '../types';
import { mockStories } from '../data/mockStories';

export const storyService = {
  getAllStories(): SuccessStory[] {
    const stored = localStorage.getItem('pathseeker_stories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockStories;
  },

  getStoryById(id: string): SuccessStory | undefined {
    const all = this.getAllStories();
    return all.find((s) => s.id === id);
  },

  saveStories(stories: SuccessStory[]) {
    localStorage.setItem('pathseeker_stories', JSON.stringify(stories));
  },

  submitStory(story: Omit<SuccessStory, 'id' | 'status'>): SuccessStory {
    const all = this.getAllStories();
    const newStory: SuccessStory = {
      ...story,
      id: `story-${Date.now()}`,
      status: 'pending'
    };
    all.unshift(newStory);
    this.saveStories(all);
    return newStory;
  }
};
