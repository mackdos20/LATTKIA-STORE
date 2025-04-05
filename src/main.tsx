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
import PhotoPage from "./pages/photo/[id]";

// Export API service for global use
import { apiService } from "./lib/api-service";
window.apiService = apiService;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/photo/:id" element={<PhotoPage />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
        <SpeedInsights />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);