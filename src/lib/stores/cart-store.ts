import { create } from 'zustand';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discounts?: any;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.id === newItem.id 
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        };
      } else {
        return { items: [...state.items, newItem] };
      }
    });
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));