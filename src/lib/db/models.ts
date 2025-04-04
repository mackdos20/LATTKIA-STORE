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

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type LoginLog = {
  id: number;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason: string | null;
};