'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import {
  ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE = 'http://localhost:3000/api';

export default function ProductDetailView() {
  const router = useRouter();

  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brandName: '',
    sku: '',
    stock: 0,
    regularPrice: 0,
    salePrice: 0,
    images: [] as { url: string; color: string }[]
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE}/products/${id}`);

        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...data,
            images: data.images || []
          });
        } else {
          toast.error('Failed to load product');
        }
      } catch (error) {
        toast.error('Network error');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name required";
    if (formData.regularPrice <= 0) return "Price must be greater than 0";
    if (formData.stock < 0) return "Stock cannot be negative";
    if (formData.images.length === 0) return "At least one image required";
    return null;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return toast.error("Invalid product ID");

    const error = validateForm();
    if (error) return toast.error(error);

    setLoading(true);

    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access_token')
          : null;

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Product updated successfully');
        router.push('/admin');
      } else {
        toast.error('Update failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!confirm('Delete this product?')) return;

    setLoading(true);

    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access_token')
          : null;

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Deleted successfully');
        router.push('/admin');
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSuccess = (result: any) => {
    if (result?.info?.secure_url) {
      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          { url: result.info.secure_url, color: 'Default' }
        ]
      }));

      toast.success('Image uploaded');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <button onClick={() => router.back()}>
          <ArrowLeft /> Back
        </button>

        <button
          onClick={handleDelete}
          className="text-red-500 flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <input
          value={formData.name}
          onChange={e =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Product Name"
          className="w-full p-3 border"
        />

        <textarea
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          className="w-full p-3 border"
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={formData.regularPrice}
            onChange={e =>
              setFormData({
                ...formData,
                regularPrice: Number(e.target.value)
              })
            }
            placeholder="Price"
            className="border p-2"
          />

          <input
            type="number"
            value={formData.salePrice}
            onChange={e =>
              setFormData({
                ...formData,
                salePrice: Number(e.target.value)
              })
            }
            placeholder="Sale Price"
            className="border p-2"
          />

          <input
            type="number"
            value={formData.stock}
            onChange={e =>
              setFormData({
                ...formData,
                stock: Number(e.target.value)
              })
            }
            placeholder="Stock"
            className="border p-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          {formData.images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img.url} className="w-20 h-20 object-cover" />
              <button type="button" onClick={() => removeImage(i)}>
                <X />
              </button>
            </div>
          ))}
        </div>

        <CldUploadWidget
          uploadPreset="ml_default"
          onSuccess={handleImageSuccess}
        >
          {({ open }) => (
            <button type="button" onClick={() => open?.()}>
              Upload Image
            </button>
          )}
        </CldUploadWidget>

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}