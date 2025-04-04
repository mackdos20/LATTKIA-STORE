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
  costPrice: number;
  stock: number;
  subcategoryId: string;
  image: string;
  discounts: Discount[];
  createdAt: string;
  updatedAt: string;
};

export type Discount = {
  id: string;
  productId: string;
  minQuantity: number;
  discountPercentage: number;
};

export type Order = {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  expectedDeliveryTime?: string;
  items: OrderItem[];
  total: number;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  telegramId?: string;
};