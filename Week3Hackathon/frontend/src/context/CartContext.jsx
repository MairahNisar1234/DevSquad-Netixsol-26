import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Inside CartContext.jsx
// Updated addToCart inside CartContext.jsx
const addToCart = (product, quantity, selectedVariant) => {
  // SAFETY: If variant is missing for some reason, don't crash
  if (!selectedVariant) return;

  setCart((prev) => {
    // Use ?. (Optional Chaining) to safely check IDs
    const existingItem = prev.find(item => 
      item?._id === product?._id && item?.variantName === selectedVariant?.name
    );

    if (existingItem) {
      return prev.map(item => 
        (item?._id === product?._id && item?.variantName === selectedVariant?.name)
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    }

    // Explicitly define the item structure
    return [...prev, { 
      _id: product._id, 
      name: product.name,
      image: product.image,
      price: selectedVariant.price, // This is where it was reading undefined
      variantName: selectedVariant.name,
      quantity 
    }];
  });
  setIsCartOpen(true);
};

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) => prev.map((item) => 
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};
const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};

export const useCart = () => useContext(CartContext);