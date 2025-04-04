import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/lib/db/models';

type OrderState = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      loading: false,
      error: null,
      fetchOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/orders');
          const data = await response.json();
          set({ orders: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch orders', loading: false });
        }
      },
    }),
    {
      name: 'order-storage',
    }
  )
); 