import { create } from 'zustand';

type ThemeState = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => {
  // Initialize theme from localStorage or system preference
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  const initialTheme = savedTheme 
    ? (savedTheme as 'light' | 'dark')
    : (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light');
  
  // Apply theme to document
  if (typeof document !== 'undefined') {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  return {
    theme: initialTheme,
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
        }
        
        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        return { theme: newTheme };
      });
    }
  };
});