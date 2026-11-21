"use client";

import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  );
}
