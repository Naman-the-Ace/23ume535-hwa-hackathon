"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";

const TAX_RATE = 0.08;
const SHIPPING_CENTS = 0; // Free shipping
const IDEMPOTENCY_KEY_STORAGE_KEY = "sniffshift-idempotency-key";

type FormErrors = {
  customer?: Record<string, string>;
  shippingAddress?: Record<string, string>;
  general?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, clear, subtotalCents } = useCart();
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents + SHIPPING_CENTS;

  // Initialize idempotency key in sessionStorage once on mount.
  // This key survives page refreshes during the same checkout session,
  // preventing duplicate orders if the customer refreshes after submitting.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(IDEMPOTENCY_KEY_STORAGE_KEY);
    if (!stored) {
      const newKey = `ss-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(IDEMPOTENCY_KEY_STORAGE_KEY, newKey);
      setIdempotencyKey(newKey);
    } else {
      setIdempotencyKey(stored);
    }
  }, []);

  if (items.length === 0) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(IDEMPOTENCY_KEY_STORAGE_KEY);
    }
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
                Cart
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Checkout</h1>
            <p className="text-sage-dark mb-8">Your cart is empty.</p>
            <Link
              href="/products/sniffshift-original"
              className="inline-flex items-center gap-2 text-coral font-medium hover:text-coral-dark"
            >
              Browse Product
            </Link>
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Prevent simultaneous duplicate submissions
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setErrors({});

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const customer = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      };
      const shippingAddress = {
        line1: formData.get("line1") as string,
        line2: formData.get("line2") as string || undefined,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postalCode: formData.get("postalCode") as string,
        country: formData.get("country") as string,
      };

      const payload = {
        customer,
        shippingAddress,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
        })),
        subtotalCents,
        taxCents,
        shippingCents: SHIPPING_CENTS,
        totalCents,
      };

      try {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "idempotency-key": idempotencyKey!,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          // If we got a duplicate response, treat it as success and redirect
          // to the existing order confirmation.
          if (errorData.duplicate && errorData.id) {
            clear();
            if (typeof window !== "undefined") {
              sessionStorage.removeItem(IDEMPOTENCY_KEY_STORAGE_KEY);
            }
            router.push(`/order/${errorData.id}`);
            return;
          }
          setErrors({
            general: errorData.message || "Failed to place order. Please try again.",
          });
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        const data = await res.json();
        clear();
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(IDEMPOTENCY_KEY_STORAGE_KEY);
        }
        isSubmittingRef.current = false;
        setIsSubmitting(false);

        // Redirect to order confirmation — survives refresh
        router.push(`/order/${data.id}`);
      } catch {
        setErrors({
          general: "A network error occurred. Please check your connection and try again.",
        });
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [items, subtotalCents, taxCents, totalCents, router, idempotencyKey]
  );

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark">
                  <h2 className="font-bold text-foreground mb-4">Customer Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.customer?.name && (
                        <p className="text-xs text-red-600">{errors.customer.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.customer?.email && (
                        <p className="text-xs text-red-600">{errors.customer.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-medium text-sage-dark">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                    />
                    {errors.customer?.phone && (
                      <p className="text-xs text-red-600">{errors.customer.phone}</p>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark mt-6">
                  <h2 className="font-bold text-foreground mb-4">Shipping Address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Address Line 1
                      </label>
                      <input
                        name="line1"
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.shippingAddress?.line1 && (
                        <p className="text-xs text-red-600">{errors.shippingAddress.line1}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Address Line 2 (optional)
                      </label>
                      <input
                        name="line2"
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        City
                      </label>
                      <input
                        name="city"
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-xs text-red-600">{errors.shippingAddress.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        State / Region
                      </label>
                      <input
                        name="state"
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.shippingAddress?.state && (
                        <p className="text-xs text-red-600">{errors.shippingAddress.state}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Postal Code
                      </label>
                      <input
                        name="postalCode"
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p className="text-xs text-red-600">{errors.shippingAddress.postalCode}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-sage-dark">
                        Country
                      </label>
                      <input
                        name="country"
                        type="text"
                        defaultValue="US"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-sage-dark/30 bg-background text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                      />
                      {errors.shippingAddress?.country && (
                        <p className="text-xs text-red-600">{errors.shippingAddress.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {errors.general && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                    {errors.general}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full shadow-lg shadow-coral/20"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order…" : "Place Order"}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark">
                <h2 className="font-bold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-sage-dark">Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                    <span className="font-medium text-foreground">${(subtotalCents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sage-dark">Tax (8%)</span>
                    <span className="font-medium text-foreground">${(taxCents / 100).toFixed(2)}</span>
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
              </div>
            </div>
          </div>
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
