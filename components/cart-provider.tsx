"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { product } from "@/app/lib/product";

export type CartItem = {
  productId: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPriceCents: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function isValidCartItem(item: any): item is CartItem {
  if (!item || typeof item !== "object") return false;
  if (typeof item.productId !== "string" || item.productId !== product.id)
    return false;
  const variant = product.variants.find((v) => v.id === item.variantId);
  if (!variant) return false;
  if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 10)
    return false;
  const expectedPrice = product.priceCents + variant.priceDelta;
  if (typeof item.unitPriceCents !== "number" || item.unitPriceCents !== expectedPrice)
    return false;
  if (typeof item.variantName !== "string") return false;
  return true;
}

function validateStoredItems(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sniffshift-cart");
      if (raw) {
        const validItems = validateStoredItems(raw);
        setItems(validItems);
      }
    } catch {
      // ignore malformed localStorage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage only after hydration and when items change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("sniffshift-cart", JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const quantity = Math.min(Math.max(item.quantity ?? 1, 1), 10);
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId && i.variantId === item.variantId
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + quantity, 10),
                }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      setItems((prev) =>
        prev.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      // Enforce quantity limit of 10
      const boundedQty = Math.min(quantity, 10);
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: boundedQty }
            : i
        )
      );
    },
    [removeItem]
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      itemCount,
      subtotalCents,
      isOpen,
      openCart,
      closeCart,
      hydrated,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
