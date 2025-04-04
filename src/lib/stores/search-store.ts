import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/db/models';

type SearchState = {
  query: string;
  results: Product[];
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  search: () => Promise<void>;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      results: [],
      loading: false,
      error: null,
      setQuery: (query) => set({ query }),
      search: async () => {
        set({ loading: true, error: null });
        try {
          const currentQuery = get().query;
          const response = await fetch(`/api/search?q=${encodeURIComponent(currentQuery)}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to search');
          }
          set({ results: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to search', loading: false });
        }
      },
    }),
    {
      name: 'search-storage',
    }
  )
); 