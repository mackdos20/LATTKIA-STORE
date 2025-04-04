// نماذج البيانات للمتجر

export type Category = {
  id: string;
  name: string;
  description?: string;
  image: string;
  slug: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number; // سعر الشراء (يظهر فقط للمدير)
  image: string;
  images?: string[];
  categoryId: string;
  subcategoryId?: string;
  stock: number;
  minStock?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  featured: boolean;
  discounts?: {
    quantity: number;
    percentage: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  total: number;
};

export type Address = {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discounts?: {
    quantity: number;
    percentage: number;
  }[];
};