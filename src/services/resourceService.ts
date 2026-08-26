import { Resource } from '../types';
import { mockResources } from '../data/mockResources';

export const resourceService = {
  getAllResources(): Resource[] {
    const stored = localStorage.getItem('pathseeker_resources');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return mockResources;
  },

  saveResources(resources: Resource[]) {
    localStorage.setItem('pathseeker_resources', JSON.stringify(resources));
  },

  getUserDownloads(): string[] {
    const stored = localStorage.getItem('pathseeker_user_downloads');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return ['res-ai-engineer-roadmap-2026', 'res-executive-resume-template'];
  },

  recordDownload(resourceId: string): boolean {
    const downloads = this.getUserDownloads();
    if (!downloads.includes(resourceId)) {
      downloads.push(resourceId);
      localStorage.setItem('pathseeker_user_downloads', JSON.stringify(downloads));
    }

    // Increment count on resource
    const all = this.getAllResources();
    const target = all.find((r) => r.id === resourceId);
    if (target) {
      target.downloadCount += 1;
      this.saveResources(all);
    }
    return true;
  }
};
