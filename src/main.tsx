import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import Logout from "./pages/logout";
import Categories from "./pages/categories";
import CategoryPage from "./pages/category";
import SubcategoryPage from "./pages/subcategory";
import ProductPage from "./pages/product";
import CartPage from "./pages/cart";
import OrdersPage from "./pages/orders";
import OrderDetailsPage from "./pages/orders/[id]";

// Admin Pages
import AdminDashboard from "./pages/admin";
import AdminUsers from "./pages/admin/users";
import AdminProducts from "./pages/admin/products";
import AdminCategories from "./pages/admin/categories";
import AdminOrders from "./pages/admin/orders";
import AdminNotifications from "./pages/admin/notifications";
import AdminSettings from "./pages/admin/settings";
import AdminMarquee from "./pages/admin/marquee";
import ProfitDashboard from "./pages/admin/profit-dashboard";
import TelegramBot from "./pages/admin/telegram-bot";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId" element={<CategoryPage />} />
            <Route path="/subcategories/:subcategoryId" element={<SubcategoryPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/marquee" element={<AdminMarquee />} />
            <Route path="/admin/profit" element={<ProfitDashboard />} />
            <Route path="/admin/telegram" element={<TelegramBot />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
        <SpeedInsights />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);