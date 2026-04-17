'use client';

import { useParams } from 'next/navigation';
import ProductDetailView from '@/src/components/products/productDetailView';

export default function UpdateProductPage() {
  const params = useParams();

  // safely handle string | string[] | undefined
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse font-black text-slate-300 tracking-widest">
          PREPARING DETAILS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-6xl mx-auto">
        {/* pass id if your component needs it */}
        <ProductDetailView  />
      </div>
    </div>
  );
}