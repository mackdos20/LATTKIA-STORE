import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/db/models';

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      loading: false,
      error: null,
      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          set({ products: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch products', loading: false });
        }
      },
    }),
    {
      name: 'product-storage',
    }
  )
); 