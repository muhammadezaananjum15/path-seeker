import { create } from 'zustand';
import { Resource, CareerDomain } from '../types';
import { resourceService } from '../services/resourceService';

interface ResourceState {
  resources: Resource[];
  selectedDomain: CareerDomain | 'All';
  selectedFormat: string | 'All';
  searchQuery: string;
  userDownloads: string[];

  // Actions
  setSelectedDomain: (domain: CareerDomain | 'All') => void;
  setSelectedFormat: (format: string | 'All') => void;
  setSearchQuery: (query: string) => void;
  downloadResource: (resourceId: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (resourceId: string) => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: resourceService.getAllResources(),
  selectedDomain: 'All',
  selectedFormat: 'All',
  searchQuery: '',
  userDownloads: resourceService.getUserDownloads(),

  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSelectedFormat: (format) => set({ selectedFormat: format }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  downloadResource: (resourceId: string) => {
    resourceService.recordDownload(resourceId);
    set({
      resources: resourceService.getAllResources(),
      userDownloads: resourceService.getUserDownloads()
    });
  },

  addResource: (resource: Resource) => {
    const updated = [resource, ...get().resources];
    resourceService.saveResources(updated);
    set({ resources: updated });
  },

  updateResource: (resource: Resource) => {
    const updated = get().resources.map((r) => (r.id === resource.id ? resource : r));
    resourceService.saveResources(updated);
    set({ resources: updated });
  },

  deleteResource: (resourceId: string) => {
    const updated = get().resources.filter((r) => r.id !== resourceId);
    resourceService.saveResources(updated);
    set({ resources: updated });
  }
}));
