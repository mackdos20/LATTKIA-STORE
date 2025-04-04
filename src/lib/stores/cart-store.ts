import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/db/models';

type CartState = {
  items: Array<{
    product: Product;
    quantity: number;
  }>;
  loading: boolean;
  error: string | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce((total, item) => {
          let price = item.product.price;
          
          // Apply discount if available
          if (item.product.discounts && item.product.discounts.length > 0) {
            // Sort discounts by minQuantity in descending order
            const sortedDiscounts = [...item.product.discounts].sort(
              (a, b) => b.minQuantity - a.minQuantity
            );
            
            // Find the applicable discount
            const applicableDiscount = sortedDiscounts.find(
              (discount) => item.quantity >= discount.minQuantity
            );
            
            if (applicableDiscount) {
              price = price * (1 - applicableDiscount.discountPercentage / 100);
            }
          }
          
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);