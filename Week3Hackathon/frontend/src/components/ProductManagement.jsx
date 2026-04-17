import React from 'react';
// 1. Import your custom api instance
import api from "../services/api.js";

const ProductManagement = ({ products, onUpdate }) => {
  
  const deleteProduct = async (id) => {
    // 2. Consistent confirmation dialog
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        // 3. Use the 'api' instance (URL becomes https://.../api/products/:id)
        // Token is automatically added by the interceptor in api.js
        await api.delete(`/products/${id}`);
        
        alert("Product deleted successfully.");
        onUpdate(); // Refresh the list in the parent component
      } catch (err) {
        console.error("Delete Error:", err.response?.data || err.message);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl uppercase tracking-tight text-gray-800">Manage Products</h2>
        <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">
          {products.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-gray-400">
              <th className="p-3 font-bold">Product Name</th>
              <th className="p-3 font-bold">Category</th>
              <th className="p-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <td className="p-3">
                  <span className="font-semibold text-gray-700">{p.name}</span>
                </td>
                <td className="p-3">
                  <span className="text-xs text-gray-500 uppercase">{p.category}</span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-4">
                    <button 
                      className="text-[11px] font-black uppercase tracking-tighter text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteProduct(p._id)} 
                      className="text-[11px] font-black uppercase tracking-tighter text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-400 text-sm italic">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;