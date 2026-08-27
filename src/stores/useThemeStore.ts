import { create } from 'zustand';

interface ThemeState {
  theme: 'light';
}

// Theme is permanently locked to 'light' (white background).
// Dark mode toggle has been removed from the application.
export const useThemeStore = create<ThemeState>(() => ({
  theme: 'light',
}));

// Ensure DOM never has dark class
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
  localStorage.removeItem('pathseeker_theme');
}
