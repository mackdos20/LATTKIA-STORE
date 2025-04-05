import { fine } from "@/lib/fine";
import type { Category, Order, Product, Subcategory, User, Discount, OrderItem } from "./db-types";

export const api = {
  // Categories
  getCategories: async () => {
    return await fine.table("categories").select();
  },
  
  getCategoryById: async (id: string) => {
    const categories = await fine.table("categories").select().eq("id", id);
    return categories[0];
  },
  
  createCategory: async (category: Omit<Category, "id">) => {
    return await fine.table("categories").insert(category).select();
  },
  
  updateCategory: async (id: string, category: Partial<Category>) => {
    return await fine.table("categories").update(category).eq("id", id).select();
  },
  
  deleteCategory: async (id: string) => {
    return await fine.table("categories").delete().eq("id", id);
  },
  
  // Subcategories
  getSubcategories: async () => {
    return await fine.table("subcategories").select();
  },
  
  getSubcategoriesByCategoryId: async (categoryId: string) => {
    return await fine.table("subcategories").select().eq("categoryId", categoryId);
  },
  
  createSubcategory: async (subcategory: Omit<Subcategory, "id">) => {
    return await fine.table("subcategories").insert(subcategory).select();
  },
  
  // Products
  getProducts: async () => {
    return await fine.table("products").select();
  },
  
  getProductById: async (id: string) => {
    const products = await fine.table("products").select().eq("id", id);
    return products[0];
  },
  
  createProduct: async (product: Omit<Product, "id">) => {
    return await fine.table("products").insert(product).select();
  },
  
  updateProduct: async (id: string, product: Partial<Product>) => {
    return await fine.table("products").update(product).eq("id", id).select();
  },
  
  deleteProduct: async (id: string) => {
    return await fine.table("products").delete().eq("id", id);
  },
  
  // Orders
  getOrders: async () => {
    return await fine.table("orders").select();
  },
  
  getOrderById: async (id: string) => {
    const orders = await fine.table("orders").select().eq("id", id);
    return orders[0];
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    return await fine.table("orders").update({ status }).eq("id", id).select();
  },
  
  // Users
  getUsers: async () => {
    return await fine.table("users").select();
  },
  
  // Telegram notifications
  sendTelegramNotification: async (message: string) => {
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