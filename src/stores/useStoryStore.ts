import { create } from 'zustand';
import { SuccessStory, CareerDomain } from '../types';
import { storyService } from '../services/storyService';
import { storyApi } from '../services/storyApi';

interface StoryState {
  stories: SuccessStory[];
  selectedDomain: CareerDomain | 'All';
  searchQuery: string;
  loading: boolean;
  error: string | null;

  // Actions
  fetchStories: (domain?: CareerDomain | 'All') => Promise<void>;
  setSelectedDomain: (domain: CareerDomain | 'All') => void;
  setSearchQuery: (query: string) => void;
  submitUserStory: (story: Omit<SuccessStory, 'id' | 'status'>) => Promise<SuccessStory>;
  addStory: (story: Omit<SuccessStory, 'id' | 'status'> | SuccessStory) => Promise<void>;
  updateStory: (storyId: string, updates: Partial<SuccessStory>) => void;
  approveStory: (storyId: string) => Promise<void>;
  rejectStory: (storyId: string) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: storyService.getAllStories(),
  selectedDomain: 'All',
  searchQuery: '',
  loading: false,
  error: null,

  fetchStories: async (domain) => {
    set({ loading: true, error: null });
    try {
      const activeDomain = domain !== undefined ? domain : get().selectedDomain;
      const data = await storyService.fetchApprovedStories(activeDomain);
      set({ stories: data, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch stories', loading: false });
    }
  },

  setSelectedDomain: (domain) => {
    set({ selectedDomain: domain });
    get().fetchStories(domain);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  submitUserStory: async (storyData) => {
    set({ loading: true });
    try {
      const newStory = await storyService.submitStory(storyData);
      await get().fetchStories();
      set({ loading: false });
      return newStory;
    } catch (e: any) {
      set({ loading: false });
      throw e;
    }
  },

  addStory: async (storyData) => {
    await get().submitUserStory(storyData as any);
  },

  updateStory: (storyId: string, updates: Partial<SuccessStory>) => {
    const updated = get().stories.map((s) => (s.id === storyId ? { ...s, ...updates } : s));
    storyService.saveStories(updated);
    set({ stories: updated });
  },

  approveStory: async (storyId: string) => {
    try {
      await storyApi.adminUpdateStoryStatus(storyId, 'approved');
      await get().fetchStories();
    } catch (e) {
      const updated = get().stories.map((s) => (s.id === storyId ? { ...s, status: 'published' as const } : s));
      storyService.saveStories(updated);
      set({ stories: updated });
    }
  },

  rejectStory: async (storyId: string) => {
    try {
      await storyApi.adminUpdateStoryStatus(storyId, 'rejected');
      await get().fetchStories();
    } catch (e) {
      const updated = get().stories.map((s) => (s.id === storyId ? { ...s, status: 'rejected' as const } : s));
      storyService.saveStories(updated);
      set({ stories: updated });
    }
  },

  deleteStory: async (storyId: string) => {
    try {
      await storyApi.adminDeleteStory(storyId);
      await get().fetchStories();
    } catch (e) {
      const updated = get().stories.filter((s) => s.id !== storyId && (s as any)._id !== storyId);
      storyService.saveStories(updated);
      set({ stories: updated });
    }
  },
}));

