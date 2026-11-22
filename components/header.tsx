"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/products/sniffshift-original", label: "Product" },
];

function Logo() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="5" y="14" width="14" height="6" rx="3" fill="#F1EFE4" stroke="#C9C2B3" strokeWidth="1" />
      <rect x="7" y="8" width="10" height="8" rx="2" fill="#E7E3D4" stroke="#6B8A67" strokeWidth="1.5" />
      <path d="M7 8 Q12 6 17 8" fill="none" stroke="#9FB08A" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="2.5" fill="#E76F51" opacity="0.95" />
      <circle cx="12" cy="10" r="1.5" fill="#C0563D" />
      <rect x="6.5" y="13" width="4" height="1.5" rx="0.75" fill="#D8D2C4" />
      <rect x="13.5" y="13" width="4" height="1.5" rx="0.75" fill="#D8D2C4" />
      <rect x="10" y="16.5" width="4" height="2.5" rx="1.25" fill="#9FB08A" stroke="#6B8A67" strokeWidth="1" />
      <rect x="6" y="18.5" width="2" height="1.5" rx="0.5" fill="#6B8A67" />
      <rect x="16" y="18.5" width="2" height="1.5" rx="0.5" fill="#6B8A67" />
    </svg>
  );
}

export function Header() {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-cream-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-coral font-bold tracking-tight">Sniff</span>
              <span className="text-sage-dark font-bold tracking-tight">Shift</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-sage-dark">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-foreground hover:text-coral transition-colors">
                  {link.label}
                </Link>
              ))}
              <button
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sage-dark/30 text-sage-dark hover:bg-cream-dark hover:text-coral transition-all duration-300"
                aria-label={`Cart (${itemCount} items)`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-coral text-[10px] text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-coral transition-colors p-2 rounded-full hover:bg-cream-dark"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
              <button
                onClick={openCart}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-dark/30 text-sage-dark hover:bg-cream-dark hover:text-coral transition-all duration-300"
                aria-label={`Cart (${itemCount} items)`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-coral text-[10px] text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-b border-cream-dark">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl text-sm font-medium text-sage-dark hover:bg-cream-dark hover:text-coral transition-colors">
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={openCart}
                    className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-sage-dark hover:bg-cream-dark hover:text-coral transition-all duration-300 w-full"
                    aria-label={`Cart (${itemCount} items)`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100 4 2 2 0 000-4z" /></svg>
                    Cart ({itemCount})
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
        </header>
        <CartDrawer />
      </div>
  );
}