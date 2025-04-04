import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/lib/db/models';

type OrderItemState = {
  orderItems: OrderItem[];
  loading: boolean;
  error: string | null;
  fetchOrderItems: () => Promise<void>;
};

export const useOrderItemStore = create<OrderItemState>()(
  persist(
    (set) => ({
      orderItems: [],
      loading: false,
      error: null,
      fetchOrderItems: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/order-items');
          const data = await response.json();
          set({ orderItems: data, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch order items', loading: false });
        }
      },
    }),
    {
      name: 'order-item-storage',
    }
  )
); 