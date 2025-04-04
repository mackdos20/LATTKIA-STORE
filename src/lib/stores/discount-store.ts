import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Discount } from '@/lib/db/models';

type DiscountState = {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
  fetchDiscounts: () => Promise<void>;
};

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set) => ({
      discounts: [],
      loading: false,
      error: null,
      fetchDiscounts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/discounts');
          const data = await response.json();
          set({ discounts: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch discounts', loading: false });
        }
      },
    }),
    {
      name: 'discount-storage',
    }
  )
); 