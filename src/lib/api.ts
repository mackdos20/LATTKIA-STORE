import axios from 'axios';
import { useAuthStore } from './stores/auth-store';
import { db } from './db/db';
import { Category, Product, Order, User, Subcategory } from './db/models';

// Create API instance
const apiClient = axios.create({
  baseURL: '/api',
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    // Mock login for development
    if (email === 'admin@example.com' && password === 'password') {
      return {
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        },
        token: 'mock-token-admin',
      };
    } else if (email === 'user@example.com' && password === 'password') {
      return {
        user: {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
        },
        token: 'mock-token-user',
      };
    }
    
    return null;
  },
  
  // Categories
  getCategories: async () => {
    return db.categories.getAll();
  },
  
  getCategoryById: async (id: string) => {
    return db.categories.getById(id);
  },
  
  createCategory: async (category: Omit<Category, 'id'>) => {
    return db.categories.create(category);
  },
  
  updateCategory: async (id: string, category: Partial<Category>) => {
    return db.categories.update(id, category);
  },
  
  deleteCategory: async (id: string) => {
    return db.categories.delete(id);
  },
  
  // Subcategories
  getSubcategories: async () => {
    return db.subcategories.getAll();
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string) => {
    return db.subcategories.getByCategoryId(categoryId);
  },
  
  getSubcategoryById: async (id: string) => {
    return db.subcategories.getById(id);
  },
  
  createSubcategory: async (subcategory: Omit<Subcategory, 'id'>) => {
    return db.subcategories.create(subcategory);
  },
  
  updateSubcategory: async (id: string, subcategory: Partial<Subcategory>) => {
    return db.subcategories.update(id, subcategory);
  },
  
  deleteSubcategory: async (id: string) => {
    return db.subcategories.delete(id);
  },
  
  // Products
  getProducts: async () => {
    return db.products.getAll();
  },
  
  getFeaturedProducts: async () => {
    return db.products.getFeatured();
  },
  
  getProductsByCategory: async (categoryId: string) => {
    return db.products.getByCategoryId(categoryId);
  },
  
  getProductsBySubcategoryId: async (subcategoryId: string) => {
    return db.products.getBySubcategoryId(subcategoryId);
  },
  
  getProduct: async (productId: string) => {
    return db.products.getById(productId);
  },
  
  getProductById: async (id: string) => {
    return db.products.getById(id);
  },
  
  createProduct: async (product: Omit<Product, 'id'>) => {
    return db.products.create(product);
  },
  
  updateProduct: async (id: string, product: Partial<Product>) => {
    return db.products.update(id, product);
  },
  
  deleteProduct: async (id: string) => {
    return db.products.delete(id);
  },
  
  // Orders
  getOrders: async () => {
    return db.orders.getAll();
  },
  
  getOrderById: async (id: string) => {
    return db.orders.getById(id);
  },
  
  createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    return db.orders.create(order);
  },
  
  updateOrderStatus: async (id: string, status: Order['status']) => {
    return db.orders.updateStatus(id, status);
  },
  
  // Users
  createUser: async (user: Omit<User, 'id'>) => {
    return db.users.create(user);
  },
  
  // Notifications
  sendTelegramNotification: async (message: string) => {
    return db.notifications.sendTelegram(message);
  }
};