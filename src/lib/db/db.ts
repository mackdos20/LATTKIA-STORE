import { Category, Subcategory, Product, Order, OrderItem, Discount } from './models';
import { categories, subcategories, products, orders } from './mock-data';

export const db = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    return categories;
  },
  getCategoryById: async (id: string): Promise<Category> => {
    const category = categories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
    };
    categories.push(newCategory);
    return newCategory;
  },
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories[index] = { ...categories[index], ...category };
    return categories[index];
  },
  deleteCategory: async (id: string): Promise<void> => {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    categories.splice(index, 1);
  },

  // Subcategories
  getSubcategories: async (): Promise<Subcategory[]> => {
    return subcategories;
  },
  getSubcategoryById: async (id: string): Promise<Subcategory> => {
    const subcategory = subcategories.find((s) => s.id === id);
    if (!subcategory) throw new Error('Subcategory not found');
    return subcategory;
  },
  getSubcategoriesByCategoryId: async (categoryId: string): Promise<Subcategory[]> => {
    return subcategories.filter((s) => s.categoryId === categoryId);
  },
  createSubcategory: async (subcategory: Omit<Subcategory, 'id'>): Promise<Subcategory> => {
    const newSubcategory = {
      ...subcategory,
      id: Math.random().toString(36).substr(2, 9),
    };
    subcategories.push(newSubcategory);
    return newSubcategory;
  },
  updateSubcategory: async (id: string, subcategory: Partial<Subcategory>): Promise<Subcategory> => {
    const index = subcategories.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subcategory not found');
    subcategories[index] = { ...subcategories[index], ...subcategory };
    return subcategories[index];
  },
  deleteSubcategory: async (id: string): Promise<void> => {
    const index = subcategories.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subcategory not found');
    subcategories.splice(index, 1);
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return products;
  },
  getProductById: async (id: string): Promise<Product> => {
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const subcategoryIds = subcategories
      .filter((s) => s.categoryId === categoryId)
      .map((s) => s.id);
    return products.filter((p) => subcategoryIds.includes(p.subcategoryId));
  },
  getProductsBySubcategoryId: async (subcategoryId: string): Promise<Product[]> => {
    return products.filter((p) => p.subcategoryId === subcategoryId);
  },
  getFeaturedProducts: async (): Promise<Product[]> => {
    return products.slice(0, 4);
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    products.push(newProduct);
    return newProduct;
  },
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...product };
    return products[index];
  },
  deleteProduct: async (id: string): Promise<void> => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products.splice(index, 1);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    return orders;
  },
  getOrderById: async (id: string): Promise<Order> => {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },
  createOrder: async (order: Omit<Order, 'id'>): Promise<Order> => {
    const newOrder = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
    };
    orders.push(newOrder);
    return newOrder;
  },
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = { ...orders[index], status };
    return orders[index];
  },

  // Users
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    users.push(newUser);
    return newUser;
  },

  // Telegram
  sendTelegramNotification: async (message: string): Promise<void> => {
    console.log('Sending telegram notification:', message);
  },
}; 