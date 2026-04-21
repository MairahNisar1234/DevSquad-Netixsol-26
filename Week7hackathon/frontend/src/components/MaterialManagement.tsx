"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Package, Database, AlertTriangle, RefreshCw, X, TrendingDown } from 'lucide-react';

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newMaterial, setNewMaterial] = useState({ 
    name: '', 
    quantity: '', 
    unit: 'grams', 
    minStockLevel: '10' 
  });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error("Error fetching materials", err);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/materials', {
        name: newMaterial.name,
        stockQuantity: parseFloat(newMaterial.quantity) || 0,
        unit: newMaterial.unit,
        minStockLevel: parseFloat(newMaterial.minStockLevel) || 0
      });
      setShowForm(false);
      setNewMaterial({ name: '', quantity: '', unit: 'grams', minStockLevel: '10' });
      fetchMaterials();
    } catch (err) {
      alert("Failed to save material");
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (id: string) => {
    const amount = prompt("Enter quantity to add:");
    if (!amount || isNaN(parseFloat(amount))) return;

    try {
      await axios.patch(`http://localhost:3000/api/materials/${id}/restock`, {
        amount: parseFloat(amount)
      });
      fetchMaterials();
    } catch (err) {
      alert("Restock failed. Ensure the backend route /api/materials/:id/restock exists.");
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const lowStockCount = materials.filter((m: any) => m.stockQuantity <= m.minStockLevel).length;

  return (
    // Added responsive padding and height management
    <div className="flex-1 bg-bgCard rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-800 shadow-xl overflow-y-auto custom-scrollbar h-full">
      
      {/* Header Section - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 text-left">
            <Package className="text-primary shrink-0" /> Inventory / Materials
          </h2>
          <p className="text-textGray text-xs sm:text-sm mt-1 text-left">Manage your raw ingredients and stock levels</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-primary hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {/* Summary Widgets - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-bgDark p-4 sm:p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl text-primary">
            <Database size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-left">
            <p className="text-textGray text-[10px] sm:text-xs uppercase font-bold tracking-widest">Total Materials</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{materials.length}</p>
          </div>
        </div>
        
        <div className={`p-4 sm:p-6 rounded-2xl border flex items-center gap-4 transition-all ${
          lowStockCount > 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-bgDark border-gray-800'
        }`}>
          <div className={`p-3 sm:p-4 rounded-2xl ${lowStockCount > 0 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-800 text-textGray'}`}>
            <TrendingDown size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div className="text-left">
            <p className="text-textGray text-[10px] sm:text-xs uppercase font-bold tracking-widest">Low Stock Alerts</p>
            <p className={`text-xl sm:text-2xl font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-white'}`}>{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Materials List - Card-style responsiveness */}
      <div className="grid grid-cols-1 gap-4">
        {materials.map((m: any) => {
          const isLowStock = m.stockQuantity <= m.minStockLevel;

          return (
            <div key={m._id} className={`bg-bgDark p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group ${
              isLowStock ? 'border-red-500/30 bg-red-500/5' : 'border-gray-700 hover:border-primary/50'
            }`}>
              <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                <div className={`p-3 rounded-xl shrink-0 ${isLowStock ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary'}`}>
                  {isLowStock ? <AlertTriangle size={20} /> : <Database size={20} />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-base sm:text-lg text-white truncate">{m.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className={`text-xs sm:text-sm font-medium ${isLowStock ? 'text-red-400' : 'text-textGray'}`}>
                      Stock: <span className="text-white">{m.stockQuantity ?? 0}</span> {m.unit}
                    </p>
                    <p className="text-textGray text-xs sm:text-sm">
                      Min: <span className="text-white">{m.minStockLevel ?? 10}</span>
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleRestock(m._id)}
                className={`w-full sm:w-auto p-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  isLowStock 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' 
                  : 'bg-white/5 text-textGray hover:text-primary hover:bg-primary/10'
                }`}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Restock</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Material Modal - Full Screen Mobile Friendly */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <form 
            onSubmit={handleAddMaterial} 
            className="bg-bgCard p-6 sm:p-8 rounded-3xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar space-y-5 shadow-2xl"
          >
            <div className="flex justify-between items-center sticky top-0 bg-bgCard pb-2 z-10">
              <h3 className="text-xl font-bold text-white text-left">New Material</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-textGray hover:text-white p-1">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] text-textGray font-bold uppercase ml-1">Ingredient Name</label>
                <input 
                  required
                  placeholder="e.g. Cheese, Flour" 
                  className="w-full bg-bgDark p-3 sm:p-4 rounded-xl border border-gray-700 text-white outline-none focus:border-primary text-sm"
                  onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-textGray font-bold uppercase ml-1">Initial Stock</label>
                  <input 
                    required
                    type="number" 
                    placeholder="0" 
                    className="w-full bg-bgDark p-3 sm:p-4 rounded-xl border border-gray-700 text-white outline-none focus:border-primary text-sm"
                    onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-textGray font-bold uppercase ml-1">Unit</label>
                  <select 
                    className="w-full bg-bgDark p-3 sm:p-4 rounded-xl border border-gray-700 text-white outline-none focus:border-primary text-sm h-[46px] sm:h-[58px]"
                    onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})}
                  >
                    <option value="grams">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-textGray font-bold uppercase ml-1">Min Stock Level Alert</label>
                <input 
                  type="number" 
                  placeholder="Alert at (e.g. 10)" 
                  className="w-full bg-bgDark p-3 sm:p-4 rounded-xl border border-gray-700 text-white outline-none focus:border-primary text-sm"
                  value={newMaterial.minStockLevel}
                  onChange={e => setNewMaterial({...newMaterial, minStockLevel: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="order-2 sm:order-1 flex-1 border border-gray-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="order-1 sm:order-2 flex-1 bg-primary text-white py-3 sm:py-4 rounded-xl font-bold shadow-primary disabled:opacity-50 transition-all text-sm"
              >
                {loading ? 'Saving...' : 'Save Material'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}