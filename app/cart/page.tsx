"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";
import { ProductImage } from "@/components/product-image";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clear,
    itemCount,
    subtotalCents,
  } = useCart();

  const SHIPPING_CENTS = 0;
  const TAX_RATE = 0.08;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents + SHIPPING_CENTS;

  function decrementButtonClass(qty: number): string {
    const base =
      "w-8 h-8 rounded-full border flex items-center justify-center transition-colors shrink-0";
    if (qty <= 1)
      return `${base} border-sage-dark/20 text-sage-dark/30 bg-background`;
    return `${base} border-sage-dark/30 text-sage-dark hover:bg-cream-dark`;
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground mb-8">Your Demo Cart</h1>

          {items.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center py-20">
              <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
                <ProductImage variant="hero" width="80" height="80" className="opacity-40" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Cart</h2>
              <p className="text-sage-dark mb-8">Your cart is empty.</p>
              <Link
                href="/products/sniffshift-original"
                className="inline-flex items-center gap-2 text-coral font-medium hover:text-coral-dark"
              >
                Browse Product
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center p-4 bg-background rounded-xl border border-cream-dark hover:border-sage-dark/30 transition-colors"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cream-dark rounded-xl flex items-center justify-center text-sage-dark shrink-0">
                        <ProductImage variant="hero" width="48" height="48" className="opacity-60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.variantName}</h3>
                        <p className="text-xs text-sage-dark truncate">
                          SniffShift Enrichment Toy • {item.variantName}
                        </p>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-lg font-bold text-foreground shrink-0">
                            ${(item.unitPriceCents * item.quantity / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
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
                        <span className="text-xs font-medium text-foreground w-4 text-center shrink-0">
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
                          className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors border-sage-dark/30 text-sage-dark hover:bg-cream-dark shrink-0"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-sage-dark hover:text-coral transition-colors text-sm shrink-0"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          clear();
                        }}
                        className="flex-1 py-3 rounded-xl border border-sage-dark/30 text-sage-dark text-sm font-medium hover:bg-cream-dark transition-colors"
                      >
                        Clear Cart
                      </button>
                      <Link href="/checkout">
                        <Button
                          variant="primary"
                          className="flex-1 shadow-lg shadow-coral/20"
                        >
                          Proceed to Checkout
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark/50 sticky top-24 self-start">
                    <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-dark">
                          Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                        </span>
                        <span className="font-medium text-foreground shrink-0">
                          ${(subtotalCents / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-dark">Shipping</span>
                        <span className="font-medium text-sage-dark shrink-0">Free</span>
                      </div>
                      <div className="flex justify-between text-sm text-coral">
                        <span className="text-sage-dark">Tax (8%)</span>
                        <span className="font-medium text-coral shrink-0">${(taxCents / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-sage-dark/20">
                        <span className="text-foreground">Total</span>
                        <span className="text-coral shrink-0">${(totalCents / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-sage-dark/60 text-center">
                      Demo order — taxes shown for illustration only
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="bg-sage-dark text-white py-12 border-t border-sage mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-coral font-bold tracking-tight">Sniff</span>
            <span className="font-bold tracking-tight">Shift</span>
          </div>
          <p className="text-sage/40 text-sm">
            Premium dog enrichment. Designed for happy tails.
          </p>
        </div>
      </footer>
    </div>
  );
}