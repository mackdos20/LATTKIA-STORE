import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subcategory } from '@/lib/db/models';

type SubcategoryState = {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  fetchSubcategories: () => Promise<void>;
};

export const useSubcategoryStore = create<SubcategoryState>()(
  persist(
    (set) => ({
      subcategories: [],
      loading: false,
      error: null,
      fetchSubcategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/subcategories');
          const data = await response.json();
          set({ subcategories: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch subcategories', loading: false });
        }
      },
    }),
    {
      name: 'subcategory-storage',
    }
  )
); 