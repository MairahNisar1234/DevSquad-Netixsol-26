"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Upload, Plus, Trash2, Info, Loader2, AlertCircle } from 'lucide-react';

const CATEGORY_RESTRICTIONS: Record<string, string[]> = {
  'Dessert': ['Meat', 'Protein', 'Seafood'],
  'Soup': ['Bakery'],
  'Hot Dishes': ['Sweeteners'],
  'Appetizers': [], 
};

export default function DishModal({ isOpen, onClose, onRefresh, editData = null }: any) {
  const isEditMode = !!editData;

  const [materials, setMaterials] = useState([]);
  const [recipe, setRecipe] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Hot Dishes'
  });

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3000/api/materials')
        .then(res => setMaterials(res.data))
        .catch(err => console.error("❌ Error fetching materials:", err));

      if (editData) {
        setFormData({
          name: editData.name || '',
          price: editData.price?.toString() || '',
          category: editData.category || 'Hot Dishes'
        });
        setRecipe(editData.recipe || []);
        setPreviewUrl(editData.imageUrl || null);
        setFile(null);
      } else {
        resetForm();
      }
    }
  }, [editData, isOpen]);

  const getFilteredMaterials = () => {
    const forbidden = CATEGORY_RESTRICTIONS[formData.category] || [];
    return materials.filter((m: any) => !forbidden.includes(m.category));
  };

  const addIngredient = () => {
    setRecipe([...recipe, { materialId: '', quantityNeeded: 1, isOptional: false }]);
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...recipe];
    updated[index][field] = value;
    setRecipe(updated);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !file) return setError("Please upload a dish image.");
    if (recipe.length === 0) return setError("Please add at least one ingredient.");
    const invalidQuantity = recipe.some(ing => Number(ing.quantityNeeded) <= 0);
    if (invalidQuantity) return setError("Ingredient quantities must be greater than zero.");
    const materialIds = recipe.map(ing => typeof ing.materialId === 'object' ? ing.materialId?._id : ing.materialId);
    const hasDuplicates = new Set(materialIds).size !== materialIds.length;
    if (hasDuplicates) return setError("You cannot add the same ingredient twice.");
    if (Number(formData.price) <= 0) return setError("Price must be a positive number.");

    setLoading(true);
    setError(null);

    try {
      let finalImageUrl = previewUrl;
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        const uploadRes = await axios.post('http://localhost:3000/api/media/upload', imageFormData);
        finalImageUrl = uploadRes.data?.secure_url || uploadRes.data?.imageUrl;
      }

      const finalPayload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: finalImageUrl, 
        recipe: recipe.map(ing => ({
          materialId: typeof ing.materialId === 'object' ? ing.materialId._id : ing.materialId,
          quantityNeeded: parseFloat(ing.quantityNeeded),
          isOptional: ing.isOptional
        }))
      };

      if (isEditMode) {
        await axios.patch(`http://localhost:3000/api/products/${editData._id}`, finalPayload);
      } else {
        await axios.post('http://localhost:3000/api/products', finalPayload);
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save dish.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRecipe([]);
    setFile(null);
    setPreviewUrl(null);
    setFormData({ name: '', price: '', category: 'Hot Dishes' });
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#1F1D2B] w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-gray-800 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center bg-[#1F1D2B] sticky top-0 z-10">
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isEditMode ? 'Edit Dish' : 'Add New Dish'}
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">
              Category: {formData.category}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X size={22}/>
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 text-left flex-1">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-500 text-xs sm:text-sm">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          {/* Responsive Image Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-32 sm:h-44 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#EA7C69] transition-all overflow-hidden bg-[#1F1D2B]"
          >
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-center p-4">
                <Upload className="mx-auto text-[#EA7C69] mb-2" size={24} />
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Upload Dish Image</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setFile(file); setPreviewUrl(URL.createObjectURL(file)); }
            }} className="hidden" accept="image/*" />
          </div>

          {/* Name and Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] text-gray-500 ml-2 font-bold">DISH NAME</label>
              <input 
                required placeholder="e.g. Spicy Ramen" 
                value={formData.name}
                className="w-full bg-[#2D303E] border border-gray-700 p-3 rounded-xl outline-none focus:border-[#EA7C69] text-white text-sm"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-500 ml-2 font-bold">CATEGORY</label>
              <div className="relative">
                <select 
                  className="w-full bg-[#2D303E] border border-gray-700 p-3 rounded-xl outline-none focus:border-[#EA7C69] text-white text-sm appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Hot Dishes">Hot Dishes</option>
                  <option value="Cold Dishes">Cold Dishes</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Soup">Soup</option>
                  <option value="Grill">Grill</option>
                  <option value="Dessert">Dessert</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <Plus size={14} className="rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-500 ml-2 font-bold">PRICE ($)</label>
            <input 
              required type="number" min="0.01" step="0.01" placeholder="0.00"
              value={formData.price}
              className="w-full bg-[#2D303E] border border-gray-700 p-3 rounded-xl outline-none focus:border-[#EA7C69] text-white text-sm"
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          {/* Recipe Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                <Info size={14} className="text-[#EA7C69]" /> Recipe Composition
              </h3>
              <button 
                type="button" onClick={addIngredient}
                className="text-[10px] bg-[#EA7C69]/10 text-[#EA7C69] border border-[#EA7C69]/20 px-3 py-1.5 rounded-lg font-bold hover:bg-[#EA7C69] hover:text-white transition-all active:scale-95"
              >
                + ADD
              </button>
            </div>

            <div className="space-y-3">
              {recipe.map((ing, index) => {
                const matId = typeof ing.materialId === 'object' ? ing.materialId?._id : ing.materialId;
                const selectedMat = materials.find((m: any) => m._id === matId) as any;
                
                return (
                  <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#2D303E] p-3 rounded-2xl border border-gray-700">
                    <select 
                      required
                      className="flex-1 bg-transparent border-b sm:border-none border-gray-700 pb-2 sm:pb-0 outline-none text-sm text-white min-w-0"
                      value={matId}
                      onChange={(e) => updateIngredient(index, 'materialId', e.target.value)}
                    >
                      <option value="" className="bg-[#1F1D2B]">Select Ingredient</option>
                      {getFilteredMaterials().map((m: any) => (
                        <option key={m._id} value={m._id} className="bg-[#1F1D2B]">{m.name}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-[#1F1D2B] px-3 py-2 rounded-xl border border-gray-700 flex-1 sm:flex-none">
                        <input 
                          required type="number" min="0.1" step="0.1"
                          value={ing.quantityNeeded}
                          className="w-12 bg-transparent outline-none text-white text-sm text-center"
                          onChange={(e) => updateIngredient(index, 'quantityNeeded', e.target.value)}
                        />
                        <span className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[40px]">{selectedMat?.unit || 'qty'}</span>
                      </div>

                      <button 
                        type="button"
                        onClick={() => updateIngredient(index, 'isOptional', !ing.isOptional)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border shrink-0 ${
                          ing.isOptional 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-[#EA7C69]/10 text-[#EA7C69] border-[#EA7C69]/20'
                        }`}
                      >
                        {ing.isOptional ? 'OPTIONAL' : 'REQUIRED'}
                      </button>

                      <button type="button" onClick={() => setRecipe(recipe.filter((_, i) => i !== index))} className="text-gray-500 hover:text-red-500 p-2 shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Action Footer - Sticky at bottom */}
        <div className="p-4 sm:p-6 bg-[#1F1D2B] border-t border-gray-800 flex flex-col sm:flex-row gap-3">
          <button 
            type="button" onClick={onClose}
            className="order-2 sm:order-1 flex-1 py-3.5 text-white font-bold border border-gray-700 rounded-xl hover:bg-white/5 text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
            className="order-1 sm:order-2 flex-[2] bg-[#EA7C69] py-3.5 text-white rounded-xl font-bold shadow-lg shadow-[#EA7C69]/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : isEditMode ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}