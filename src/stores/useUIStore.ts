import { create } from 'zustand';
import { ToastItem } from '../types';

interface UIState {
  toasts: ToastItem[];
  isMobileDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  isNotesModalOpen: boolean;
  notesModalCareerId: string | null;
  notesModalCareerTitle: string | null;
  isShareModalOpen: boolean;
  shareModalData: { title: string; url: string; text?: string } | null;

  // Actions
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  openNotesModal: (careerId: string, careerTitle: string) => void;
  closeNotesModal: () => void;
  openShareModal: (data: { title: string; url: string; text?: string }) => void;
  closeShareModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  isMobileDrawerOpen: false,
  isSearchModalOpen: false,
  isNotesModalOpen: false,
  notesModalCareerId: null,
  notesModalCareerTitle: null,
  isShareModalOpen: false,
  shareModalData: null,

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration || 4000
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto dismiss
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setMobileDrawerOpen: (open: boolean) => set({ isMobileDrawerOpen: open }),
  setSearchModalOpen: (open: boolean) => set({ isSearchModalOpen: open }),

  openNotesModal: (careerId: string, careerTitle: string) => {
    set({
      isNotesModalOpen: true,
      notesModalCareerId: careerId,
      notesModalCareerTitle: careerTitle
    });
  },

  closeNotesModal: () => {
    set({
      isNotesModalOpen: false,
      notesModalCareerId: null,
      notesModalCareerTitle: null
    });
  },

  openShareModal: (data) => {
    set({
      isShareModalOpen: true,
      shareModalData: data
    });
  },

  closeShareModal: () => {
    set({
      isShareModalOpen: false,
      shareModalData: null
    });
  }
}));
