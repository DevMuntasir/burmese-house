"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "burmese-house-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        localStorage.removeItem(storageKey);
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((incoming: CartItem) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === incoming.id);
      if (!existing) return [...current, incoming];
      return current.map((item) => item.id === incoming.id
        ? { ...item, quantity: Math.min(item.quantity + incoming.quantity, item.maxStock) }
        : item);
    });
    toast.success("Added to cart");
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => current.map((item) => item.id === id
      ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
      : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Removed from cart");
  }, []);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart: () => setItems([]),
  }), [items, addItem, updateQuantity, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
