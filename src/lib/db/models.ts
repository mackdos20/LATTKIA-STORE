export type Category = {
  id: string;
  name: string;
  image: string;
  slug?: string;
};

export type Subcategory = {
  id: string;
  name: string;
  image: string;
  categoryId: string;
  slug?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  subcategoryId?: string;
  featured: boolean;
  stock?: number;
  discounts?: {
    id?: string;
    quantity: number;
    discount: number;
    minQuantity?: number;
    discountPercentage?: number;
  }[];
};

export type OrderItem = {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  product?: string;
};

export type Discount = {
  id?: string;
  quantity: number;
  discount: number;
  minQuantity?: number;
  discountPercentage?: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'approved' | 'shipping';
  createdAt: string;
  updatedAt: string;
  expectedDeliveryTime?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'customer';
  phone?: string;
};