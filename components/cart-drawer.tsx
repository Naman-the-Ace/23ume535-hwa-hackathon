"use strict";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clear,
    subtotalCents,
    itemCount,
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
      <div className="relative w-full max-w-md bg-background shadow-2xl border border-cream-dark transform transition-transform duration-300 translate-y-0">
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
                  className="flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-cream-dark rounded-xl flex items-center justify-center text-sage-dark">
                    <ProductImage size="small" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-foreground">{item.variantName}</h3>
                      <span className="text-sage-dark">${(item.unitPriceCents * item.quantity / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 rounded-full border border-sage-dark/30 flex items-center justify-center hover:bg-cream-dark text-sage-dark text-sm"
                      >
                        −
                      </button>
                      <span className="text-xs font-medium text-foreground">
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
                        className="w-8 h-8 rounded-full border border-sage-dark/30 flex items-center justify-center hover:bg-cream-dark text-sage-dark text-sm"
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
