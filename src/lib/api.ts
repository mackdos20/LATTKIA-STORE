// Mock API service

export type Category = {
  id: string;
  name: string;
  image: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  subcategoryId?: string;
  stock: number;
  discounts?: {
    quantity: number;
    percentage: number;
  }[];
  featured?: boolean;
};

// Mock data
const categories: Category[] = [
  {
    id: "1",
    name: "كفرات حماية",
    image: "https://images.unsplash.com/photo-1606293459339-aa5a4f0c8d4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "كفرات حماية لجميع أنواع الهواتف"
  },
  {
    id: "2",
    name: "شواحن وكابلات",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "شواحن وكابلات لجميع أنواع الهواتف"
  },
  {
    id: "3",
    name: "سماعات",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "سماعات لجميع أنواع الهواتف"
  }
];

const products: Product[] = [
  {
    id: "1",
    name: "كفر حماية آيفون 13",
    description: "كفر حماية مقاوم للصدمات لآيفون 13",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1606293459339-aa5a4f0c8d4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    categoryId: "1",
    stock: 100,
    discounts: [
      { quantity: 10, percentage: 10 },
      { quantity: 50, percentage: 20 }
    ],
    featured: true
  },
  {
    id: "2",
    name: "شاحن سامسونج سريع",
    description: "شاحن سامسونج سريع 25 واط",
    price: 25.99,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    categoryId: "2",
    stock: 50,
    discounts: [
      { quantity: 10, percentage: 15 },
      { quantity: 50, percentage: 25 }
    ],
    featured: true
  },
  {
    id: "3",
    name: "سماعات بلوتوث",
    description: "سماعات بلوتوث لاسلكية",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    categoryId: "3",
    stock: 30,
    discounts: [
      { quantity: 5, percentage: 10 },
      { quantity: 20, percentage: 20 }
    ],
    featured: true
  },
  {
    id: "4",
    name: "كفر حماية سامسونج S21",
    description: "كفر حماية مقاوم للصدمات لسامسونج S21",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1606293459339-aa5a4f0c8d4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    categoryId: "1",
    stock: 80,
    discounts: [
      { quantity: 10, percentage: 10 },
      { quantity: 50, percentage: 20 }
    ],
    featured: true
  }
];

// API methods
export const api = {
  getCategories: async (): Promise<Category[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return categories;
  },
  
  getCategory: async (id: string): Promise<Category | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return categories.find(category => category.id === id);
  },
  
  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products;
  },
  
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.filter(product => product.categoryId === categoryId);
  },
  
  getProduct: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.find(product => product.id === id);
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.filter(product => product.featured);
  },
  
  login: async (email: string, password: string): Promise<{ user: any, token: string } | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll accept a specific email/password
    if (email === "admin@example.com" && password === "password") {
      return {
        user: {
          id: "user123",
          name: "مستخدم تجريبي",
          email: email,
          role: "admin"
        },
        token: "mock-token-123456"
      };
    }
    
    return null;
  }
};

// Export types for use in other files
export type { Category, Product };