import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'nandanvan_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [minOrder, setMinOrder] = useState(200);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (dish, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...dish, qty }];
    });
  };

  const updateQty = (dishId, qty) => {
    if (qty <= 0) {
      removeFromCart(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === dishId ? { ...i, qty } : i))
    );
  };

  const removeFromCart = (dishId) => {
    setItems((prev) => prev.filter((i) => i.id !== dishId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + (itemCount > 0 ? deliveryCharge : 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryCharge,
        minOrder,
        total,
        isDrawerOpen,
        setIsDrawerOpen,
        setDeliveryCharge,
        setMinOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
