import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category } from '@/lib/db/models';

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      loading: false,
      error: null,
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/categories');
          const data = await response.json();
          set({ categories: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch categories', loading: false });
        }
      },
    }),
    {
      name: 'category-storage',
    }
  )
); 