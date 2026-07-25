"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { trackAddToCart } from "@/lib/meta-pixel";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  details: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      total,
      count,
      addItem: (item) => {
        const quantity = item.quantity ?? 1;
        trackAddToCart({
          contentId: item.productId,
          contentName: item.title,
          value: item.price * quantity,
          quantity,
        });
        setItems((prev) => [
          ...prev,
          {
            ...item,
            id: crypto.randomUUID(),
            quantity,
          },
        ]);
      },
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
