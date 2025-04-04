import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageState = {
  language: 'en' | 'ar';
  loading: boolean;
  error: string | null;
  setLanguage: (language: 'en' | 'ar') => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      loading: false,
      error: null,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
); 