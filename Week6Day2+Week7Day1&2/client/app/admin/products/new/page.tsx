'use client';

import ProductForm from "@/src/components/products/productForm";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-6xl mx-auto">
        <ProductForm />
      </div>
    </div>
  );
}