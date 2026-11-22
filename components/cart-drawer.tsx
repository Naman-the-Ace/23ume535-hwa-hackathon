"use strict";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";

function decrementButtonClass(qty: number): string {
  const base =
    "w-8 h-8 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none";
  if (qty <= 1)
    return `${base} border-sage-dark/20 text-sage-dark/30 bg-background`;
  return `${base} border-sage-dark/30 text-sage-dark hover:bg-cream-dark`;
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clear,
    subtotalCents,
  } = useCart();

  const SHIPPING_CENTS = 0;
  const TAX_RATE = 0.08;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents + SHIPPING_CENTS;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-background shadow-2xl border border-cream-dark transform transition-all duration-300 translate-y-0">
        <div className="px-6 py-4 border-b border-cream-dark flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
          <button
            onClick={closeCart}
            className="text-sage-dark hover:text-coral transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 text-sage-dark">
              <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
                <ProductImage variant="hero" width="64" height="64" className="opacity-40" />
              </div>
              <p>Your cart is empty.</p>
              <Link
                href="/products/sniffshift-original"
                className="mt-4 inline-block text-coral font-medium hover:text-coral-dark"
              >
                Browse Product
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 items-center p-4 bg-background rounded-xl border border-cream-dark hover:border-sage-dark/30 transition-colors"
                >
                  <div className="w-16 h-16 bg-cream-dark rounded-xl flex items-center justify-center text-sage-dark shrink-0">
                    <ProductImage variant="hero" width="48" height="48" className="opacity-60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.variantName}</h3>
                    <p className="text-xs text-sage-dark">
                      SniffShift Enrichment Toy • {item.variantName}
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-lg font-bold text-foreground">
                        ${(item.unitPriceCents * item.quantity / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className={decrementButtonClass(item.quantity)}
                    >
                      −
                    </button>
                    <span className="text-xs font-medium text-foreground w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors border-sage-dark/30 text-sage-dark hover:bg-cream-dark"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-sage-dark hover:text-coral transition-colors text-sm"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-cream-dark">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-sage-dark">Subtotal</span>
              <span className="font-medium text-foreground">
                ${(subtotalCents / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sage-dark">Shipping</span>
              <span className="font-medium text-sage-dark">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-sage-dark/20">
              <span className="text-foreground">Total</span>
              <span className="text-coral">${(totalCents / 100).toFixed(2)}</span>
            </div>
          </div>
          {items.length > 0 ? (
            <Link href="/checkout">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          ) : null}
          <button
            onClick={() => {
              clear();
              closeCart();
            }}
            className="w-full mt-3 px-4 py-2 rounded-full border border-sage-dark/30 text-sage-dark text-sm font-medium hover:bg-cream-dark transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
