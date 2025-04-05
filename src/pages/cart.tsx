import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/api";

export default function Cart() {
  const auth = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {auth.isAuthenticated ? (
          <p>Your cart items will appear here.</p>
        ) : (
          <p>Please log in to view your cart.</p>
        )}
      </div>
    </MainLayout>
  );
}