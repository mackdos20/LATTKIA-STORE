import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  discounts?: { quantity: string; percentage: string }[];
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        
        return { items: [...state.items, item] };
      }),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((i) => i.id !== itemId),
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const { items } = get();
        
        return items.reduce((total, item) => {
          let itemPrice = item.price;
          
          // Apply quantity discounts if available
          if (item.discounts && item.discounts.length > 0) {
            // Sort discounts by quantity in descending order
            const sortedDiscounts = [...item.discounts].sort(
              (a, b) => parseInt(b.quantity) - parseInt(a.quantity)
            );
            
            // Find the applicable discount
            for (const discount of sortedDiscounts) {
              if (item.quantity >= parseInt(discount.quantity)) {
                const discountPercentage = parseInt(discount.percentage) / 100;
                itemPrice = itemPrice * (1 - discountPercentage);
                break;
              }
            }
          }
          
          return total + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);