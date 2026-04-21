"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Settings2, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import AddDishModal from './AddDishModal';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizers', 'Dessert'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/products/available?t=${Date.now()}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProducts((prev) => prev.filter((p: any) => p._id !== id)); 
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p: any) => {
    if (!p.category) return false;
    return p.category.toString().trim().toLowerCase() === activeCategory.trim().toLowerCase();
  });

  return (
    <div className="flex-1 bg-[#1F1D2B] rounded-2xl flex flex-col overflow-hidden border border-gray-800 h-full">
      {/* Responsive Header */}
      <div className="p-4 sm:p-6 flex justify-between items-center gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-white truncate">Products Management</h2>
        <button className="flex items-center gap-2 border border-gray-700 px-3 py-2 sm:px-4 rounded-lg text-white text-sm hover:bg-white/5 transition-colors shrink-0">
          <Settings2 size={16} />
          <span className="hidden xs:inline">Manage Categories</span>
        </button>
      </div>

      {/* Tabs - Mobile scrollable */}
      <div className="px-4 sm:px-6 flex gap-6 sm:gap-8 border-b border-gray-800 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeCategory === cat ? 'text-[#EA7C69]' : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat}
            {activeCategory === cat && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EA7C69] shadow-[0_0_10px_#EA7C69]" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#EA7C69]" size={40} />
          </div>
        ) : (
          /* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-16 pt-12 pb-10">
            
            {/* Add New Button Card */}
            <button 
              onClick={handleAddNew}
              className="border-2 border-dashed border-[#EA7C69]/40 rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 text-[#EA7C69] hover:bg-[#EA7C69]/5 hover:border-[#EA7C69] transition-all group min-h-[220px] order-first"
            >
              <div className="p-4 rounded-full bg-[#EA7C69]/10 group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <span className="mt-4 font-bold text-xs sm:text-sm uppercase tracking-wider">Add new dish</span>
            </button>

            {filteredProducts.map((product: any) => (
              <ProductCard 
                key={product._id}
                _id={product._id}
                name={product.name} 
                price={product.price} 
                available={product.available ?? 0} 
                imageUrl={product.imageUrl} 
                productData={product}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center">
            <p className="text-base sm:text-lg">No dishes found in {activeCategory}</p>
            <p className="text-xs sm:text-sm italic px-4">Check if the category name in your database matches exactly.</p>
          </div>
        )}
      </div>

      <AddDishModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProducts}
        editData={editingProduct} 
      />
    </div>
  );
}