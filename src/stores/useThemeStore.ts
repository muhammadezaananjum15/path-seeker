import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getSavedTheme = (): 'light' | 'dark' => {
  try {
    const defaultReset = localStorage.getItem('pathseeker_theme_v3_reset');
    if (!defaultReset) {
      localStorage.setItem('pathseeker_theme', 'light');
      localStorage.setItem('pathseeker_theme_v3_reset', 'true');
      return 'light';
    }
    const saved = localStorage.getItem('pathseeker_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'light';
};

const applyThemeToDOM = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};

const initialTheme = getSavedTheme();
applyThemeToDOM(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,

  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('pathseeker_theme', nextTheme);
      applyThemeToDOM(nextTheme);
      return { theme: nextTheme };
    }),

  setTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem('pathseeker_theme', theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
}));
