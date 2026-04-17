'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageIcon, X, Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Consistent API base for your Render deployment
const API_BASE = 'http://localhost:3000/api';

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brandName: '',
    sku: '',
    stock: 0,
    regularPrice: 0,
    salePrice: 0,
    images: [] as { url: string; color: string }[],
  });

  const handleImageSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      const newUrl = result.info.secure_url;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: newUrl, color: '#000000' }]
      }));
      toast.success("Asset uploaded to cloud");
    }
  };

  const updateImageColor = (index: number, newColor: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, color: newColor } : img
      )
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tagInput.length > 15) return toast.error("Tag is too descriptive");
      if (tags.includes(tagInput.trim())) return setTagInput('');
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.name.length > 20) return toast.error("Name exceeds character limit");
    if (formData.images.length === 0) return toast.error("Visual representation required");
    if (formData.regularPrice <= 0) return toast.error("Price must be greater than zero");

    setLoading(true);
    
    // Extract unique colors for the backend's 'colors' field
    const uniqueColors = Array.from(new Set(formData.images.map(img => img.color)));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...formData, 
          colors: uniqueColors,
          tags 
        }),
      });

      if (response.ok) {
        toast.success("Garment successfully registered");
        router.push('/admin/products');
        router.refresh(); // Ensure the list view updates
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Protocol connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .pf-wrapper { background: #F8FAFC; min-height: 100vh; padding: 20px; }
        @media (min-width: 768px) { .pf-wrapper { padding: 40px; } }

        .pf-title { font-size: 24px; font-weight: 900; color: #0F172A; margin-bottom: 30px; letter-spacing: -1.5px; text-transform: uppercase; }
        
        .pf-card { background: #fff; border-radius: 32px; padding: 24px; border: 1px solid #F1F5F9; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.03); }
        @media (min-width: 768px) { .pf-card { padding: 48px; } }

        .pf-layout { display: grid; grid-template-columns: 1fr; gap: 48px; }
        @media (min-width: 1024px) { .pf-layout { grid-template-columns: 1fr 380px; } }

        .pf-label { display: flex; justify-content: space-between; font-size: 10px; font-weight: 900; color: #94A3B8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
        
        .pf-input, .pf-textarea { width: 100%; border: 2px solid #F1F5F9; border-radius: 16px; padding: 16px 20px; font-size: 14px; font-weight: 700; color: #0F172A; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); outline: none; background: #FDFDFD; }
        .pf-input:focus, .pf-textarea:focus { border-color: #0F172A; background: #fff; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05); }

        .pf-grid-2 { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 640px) { .pf-grid-2 { grid-template-columns: 1fr 1fr; gap: 24px; } }

        .pf-tags-box { border: 2px solid #F1F5F9; border-radius: 16px; padding: 12px; display: flex; flex-wrap: wrap; gap: 10px; min-height: 56px; background: #FDFDFD; }
        .pf-tag { background: #0F172A; color: #fff; font-size: 9px; font-weight: 900; padding: 6px 14px; border-radius: 10px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
        
        .pf-main-image { width: 100%; aspect-ratio: 4/5; border-radius: 24px; background: #F8FAFC; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; overflow: hidden; border: 2px solid #F1F5F9; }
        
        .pf-dropzone { border: 2px dashed #CBD5E1; border-radius: 20px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.3s; background: #F8FAFC; }
        .pf-dropzone:hover { border-color: #0F172A; background: #fff; }

        .pf-thumb-row { display: flex; align-items: center; gap: 16px; background: #fff; padding: 12px; border-radius: 20px; border: 2px solid #F1F5F9; margin-top: 12px; transition: transform 0.2s; }
        .pf-thumb-row:hover { transform: translateX(5px); }

        .pf-color-picker { width: 32px; height: 32px; border: none; padding: 0; background: none; cursor: pointer; border-radius: 50%; overflow: hidden; }
        .pf-color-picker::-webkit-color-swatch { border: 2px solid #F1F5F9; border-radius: 50%; }

        .pf-btn { width: 100%; padding: 18px 36px; border-radius: 18px; font-size: 11px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; border: none; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s; }
        .pf-btn-add { background: #0F172A; color: #fff; }
        .pf-btn-add:hover:not(:disabled) { background: #1E293B; transform: translateY(-3px); box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.4); }
      `}</style>

      <div className="pf-wrapper">
        <h1 className="pf-title">Add To Collection</h1>

        <form onSubmit={handleSubmit}>
          <div className="pf-card">
            <div className="pf-layout">
              {/* Fields */}
              <div className="space-y-6">
                <div className="pf-field">
                  <label className="pf-label">
                    Identity 
                    <span className={`text-[9px] ${formData.name.length > 20 ? 'text-red-500' : ''}`}>
                      {formData.name.length}/20
                    </span>
                  </label>
                  <input 
                    type="text" required className="pf-input"
                    placeholder="E.g. Oversized Linen Shirt" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className="pf-field">
                  <label className="pf-label">Technical Description</label>
                  <textarea 
                    required className="pf-textarea" rows={4}
                    placeholder="Details about cut, fabric, and fit..." 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>

                <div className="pf-grid-2">
                  <div className="pf-field">
                    <label className="pf-label">Category</label>
                    <input type="text" required className="pf-input" placeholder="Outerwear" onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Brand</label>
                    <input type="text" required className="pf-input" placeholder="Elite Garments" value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} />
                  </div>
                </div>

                <div className="pf-grid-2">
                  <div className="pf-field">
                    <label className="pf-label">SKU Ref</label>
                    <input type="text" required className="pf-input" placeholder="ELT-SS26-01" onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Inventory Qty</label>
                    <input type="number" required min="0" className="pf-input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
                  </div>
                </div>

                <div className="pf-grid-2">
                  <div className="pf-field">
                    <label className="pf-label">Base Price ($)</label>
                    <input type="number" required min="0" className="pf-input" value={formData.regularPrice} onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })} />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Sale Price ($)</label>
                    <input type="number" min="0" className="pf-input" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })} />
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label">Search Tags</label>
                  <div className="pf-tags-box">
                    {tags.map((tag, i) => (
                      <span key={i} className="pf-tag">{tag}
                        <button type="button" onClick={() => removeTag(i)} className="hover:text-red-400 transition-colors"><X size={10} /></button>
                      </span>
                    ))}
                    <input className="pf-tag-input outline-none text-sm flex-1 min-w-[120px]" placeholder="Add tag & hit Enter..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
                  </div>
                </div>
              </div>

              {/* Gallery Side */}
              <div>
                <label className="pf-label">Asset Preview</label>
                <div className="pf-main-image shadow-inner">
                  {formData.images.length > 0 ? (
                    <img src={formData.images[0].url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={48} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Assets</p>
                    </div>
                  )}
                </div>

                <CldUploadWidget uploadPreset="ml_default" onSuccess={handleImageSuccess}>
                  {({ open }) => (
                    <div className="pf-dropzone" onClick={() => open?.()}>
                      <PlusCircle size={20} className="mx-auto mb-2 text-slate-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Add Gallery Components</p>
                    </div>
                  )}
                </CldUploadWidget>

                <div className="mt-8 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Color Assignment</p>
                  {formData.images.map((img, i) => (
                    <div key={i} className="pf-thumb-row shadow-sm">
                      <img src={img.url} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex flex-col gap-1">
                         <input 
                          type="color" 
                          value={img.color} 
                          onChange={(e) => updateImageColor(i, e.target.value)}
                          className="pf-color-picker"
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{img.color.toUpperCase()}</span>
                      <button type="button" className="ml-auto text-slate-300 hover:text-rose-500 p-2 transition-colors" onClick={() => removeImage(i)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pf-actions mt-12 flex flex-col sm:flex-row justify-end gap-4">
              <button type="button" className="pf-btn border-2 border-slate-100 text-slate-400 hover:border-slate-200" onClick={() => router.back()}>Discard</button>
              <button 
                type="submit" 
                disabled={loading || formData.name.length > 20} 
                className="pf-btn pf-btn-add"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                {loading ? 'Processing...' : 'Register Garment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}