import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Light/Dark Theme"
      className="p-2 rounded-xl transition-colors duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 animate-spin-once" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-pulse-once" />
      )}
    </button>
  );
};
