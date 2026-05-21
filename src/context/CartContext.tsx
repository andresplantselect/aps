'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { CartContextType } from '@/src/types/propsTypes';
import { CartItem } from '@/src/types/types';

const CartContext = createContext<CartContextType>({
  items: [],
  updateItemQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const updateItemQuantity = (
    product: Omit<CartItem, 'quantity'>,
    quantity: number,
  ) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== product.id);
      }

      const safeQuantity = Math.min(quantity, product.available);

      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: safeQuantity } : item,
        );
      }

      return [...prev, { ...product, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
