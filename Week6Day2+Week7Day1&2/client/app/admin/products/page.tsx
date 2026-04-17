'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { useSocket } from '@/src/context/socketContext'; 
import { toast } from 'react-hot-toast';


const API_BASE_URL = 'http://localhost:3000/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const { socket } = useSocket();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Using live backend URL
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (!socket) return;

    socket.on('productCreated', (newProduct: any) => {
      setProducts((prev) => [newProduct, ...prev]);
    });

    socket.on('productUpdated', (updatedProduct: any) => {
      setProducts((prev) => 
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    });

    socket.on('productDeleted', (productId: string) => {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    });

    return () => {
      socket.off('productCreated');
      socket.off('productUpdated');
      socket.off('productDeleted');
    };
  }, [socket]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      // Using live backend URL for DELETE
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        socket?.emit('adminDeleteProduct', id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success('Product removed');
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F3F2EE] min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">All Products</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Inventory Management</p>
        </div>
        
        <button 
          onClick={() => router.push('/admin/products/new')}
          className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin text-black" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const stockPercentage = Math.min((product.stock / 200) * 100, 100);

            return (
              <div key={product._id} className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
                
                {/* Image Section */}
                <div className="relative w-full aspect-[4/3] bg-[#F5F5F5] rounded-2xl overflow-hidden mb-4 group">
                  {product.images?.[0] ? (
                    <img 
                      src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-xs italic">No Image</div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => router.push(`/admin/products/${product._id}`)} className="p-2 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl text-black hover:bg-black hover:text-white transition-all">
                       <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 bg-white/90 backdrop-blur-sm shadow-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                    {product.category || 'Collection'}
                  </p>
                  <h3 className="font-black text-gray-900 text-base uppercase tracking-tighter leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xl font-black text-black">₹{product.regularPrice.toLocaleString()}</p>
                </div>

                {/* Summary */}
                <div className="mb-6 flex-grow">
                  <h4 className="text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] mb-2 opacity-50">Overview</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 font-medium italic">
                    {product.description || "Premium quality garment from our latest drop."}
                  </p>
                </div>

                {/* Stock Level */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center text-[10px] font-black mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Inventory</span>
                    <span className={product.stock < 10 ? 'text-red-500' : 'text-black'}>{product.stock} Units</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        product.stock < 10 ? 'bg-red-500' : 'bg-black'
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}