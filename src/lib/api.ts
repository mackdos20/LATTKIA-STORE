// Mock API service for demo purposes
// In a real app, this would make actual API calls to your backend

import { Category, Product, Order } from "./db/models";

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name: "شواحن",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  {
    id: "2",
    name: "سماعات",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
  {
    id: "3",
    name: "كفرات حماية",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "شاحن سامسونج سريع",
    description: "شاحن سامسونج سريع بقوة 25 واط، متوافق مع جميع هواتف سامسونج الحديثة.",
    price: 25,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categoryId: "1",
    stock: 100,
    featured: true,
    discounts: [
      { quantity: "10", percentage: "5" },
      { quantity: "20", percentage: "10" },
    ],
  },
  {
    id: "2",
    name: "سماعات بلوتوث",
    description: "سماعات بلوتوث لاسلكية عالية الجودة مع إلغاء الضوضاء.",
    price: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categoryId: "2",
    stock: 75,
    featured: true,
    discounts: [
      { quantity: "5", percentage: "5" },
      { quantity: "10", percentage: "10" },
    ],
  },
  {
    id: "3",
    name: "كفر حماية آيفون 13",
    description: "كفر حماية قوي لهاتف آيفون 13، مقاوم للصدمات.",
    price: 15,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categoryId: "3",
    stock: 150,
    featured: true,
    discounts: [
      { quantity: "10", percentage: "5" },
      { quantity: "20", percentage: "10" },
    ],
  },
  {
    id: "4",
    name: "حامل هاتف للسيارة",
    description: "حامل هاتف مغناطيسي للسيارة، سهل التركيب والاستخدام.",
    price: 20,
    image: "https://images.unsplash.com/photo-1616112953-c5f9e1f5d7ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    categoryId: "4",
    stock: 80,
    featured: false,
    discounts: [],
  },
];

// API service
export const api = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCategories;
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.filter(product => product.featured);
  },
  
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.filter(product => product.categoryId === categoryId);
  },
  
  getProduct: async (productId: string): Promise<Product | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts.find(product => product.id === productId) || null;
  },
};