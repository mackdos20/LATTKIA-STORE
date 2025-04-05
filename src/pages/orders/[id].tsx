import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Order #{id}</h1>
        <p>This page is under construction.</p>
      </div>
    </MainLayout>
  );
}