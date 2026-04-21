"use client";
import React, { useState, useEffect } from 'react';
import { X, Check, Info, MessageSquare, Utensils, Package, Truck } from 'lucide-react';

interface CustomizationModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customizedData: any) => void;
}

export default function CustomizationModal({ product, isOpen, onClose, onConfirm }: CustomizationModalProps) {
  const [selections, setSelections] = useState<{ [key: string]: boolean }>({});
  const [orderNote, setOrderNote] = useState("");
  const [orderType, setOrderType] = useState("Dine In");

  useEffect(() => {
    if (product?.recipe) {
      const initial: { [key: string]: boolean } = {};
      product.recipe.forEach((ing: any) => {
        if (ing.isOptional) {
          const name = ing.materialId?.name || "Extra Ingredient";
          initial[name] = true; 
        }
      });
      setSelections(initial);
      setOrderNote("");
      setOrderType("Dine In");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const toggleOption = (name: string) => {
    setSelections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleConfirm = () => {
    const appliedSelections = product.recipe.map((ing: any) => {
      if (ing.isOptional) {
        const name = ing.materialId?.name || "Extra Ingredient";
        return {
          ...ing,
          removed: !selections[name]
        };
      }
      return { ...ing, removed: false };
    });

    onConfirm({
      ...product,
      customizedRecipe: appliedSelections,
      orderNote: orderNote,
      orderType: orderType,
      summary: Object.entries(selections)
        .filter(([_, kept]) => !kept)
        .map(([name]) => `No ${name}`)
        .join(", ")
    });
  };

  const optionalIngredients = product.recipe?.filter((ing: any) => ing.isOptional) || [];

  const typeOptions = [
    { id: 'Dine In', icon: <Utensils size={18} />, label: 'Dine In' },
    { id: 'To Go', icon: <Package size={18} />, label: 'To Go' },
    { id: 'Delivery', icon: <Truck size={18} />, label: 'Delivery' },
  ];

  return (
    // Responsive: added p-2 for mobile to prevent touching screen edges
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2 sm:p-4">
      
      {/* Responsive: Changed max-w-md to responsive scale and max-h-screen for small phones */}
      <div className="bg-[#1F1D2B] w-full max-w-lg sm:max-w-md rounded-2xl sm:rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header - Scaled padding for mobile */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center bg-[#252836] shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-none">
              Customize {product.name}
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
              <Info size={12} className="text-primary" /> Personalized your meal experience
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content - Added better scroll management and padding */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* ORDER TYPE SELECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] sm:text-sm font-semibold text-gray-400 uppercase tracking-widest">Order Type</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {typeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setOrderType(option.id)}
                  className={`relative flex flex-col items-center justify-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${
                    orderType === option.id 
                      ? 'bg-[#EA7C69]/10 border-[#EA7C69] text-[#EA7C69]' 
                      : 'bg-[#2D303E] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="scale-90 sm:scale-100">{option.icon}</div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase">{option.label}</span>
                  {orderType === option.id && (
                    <div className="absolute -top-1 -right-1 bg-[#EA7C69] text-white rounded-full p-0.5 shadow-md">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Options List */}
          <section className="space-y-4">
            <h3 className="text-[10px] sm:text-sm font-semibold text-gray-400 uppercase tracking-widest">Adjust Ingredients</h3>
            <div className="space-y-2 sm:space-y-3">
              {optionalIngredients.length > 0 ? (
                optionalIngredients.map((ing: any) => {
                  const name = ing.materialId?.name || "Extra Ingredient";
                  const isKept = selections[name];

                  return (
                    <div 
                      key={ing._id} 
                      className={`flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                        isKept 
                          ? 'bg-[#2D303E] border-primary/20' 
                          : 'bg-[#1F1D2B] border-gray-700 opacity-60'
                      }`}
                    >
                      <p className={`text-sm sm:text-base font-medium capitalize truncate pr-2 ${isKept ? 'text-white' : 'text-gray-500 line-through'}`}>
                        {name}
                      </p>
                      
                      <button 
                        onClick={() => toggleOption(name)}
                        className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${
                          isKept 
                            ? 'bg-[#EA7C69] text-white' 
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                      >
                        {isKept ? <Check size={14} /> : null}
                        {isKept ? 'KEEP' : 'REMOVE'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic text-center py-2 text-xs sm:text-sm">Standard recipe ingredients only.</p>
              )}
            </div>
          </section>

          {/* Notes Section */}
          <section className="space-y-3 pb-2">
            <h3 className="text-[10px] sm:text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Special Instructions
            </h3>
            <textarea 
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="e.g. Extra napkins, no ice in drink, etc."
              className="w-full bg-[#2D303E] border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white text-sm outline-none focus:border-[#EA7C69] transition-all min-h-[80px] sm:min-h-[100px] resize-none"
            />
          </section>
        </div>

        {/* Action Button - Shrink-0 prevents it from getting squeezed */}
        <div className="p-4 sm:p-6 bg-[#252836] border-t border-gray-800 shrink-0">
          <button 
            onClick={handleConfirm}
            className="w-full bg-[#EA7C69] hover:bg-[#EA7C69]/90 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all transform active:scale-95 shadow-lg shadow-[#EA7C69]/20"
          >
            Confirm & Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}