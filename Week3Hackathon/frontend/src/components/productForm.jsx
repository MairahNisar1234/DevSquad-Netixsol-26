import { useState } from 'react';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  
  // Dynamic variants state
  const [variants, setVariants] = useState([
    { name: '50g', price: '', stock: '' },
    { name: '100g', price: '', stock: '' }
  ]);

  const variantOptions = ['50g', '100g', '250g', '500g', '1kg', 'Sachet', 'Box'];

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg font-['Montserrat']">
      <input 
        type="text" placeholder="Name" 
        className="w-full p-3 border mb-4 rounded"
        onChange={(e) => setName(e.target.value)}
      />
      
      <input 
        type="text" placeholder="Category" 
        className="w-full p-3 border mb-6 rounded"
        onChange={(e) => setCategory(e.target.value)}
      />

      {variants.map((variant, index) => (
        <div key={index} className="mb-6 p-4 border border-gray-100 bg-gray-50 rounded">
          <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block">
            Select Variant {index + 1}:
          </label>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Dropdown for Variant Name */}
            <select 
              value={variant.name}
              onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
              className="p-2 border rounded text-sm"
            >
              {variantOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <input 
              type="number" placeholder="Price (€)" 
              className="p-2 border rounded text-sm"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
            />

            <input 
              type="number" placeholder="Stock" 
              className="p-2 border rounded text-sm"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
            />
          </div>
        </div>
      ))}

      <input 
        type="file" 
        className="mb-6 text-sm"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-[2px] hover:bg-gray-800 transition-colors">
        Add Product
      </button>
    </div>
  );
};


export default ProductForm;