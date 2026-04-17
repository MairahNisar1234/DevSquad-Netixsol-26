'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Printer,
  User,
  Package,
  MapPin,
  CreditCard,
  Loader2,
  ChevronDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch order');

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Order fetch error:', err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EAE9E4]">
        <Loader2 className="animate-spin text-[#0B2447]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center bg-[#EAE9E4] min-h-screen">
        Order Not Found
      </div>
    );
  }

  /* ================== CALCULATIONS ================== */
  const summary = order.summary || {};
  const subtotal = summary.subtotal || 0;
  const tax = summary.tax || subtotal * 0.2;
  const discount = summary.discount || 0;
  const deliveryFee = summary.deliveryFee || 0;
  const total = summary.totalAmount || order.totalAmount || 0;

  const displayId = (order._id || '').slice(-4).toUpperCase();

  return (
    <div className="bg-[#EAE9E4] min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">Order #{displayId}</h2>
            <p className="text-sm text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>

          <div className="flex gap-2">
            <select className="bg-gray-100 px-3 py-2 rounded text-sm">
              <option>Change Status</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
            </select>

            <button className="p-2 bg-gray-100 rounded">
              <Printer size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMER + DELIVERY */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <InfoCard icon={<User size={16} />} title="Customer">
          <p>{order.name}</p>
          <p>{order.email}</p>
          <p>{order.phoneNumber}</p>
        </InfoCard>

        <InfoCard icon={<Package size={16} />} title="Order Info">
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentMethod || 'Card'}</p>
        </InfoCard>

        <InfoCard icon={<MapPin size={16} />} title="Delivery">
          <p>{order.address}</p>
        </InfoCard>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white p-6 rounded-xl">
        <h3 className="font-bold mb-4">Products</h3>

        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex justify-between py-2 border-b">
            <span>{item.productName}</span>
            <span>x{item.quantity}</span>
            <span>
              ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        {/* TOTAL */}
        <div className="mt-6 space-y-2 text-sm">
          <Row label="Subtotal" value={subtotal} />
          <Row label="Tax" value={tax} />
          <Row label="Discount" value={discount} />
          <Row label="Delivery" value={deliveryFee} />

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== SMALL COMPONENTS ================== */

function InfoCard({ icon, title, children }: any) {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2 font-bold">
        {icon} {title}
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span>₹{value}</span>
    </div>
  );
}