import { MultimediaItem, CareerDomain } from '../types';
import { mockMultimedia } from '../data/mockMultimedia';

export const contentService = {
  getAllMedia(): MultimediaItem[] {
    const stored = localStorage.getItem('pathseeker_multimedia');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockMultimedia;
  },

  getMediaById(id: string): MultimediaItem | undefined {
    const all = this.getAllMedia();
    return all.find((m) => m.id === id);
  },

  saveMedia(items: MultimediaItem[]) {
    localStorage.setItem('pathseeker_multimedia', JSON.stringify(items));
  },

  getRecentlyWatched(): { mediaId: string; progressPercent: number; lastWatched: string }[] {
    const stored = localStorage.getItem('pathseeker_recently_watched');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [
      { mediaId: 'media-ai-foundations-masterclass', progressPercent: 65, lastWatched: new Date().toISOString() },
      { mediaId: 'media-ux-design-systems', progressPercent: 40, lastWatched: new Date(Date.now() - 86400000).toISOString() }
    ];
  },

  updateWatchProgress(mediaId: string, progressPercent: number) {
    const recent = this.getRecentlyWatched();
    const existingIndex = recent.findIndex((r) => r.mediaId === mediaId);
    if (existingIndex >= 0) {
      recent[existingIndex].progressPercent = progressPercent;
      recent[existingIndex].lastWatched = new Date().toISOString();
    } else {
      recent.unshift({ mediaId, progressPercent, lastWatched: new Date().toISOString() });
    }
    localStorage.setItem('pathseeker_recently_watched', JSON.stringify(recent.slice(0, 10)));
  }
};
