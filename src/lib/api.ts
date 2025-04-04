import { Category, Product } from './db/models';

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'كفرات حماية',
    description: 'كفرات حماية لجميع أنواع الهواتف',
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    slug: 'phone-cases',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'شواحن',
    description: 'شواحن سريعة ومتنوعة',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    slug: 'chargers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'سماعات',
    description: 'سماعات سلكية ولاسلكية',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    slug: 'headphones',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'كفر حماية آيفون 13',
    description: 'كفر حماية شفاف مضاد للصدمات لآيفون 13',
    price: 25,
    costPrice: 10,
    image: 'https://images.unsplash.com/photo-1603898037225-1bea09c550c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    categoryId: '1',
    stock: 100,
    minStock: 20,
    sku: 'CASE-IP13-001',
    featured: true,
    discounts: [
      { quantity: 10, percentage: 10 },
      { quantity: 50, percentage: 20 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'شاحن سريع سامسونج',
    description: 'شاحن سريع أصلي لهواتف سامسونج',
    price: 35,
    costPrice: 15,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    categoryId: '2',
    stock: 50,
    minStock: 10,
    sku: 'CHRG-SAM-001',
    featured: true,
    discounts: [
      { quantity: 5, percentage: 5 },
      { quantity: 20, percentage: 15 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'سماعات بلوتوث',
    description: 'سماعات بلوتوث لاسلكية مع إلغاء الضوضاء',
    price: 50,
    costPrice: 20,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    categoryId: '3',
    stock: 30,
    minStock: 5,
    sku: 'HDPHN-BT-001',
    featured: true,
    discounts: [
      { quantity: 3, percentage: 10 },
      { quantity: 10, percentage: 20 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'حامل هاتف للسيارة',
    description: 'حامل هاتف مغناطيسي للسيارة',
    price: 20,
    costPrice: 8,
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    categoryId: '1',
    stock: 80,
    minStock: 15,
    sku: 'HLDR-CAR-001',
    featured: true,
    discounts: [
      { quantity: 10, percentage: 10 },
      { quantity: 30, percentage: 20 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// API methods
export const api = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCategories;
  },
  
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories.find(category => category.id === id);
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(product => product.id === id);
  },
  
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.filter(product => product.categoryId === categoryId);
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.filter(product => product.featured);
  },
};