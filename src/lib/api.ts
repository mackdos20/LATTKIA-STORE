import axios from 'axios';
import { useAuthStore } from './stores/auth-store';

// Mock data for development
const mockCategories = [
  {
    id: '1',
    name: 'Landscapes',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Portraits',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Street',
    image: 'https://images.unsplash.com/photo-1519575706483-221027bfbb31?q=80&w=2071&auto=format&fit=crop',
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Mountain Sunrise',
    description: 'Beautiful mountain landscape at sunrise with vibrant colors',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    categoryId: '1',
    featured: true,
    discounts: [
      { quantity: 3, discount: 10 },
      { quantity: 5, discount: 15 },
    ],
  },
  {
    id: '2',
    name: 'Ocean Waves',
    description: 'Dramatic ocean waves crashing against the shore',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop',
    categoryId: '1',
    featured: true,
    discounts: [
      { quantity: 3, discount: 10 },
    ],
  },
  {
    id: '3',
    name: 'Portrait Study',
    description: 'Professional portrait with dramatic lighting',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop',
    categoryId: '2',
    featured: true,
    discounts: [],
  },
  {
    id: '4',
    name: 'City Life',
    description: 'Urban street photography capturing the essence of city life',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=1990&auto=format&fit=crop',
    categoryId: '3',
    featured: true,
    discounts: [
      { quantity: 2, discount: 5 },
      { quantity: 4, discount: 12 },
    ],
  },
];

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
    // In a real app, this would be an API call
    // return apiClient.get('/categories').then(res => res.data);
    return mockCategories;
  },
  
  // Products
  getFeaturedProducts: async () => {
    // In a real app, this would be an API call
    // return apiClient.get('/products/featured').then(res => res.data);
    return mockProducts.filter(product => product.featured);
  },
  
  getProductsByCategory: async (categoryId: string) => {
    // In a real app, this would be an API call
    // return apiClient.get(`/categories/${categoryId}/products`).then(res => res.data);
    return mockProducts.filter(product => product.categoryId === categoryId);
  },
  
  getProduct: async (productId: string) => {
    // In a real app, this would be an API call
    // return apiClient.get(`/products/${productId}`).then(res => res.data);
    return mockProducts.find(product => product.id === productId);
  },
};