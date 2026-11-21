"use client";

import Link from "next/link";
import { product } from "@/app/lib/product";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clear,
    itemCount,
  } = useCart();

  const subtotal = items.reduce(
    (sum, i) => sum + product.priceCents * i.quantity,
    0
  );

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-cream-dark bg-background/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-coral font-bold tracking-tight">Sniff</span>
              <span className="text-sage-dark font-bold tracking-tight">Shift</span>
            </Link>
            <a
              href="/cart"
              className="text-sm font-medium text-sage-dark hover:text-coral transition-colors"
            >
              Cart ({itemCount})
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center">
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
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-4 items-center p-4 bg-background rounded-xl border border-cream-dark"
                      >
                        <div className="w-16 h-16 bg-cream-dark rounded-xl flex items-center justify-center text-sage-dark shrink-0">
                          🦴
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.variantName}</h3>
                          <p className="text-xs text-sage-dark">
                            SniffShift Enrichment Toy • {item.variantName}
                          </p>
                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-lg font-bold text-foreground">
                              ${(product.priceCents * item.quantity / 100).toFixed(2)}
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
                            className="w-8 h-8 rounded-full border border-sage-dark/30 flex items-center justify-center hover:bg-cream-dark text-sage-dark text-sm"
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
                    ))}
                  </div>
                  {items.length > 0 && (
                    <div className="mt-6 flex gap-3">
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
                  <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark/50">
                    <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-dark">
                          Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                        </span>
                        <span className="font-medium text-foreground">
                          ${(subtotal / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-dark">Shipping</span>
                        <span className="font-medium text-sage-dark">Free</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-sage-dark/20">
                        <span className="text-foreground">Total</span>
                        <span className="text-coral">${(subtotal / 100).toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-sage-dark/60 text-center">
                      Taxes calculated at checkout
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
