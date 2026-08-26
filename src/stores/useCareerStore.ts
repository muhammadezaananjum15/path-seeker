import { create } from 'zustand';
import { Career, CareerDomain, DemandLevel } from '../types';
import { careerService, CareerFilterCriteria } from '../services/careerService';

interface CareerState {
  careers: Career[];
  filterCriteria: CareerFilterCriteria;
  comparedCareerIds: string[];
  isCompareDrawerOpen: boolean;
  activeCareerDetail: Career | null;

  // Actions
  setFilterCriteria: (criteria: Partial<CareerFilterCriteria>) => void;
  resetFilters: () => void;
  toggleCompareCareer: (careerId: string) => void;
  removeComparedCareer: (careerId: string) => void;
  clearComparedCareers: () => void;
  setCompareDrawerOpen: (open: boolean) => void;
  setActiveCareerDetail: (career: Career | null) => void;
  addCareer: (newCareer: Career) => void;
  updateCareer: (careerOrId: Career | string, updates?: Partial<Career>) => void;
  deleteCareer: (careerId: string) => void;
}

const defaultFilters: CareerFilterCriteria = {
  searchQuery: '',
  domain: 'All',
  demand: 'All',
  salaryMin: 50000,
  salaryMax: 350000,
  sortBy: 'match'
};

export const useCareerStore = create<CareerState>((set, get) => ({
  careers: careerService.getAllCareers(),
  filterCriteria: defaultFilters,
  comparedCareerIds: ['car-ai-ml-engineer', 'car-software-engineer'],
  isCompareDrawerOpen: false,
  activeCareerDetail: null,

  setFilterCriteria: (criteria) => {
    set((state) => ({
      filterCriteria: { ...state.filterCriteria, ...criteria }
    }));
  },

  resetFilters: () => {
    set({ filterCriteria: defaultFilters });
  },

  toggleCompareCareer: (careerId: string) => {
    const current = get().comparedCareerIds;
    if (current.includes(careerId)) {
      set({ comparedCareerIds: current.filter((id) => id !== careerId) });
    } else {
      if (current.length >= 3) {
        set({ comparedCareerIds: [...current.slice(1), careerId], isCompareDrawerOpen: true });
      } else {
        set({ comparedCareerIds: [...current, careerId], isCompareDrawerOpen: true });
      }
    }
  },

  removeComparedCareer: (careerId: string) => {
    set((state) => ({
      comparedCareerIds: state.comparedCareerIds.filter((id) => id !== careerId)
    }));
  },

  clearComparedCareers: () => {
    set({ comparedCareerIds: [], isCompareDrawerOpen: false });
  },

  setCompareDrawerOpen: (open: boolean) => {
    set({ isCompareDrawerOpen: open });
  },

  setActiveCareerDetail: (career: Career | null) => {
    set({ activeCareerDetail: career });
  },

  addCareer: (newCareer: Career) => {
    const updated = [newCareer, ...get().careers];
    careerService.saveCareers(updated);
    set({ careers: updated });
  },

  // Supports both (career: Career) and (id: string, updates: Partial<Career>)
  updateCareer: (careerOrId: Career | string, updates?: Partial<Career>) => {
    let updated: Career[];
    if (typeof careerOrId === 'string') {
      // Called as updateCareer(id, partial)
      updated = get().careers.map((c) =>
        c.id === careerOrId ? { ...c, ...updates } : c
      );
    } else {
      // Called as updateCareer(fullCareer)
      updated = get().careers.map((c) =>
        c.id === careerOrId.id ? careerOrId : c
      );
    }
    careerService.saveCareers(updated);
    set({ careers: updated });
  },

  deleteCareer: (careerId: string) => {
    const updated = get().careers.filter((c) => c.id !== careerId);
    careerService.saveCareers(updated);
    set({
      careers: updated,
      comparedCareerIds: get().comparedCareerIds.filter((id) => id !== careerId)
    });
  }
}));
