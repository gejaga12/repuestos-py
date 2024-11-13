'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
});

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        setItemCount(parsedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(current => {
      const existingItem = current.find(item => item.id === newItem.id);
      if (existingItem) {
        return current.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    setItems(current =>
      current.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);