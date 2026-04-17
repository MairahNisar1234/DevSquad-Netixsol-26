'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number, size: string) => {
    setCart((prev) => {
      const existingItem = prev.find(item => item._id === product._id && item.size === size);
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id && item.size === size 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity, size }];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item._id === id && item.size === size)));
  };

  // --- ADDED: updateQuantity function ---
  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // --- ADDED: clearCart function ---
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, // 👈 Added to Provider
      clearCart,      // 👈 Added to Provider
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);