"use strict";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";

export function Header() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-cream-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-coral font-bold tracking-tight">Sniff</span>
            <span className="text-sage-dark font-bold tracking-tight">Shift</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-sage-dark">
            <Link href="/" className="text-foreground hover:text-coral transition-colors">
              Home
            </Link>
            <Link href="#how-it-works" className="text-foreground hover:text-coral transition-colors">
              How It Works
            </Link>
            <Link href="#faq" className="text-foreground hover:text-coral transition-colors">
              FAQ
            </Link>
            <Link
              href="/products/sniffshift-original"
              className="text-foreground hover:text-coral transition-colors"
            >
              Product
            </Link>
            <ButtonCart itemCount={itemCount} onClick={openCart} />
          </nav>
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={openCart}
              className="text-foreground hover:text-coral transition-colors p-1 rounded-full hover:bg-cream-dark"
              aria-label="View cart"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100 4 2 2 0 000-4z"
                ></path>
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-coral text-[10px] text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}

function ButtonCart({
  itemCount,
  onClick,
}: {
  itemCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sage-dark/30 text-sage-dark hover:bg-cream-dark hover:text-coral transition-colors"
      aria-label={`Cart (${itemCount} items)`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100 4 2 2 0 000-4z"
        ></path>
      </svg>
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-coral text-[10px] text-white flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
