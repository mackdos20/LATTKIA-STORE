import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { TooltipProvider } from "./components/ui/tooltip";
import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import Logout from "./pages/logout";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          {/* Add any other routes you need here */}
        </Routes>
      </BrowserRouter>
      <Sonner />
      <Toaster />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);