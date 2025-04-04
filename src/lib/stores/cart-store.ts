import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/db/models';

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce((total, item) => {
          let price = item.price;
          
          // Apply discounts if available
          if (item.discounts && item.discounts.length > 0) {
            const applicableDiscounts = item.discounts
              .filter(d => item.quantity >= d.quantity)
              .sort((a, b) => b.percentage - a.percentage);
            
            if (applicableDiscounts.length > 0) {
              const discount = applicableDiscounts[0].percentage / 100;
              price = price * (1 - discount);
            }
          }
          
          return total + (price * item.quantity);
        }, 0);
      },
      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);