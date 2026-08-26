import { create } from 'zustand';
import { CareerNote } from '../types';

interface BookmarkState {
  bookmarkedCareerIds: string[];
  bookmarkedMediaIds: string[];
  bookmarkedResourceIds: string[];
  careerNotes: Record<string, CareerNote>;

  // Actions
  toggleCareerBookmark: (careerId: string) => boolean;
  toggleMediaBookmark: (mediaId: string) => boolean;
  toggleResourceBookmark: (resourceId: string) => boolean;
  isCareerBookmarked: (careerId: string) => boolean;
  isMediaBookmarked: (mediaId: string) => boolean;
  isResourceBookmarked: (resourceId: string) => boolean;
  saveCareerNote: (careerId: string, careerTitle: string, noteText: string) => void;
  deleteCareerNote: (careerId: string) => void;
  getCareerNote: (careerId: string) => string;
}

const loadStoredBookmarks = () => {
  try {
    const careers = JSON.parse(localStorage.getItem('pathseeker_bm_careers') || '["car-ai-ml-engineer", "car-product-designer"]');
    const media = JSON.parse(localStorage.getItem('pathseeker_bm_media') || '["media-ai-foundations-masterclass"]');
    const resources = JSON.parse(localStorage.getItem('pathseeker_bm_resources') || '["res-ai-engineer-roadmap-2026", "res-luxury-design-systems-guide"]');
    const notes = JSON.parse(localStorage.getItem('pathseeker_career_notes') || '{"car-ai-ml-engineer":{"careerId":"car-ai-ml-engineer","careerTitle":"AI / Machine Learning Engineer","noteText":"Need to prioritize PyTorch distributed training and review transformer KV-cache optimizations before Q3.","updatedAt":"2026-02-22T12:00:00Z"}}');

    return { careers, media, resources, notes };
  } catch {
    return {
      careers: ['car-ai-ml-engineer', 'car-product-designer'],
      media: ['media-ai-foundations-masterclass'],
      resources: ['res-ai-engineer-roadmap-2026'],
      notes: {}
    };
  }
};

export const useBookmarkStore = create<BookmarkState>((set, get) => {
  const initial = loadStoredBookmarks();

  return {
    bookmarkedCareerIds: initial.careers,
    bookmarkedMediaIds: initial.media,
    bookmarkedResourceIds: initial.resources,
    careerNotes: initial.notes,

    toggleCareerBookmark: (careerId: string) => {
      const current = get().bookmarkedCareerIds;
      let updated: string[];
      let isAdded = false;

      if (current.includes(careerId)) {
        updated = current.filter((id) => id !== careerId);
      } else {
        updated = [...current, careerId];
        isAdded = true;
      }

      localStorage.setItem('pathseeker_bm_careers', JSON.stringify(updated));
      set({ bookmarkedCareerIds: updated });
      return isAdded;
    },

    toggleMediaBookmark: (mediaId: string) => {
      const current = get().bookmarkedMediaIds;
      let updated: string[];
      let isAdded = false;

      if (current.includes(mediaId)) {
        updated = current.filter((id) => id !== mediaId);
      } else {
        updated = [...current, mediaId];
        isAdded = true;
      }

      localStorage.setItem('pathseeker_bm_media', JSON.stringify(updated));
      set({ bookmarkedMediaIds: updated });
      return isAdded;
    },

    toggleResourceBookmark: (resourceId: string) => {
      const current = get().bookmarkedResourceIds;
      let updated: string[];
      let isAdded = false;

      if (current.includes(resourceId)) {
        updated = current.filter((id) => id !== resourceId);
      } else {
        updated = [...current, resourceId];
        isAdded = true;
      }

      localStorage.setItem('pathseeker_bm_resources', JSON.stringify(updated));
      set({ bookmarkedResourceIds: updated });
      return isAdded;
    },

    isCareerBookmarked: (careerId: string) => {
      return get().bookmarkedCareerIds.includes(careerId);
    },

    isMediaBookmarked: (mediaId: string) => {
      return get().bookmarkedMediaIds.includes(mediaId);
    },

    isResourceBookmarked: (resourceId: string) => {
      return get().bookmarkedResourceIds.includes(resourceId);
    },

    saveCareerNote: (careerId: string, careerTitle: string, noteText: string) => {
      const currentNotes = { ...get().careerNotes };
      currentNotes[careerId] = {
        careerId,
        careerTitle,
        noteText,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('pathseeker_career_notes', JSON.stringify(currentNotes));
      set({ careerNotes: currentNotes });
    },

    deleteCareerNote: (careerId: string) => {
      const currentNotes = { ...get().careerNotes };
      delete currentNotes[careerId];
      localStorage.setItem('pathseeker_career_notes', JSON.stringify(currentNotes));
      set({ careerNotes: currentNotes });
    },

    getCareerNote: (careerId: string) => {
      return get().careerNotes[careerId]?.noteText || '';
    }
  };
});
