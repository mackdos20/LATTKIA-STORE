import { fine } from "@/lib/fine";
import type { Category, Order, Product, Subcategory, User } from "./db-types";

// Define AuthState interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Create a mock auth state for development
const authState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

// API functions
export const api = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await fine.table("categories").select();
      return categories as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      const categories = await fine.table("categories").select().eq("id", id);
      return categories[0] as Category || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  },
  
  createCategory: async (category: Omit<Category, "id">): Promise<Category | null> => {
    try {
      const newCategories = await fine.table("categories").insert(category).select();
      return newCategories[0] as Category || null;
    } catch (error) {
      console.error("Error creating category:", error);
      return null;
    }
  },
  
  // Subcategories
  getSubcategoriesByCategoryId: async (categoryId: string): Promise<Subcategory[]> => {
    try {
      const subcategories = await fine.table("subcategories").select().eq("categoryId", categoryId);
      return subcategories as Subcategory[];
    } catch (error) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      return [];
    }
  },
  
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const products = await fine.table("products").select();
      // Add default values for costPrice and stock
      return products.map(product => ({
        ...product,
        costPrice: product.costPrice || 0,
        stock: product.stock || 0
      })) as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
  
  createProduct: async (product: Omit<Product, "id">): Promise<Product | null> => {
    try {
      // Ensure costPrice and stock are included
      const productWithDefaults = {
        ...product,
        costPrice: product.costPrice || 0,
        stock: product.stock || 0
      };
      
      const newProducts = await fine.table("products").insert(productWithDefaults).select();
      return newProducts[0] as Product || null;
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  },
  
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
      const updatedProducts = await fine.table("products").update(product).eq("id", id).select();
      return updatedProducts[0] as Product || null;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return null;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await fine.table("products").delete().eq("id", id);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  },
  
  // Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const orders = await fine.table("orders").select();
      return orders as Order[];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },
  
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const orders = await fine.table("orders").select().eq("id", id);
      return orders[0] as Order || null;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return null;
    }
  },
  
  updateOrderStatus: async (id: string, status: string): Promise<Order | null> => {
    try {
      const updatedOrders = await fine.table("orders").update({ status }).eq("id", id).select();
      return updatedOrders[0] as Order || null;
    } catch (error) {
      console.error(`Error updating order status ${id}:`, error);
      return null;
    }
  },
  
  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const users = await fine.table("users").select();
      return users as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
  
  // Telegram notifications
  sendTelegramNotification: async (message: string): Promise<{ success: boolean; error?: any }> => {
    try {
      // This would be implemented with a server-side function
      console.log("Sending telegram notification:", message);
      return { success: true };
    } catch (error) {
      console.error("Error sending telegram notification:", error);
      return { success: false, error };
    }
  }
};

// Export auth state for development
export const useAuth = (): AuthState => {
  return authState;
};