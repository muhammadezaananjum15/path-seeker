import { create } from 'zustand';
import { SuccessStory, CareerDomain } from '../types';
import { storyService } from '../services/storyService';

interface StoryState {
  stories: SuccessStory[];
  selectedDomain: CareerDomain | 'All';
  searchQuery: string;

  // Actions
  setSelectedDomain: (domain: CareerDomain | 'All') => void;
  setSearchQuery: (query: string) => void;
  submitUserStory: (story: Omit<SuccessStory, 'id' | 'status'>) => SuccessStory;
  addStory: (story: Omit<SuccessStory, 'id' | 'status'> | SuccessStory) => void;
  updateStory: (storyId: string, updates: Partial<SuccessStory>) => void;
  approveStory: (storyId: string) => void;
  rejectStory: (storyId: string) => void;
  deleteStory: (storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: storyService.getAllStories(),
  selectedDomain: 'All',
  searchQuery: '',

  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  submitUserStory: (storyData) => {
    const newStory = storyService.submitStory(storyData);
    set({ stories: storyService.getAllStories() });
    return newStory;
  },

  addStory: (storyData) => {
    const newStory = storyService.submitStory(storyData as any);
    set({ stories: storyService.getAllStories() });
  },

  updateStory: (storyId: string, updates: Partial<SuccessStory>) => {
    const updated = get().stories.map((s) => (s.id === storyId ? { ...s, ...updates } : s));
    storyService.saveStories(updated);
    set({ stories: updated });
  },

  approveStory: (storyId: string) => {
    const updated = get().stories.map((s) => (s.id === storyId ? { ...s, status: 'published' as const } : s));
    storyService.saveStories(updated);
    set({ stories: updated });
  },

  rejectStory: (storyId: string) => {
    const updated = get().stories.map((s) => (s.id === storyId ? { ...s, status: 'rejected' as const } : s));
    storyService.saveStories(updated);
    set({ stories: updated });
  },

  deleteStory: (storyId: string) => {
    const updated = get().stories.filter((s) => s.id !== storyId);
    storyService.saveStories(updated);
    set({ stories: updated });
  }
}));
