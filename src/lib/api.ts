import axios from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Category, Product, Subcategory, Order, User } from "@/lib/db-types";

// Base API configuration
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data and functions for development
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Phone Cases",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "phone-cases",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Chargers",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "chargers",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Screen Protectors",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "screen-protectors",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockSubcategories: Subcategory[] = [
  {
    id: "1",
    name: "iPhone Cases",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Samsung Cases",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 13 Pro Case",
    description: "Premium silicone case for iPhone 13 Pro",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    subcategoryId: "1",
    categoryId: "1",
    featured: true,
    discounts: [
      { quantity: 10, percentage: 5 },
      { quantity: 50, percentage: 15 },
      { quantity: 100, percentage: 25 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Samsung S22 Case",
    description: "Durable case for Samsung S22",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    subcategoryId: "2",
    categoryId: "1",
    featured: true,
    discounts: [
      { quantity: 10, percentage: 5 },
      { quantity: 50, percentage: 15 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// API service
export const api = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    // In a real app, this would be an API call
    // const response = await apiClient.get("/categories");
    // return response.data;
    
    return mockCategories;
  },
  
  getCategoryById: async (id: string): Promise<Category | null> => {
    // const response = await apiClient.get(`/categories/${id}`);
    // return response.data;
    
    return mockCategories.find(cat => cat.id === id) || null;
  },
  
  createCategory: async (category: Omit<Category, "id">): Promise<Category> => {
    // const response = await apiClient.post("/categories", category);
    // return response.data;
    
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return newCategory;
  },
  
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    // const response = await apiClient.put(`/categories/${id}`, category);
    // return response.data;
    
    const index = mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      mockCategories[index] = {
        ...mockCategories[index],
        ...category,
        updatedAt: new Date().toISOString(),
      };
      return mockCategories[index];
    }
    throw new Error("Category not found");
  },
  
  deleteCategory: async (id: string): Promise<void> => {
    // await apiClient.delete(`/categories/${id}`);
    
    const index = mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      mockCategories.splice(index, 1);
    }
  },
  
  // Subcategories
  getSubcategories: async (categoryId?: string): Promise<Subcategory[]> => {
    // const response = await apiClient.get("/subcategories", { params: { categoryId } });
    // return response.data;
    
    if (categoryId) {
      return mockSubcategories.filter(sub => sub.categoryId === categoryId);
    }
    return mockSubcategories;
  },
  
  createSubcategory: async (subcategory: Omit<Subcategory, "id">): Promise<Subcategory> => {
    // const response = await apiClient.post("/subcategories", subcategory);
    // return response.data;
    
    const newSubcategory: Subcategory = {
      ...subcategory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSubcategories.push(newSubcategory);
    return newSubcategory;
  },
  
  // Products
  getProducts: async (subcategoryId?: string): Promise<Product[]> => {
    // const response = await apiClient.get("/products", { params: { subcategoryId } });
    // return response.data;
    
    if (subcategoryId) {
      return mockProducts.filter(product => product.subcategoryId === subcategoryId);
    }
    return mockProducts;
  },
  
  getProductById: async (id: string): Promise<Product | null> => {
    // const response = await apiClient.get(`/products/${id}`);
    // return response.data;
    
    return mockProducts.find(product => product.id === id) || null;
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    // const response = await apiClient.get("/products/featured");
    // return response.data;
    
    return mockProducts.filter(product => product.featured);
  },
  
  // Orders
  createOrder: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    // const response = await apiClient.post("/orders", order);
    // return response.data;
    
    return {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  // Users (for admin)
  getUsers: async (): Promise<User[]> => {
    // const response = await apiClient.get("/users");
    // return response.data;
    
    return [
      {
        id: "1",
        name: "Admin User",
        email: "admin@admin.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Test User",
        email: "user@example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },
};