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
    role?: string;
    phone?: string;
  };
};

// Export types for use in the application
export type User = Schema["users"];
export type Photo = Schema["photos"];

// Define these types to fix build errors
export type Category = {
  id: string;
  name: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
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
  costPrice: number;
  stock: number;
};

export type Order = {
  id: string;
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

export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type Discount = {
  quantity: number;
  percentage: number;
};

export type Notification = {
  id?: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};