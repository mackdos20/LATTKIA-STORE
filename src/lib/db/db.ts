import { Category, Product, Order, User, Subcategory, OrderItem, Discount } from './models';
import { mockCategories, mockProducts, mockOrders, mockUsers } from './mock-data';

// This is a minimal implementation to fix build errors
// In a real app, this would connect to a database

export const db = {
  categories: {
    getAll: async (): Promise<Category[]> => mockCategories,
    getById: async (id: string): Promise<Category | undefined> => 
      mockCategories.find(category => category.id === id),
    create: async (category: Omit<Category, 'id'>): Promise<Category> => {
      const newCategory = { ...category, id: Math.random().toString(36).substr(2, 9) };
      return newCategory;
    },
    update: async (id: string, category: Partial<Category>): Promise<Category | undefined> => {
      const existingCategory = mockCategories.find(c => c.id === id);
      if (!existingCategory) return undefined;
      return { ...existingCategory, ...category };
    },
    delete: async (id: string): Promise<boolean> => true
  },
  
  subcategories: {
    getAll: async (): Promise<Subcategory[]> => [],
    getByCategoryId: async (categoryId: string): Promise<Subcategory[]> => [],
    getById: async (id: string): Promise<Subcategory | undefined> => undefined,
    create: async (subcategory: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
      const newSubcategory = { ...subcategory, id: Math.random().toString(36).substr(2, 9) };
      return newSubcategory;
    },
    update: async (id: string, subcategory: Partial<Subcategory>): Promise<Subcategory | undefined> => undefined,
    delete: async (id: string): Promise<boolean> => true
  },
  
  products: {
    getAll: async (): Promise<Product[]> => mockProducts,
    getById: async (id: string): Promise<Product | undefined> => 
      mockProducts.find(product => product.id === id),
    getByCategoryId: async (categoryId: string): Promise<Product[]> => 
      mockProducts.filter(product => product.categoryId === categoryId),
    getBySubcategoryId: async (subcategoryId: string): Promise<Product[]> => 
      mockProducts.filter(product => product.subcategoryId === subcategoryId),
    getFeatured: async (): Promise<Product[]> => 
      mockProducts.filter(product => product.featured),
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
      const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
      return newProduct;
    },
    update: async (id: string, product: Partial<Product>): Promise<Product | undefined> => {
      const existingProduct = mockProducts.find(p => p.id === id);
      if (!existingProduct) return undefined;
      return { ...existingProduct, ...product };
    },
    delete: async (id: string): Promise<boolean> => true
  },
  
  orders: {
    getAll: async (): Promise<Order[]> => mockOrders,
    getById: async (id: string): Promise<Order | undefined> => 
      mockOrders.find(order => order.id === id),
    getByUserId: async (userId: string): Promise<Order[]> => 
      mockOrders.filter(order => order.userId === userId),
    create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
      const now = new Date().toISOString();
      const newOrder = { 
        ...order, 
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now,
        updatedAt: now
      };
      return newOrder as Order;
    },
    updateStatus: async (id: string, status: Order['status']): Promise<Order | undefined> => {
      const existingOrder = mockOrders.find(o => o.id === id);
      if (!existingOrder) return undefined;
      return { ...existingOrder, status, updatedAt: new Date().toISOString() };
    }
  },
  
  users: {
    getAll: async (): Promise<User[]> => mockUsers,
    getById: async (id: string): Promise<User | undefined> => 
      mockUsers.find(user => user.id === id),
    create: async (user: Omit<User, 'id'>): Promise<User> => {
      const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
      return newUser;
    }
  },
  
  notifications: {
    sendTelegram: async (message: string): Promise<boolean> => true
  }
};