import { Category, Product, Order, User, Subcategory, OrderItem, Discount } from './db/models';

export type Schema = {
  categories: Category;
  products: Product;
  orders: Order;
  users: User;
  subcategories: Subcategory;
  orderItems: OrderItem;
  discounts: Discount;
}