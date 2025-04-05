export type Schema = {
  photos: {
    id?: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    dateAdded: string;
  };
  
  users: {
    id?: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    image?: string | null;
  };
  
  categories: {
    id?: string;
    name: string;
    image: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
  
  subcategories: {
    id?: string;
    name: string;
    categoryId: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  
  products: {
    id?: string;
    name: string;
    description: string;
    price: number;
    image: string;
    subcategoryId: string;
    categoryId: string;
    featured?: boolean;
    discounts?: {
      quantity: number;
      percentage: number;
    }[];
    createdAt: string;
    updatedAt: string;
  };
  
  orders: {
    id?: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  
  notifications: {
    id?: string;
    userId: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Export types for use in the application
export type User = Schema["users"];
export type Category = Schema["categories"];
export type Subcategory = Schema["subcategories"];
export type Product = Schema["products"];
export type Order = Schema["orders"];
export type Notification = Schema["notifications"];
export type Photo = Schema["photos"];