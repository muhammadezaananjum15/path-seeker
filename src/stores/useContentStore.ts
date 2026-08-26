import { create } from 'zustand';
import { MultimediaItem, CareerDomain } from '../types';
import { contentService } from '../services/contentService';

interface ContentState {
  mediaItems: MultimediaItem[];
  selectedDomain: CareerDomain | 'All';
  selectedType: string;
  searchQuery: string;
  recentlyWatched: { mediaId: string; progressPercent: number; lastWatched: string }[];
  activePlaybackItem: MultimediaItem | null;

  // Actions
  setSelectedDomain: (domain: CareerDomain | 'All') => void;
  setSelectedType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setActivePlaybackItem: (item: MultimediaItem | null) => void;
  updateWatchProgress: (mediaId: string, progressPercent: number) => void;
  addMediaItem: (item: MultimediaItem) => void;
  updateMediaItem: (idOrItem: MultimediaItem | string, updates?: Partial<MultimediaItem>) => void;
  deleteMediaItem: (mediaId: string) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  mediaItems: contentService.getAllMedia(),
  selectedDomain: 'All',
  selectedType: 'All',
  searchQuery: '',
  recentlyWatched: contentService.getRecentlyWatched(),
  activePlaybackItem: null,

  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActivePlaybackItem: (item) => set({ activePlaybackItem: item }),

  updateWatchProgress: (mediaId: string, progressPercent: number) => {
    contentService.updateWatchProgress(mediaId, progressPercent);
    set({ recentlyWatched: contentService.getRecentlyWatched() });
  },

  addMediaItem: (item: MultimediaItem) => {
    const updated = [item, ...get().mediaItems];
    contentService.saveMedia(updated);
    set({ mediaItems: updated });
  },

  // Supports both (item: MultimediaItem) and (id: string, updates: Partial<MultimediaItem>)
  updateMediaItem: (idOrItem: MultimediaItem | string, updates?: Partial<MultimediaItem>) => {
    let updated: MultimediaItem[];
    if (typeof idOrItem === 'string') {
      updated = get().mediaItems.map((m) =>
        m.id === idOrItem ? { ...m, ...updates } : m
      );
    } else {
      updated = get().mediaItems.map((m) =>
        m.id === idOrItem.id ? idOrItem : m
      );
    }
    contentService.saveMedia(updated);
    set({ mediaItems: updated });
  },

  deleteMediaItem: (mediaId: string) => {
    const updated = get().mediaItems.filter((m) => m.id !== mediaId);
    contentService.saveMedia(updated);
    set({ mediaItems: updated });
  }
}));
