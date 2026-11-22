"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function OrderConfirmationClient() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<{
    id: string;
    orderNumber: string;
    status: string;
    totalCents: number;
    createdAt: string;
    items: { productId: string; variantId: string; quantity: number; unitPriceCents: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = (params as { id: string }).id;
    fetch(`/api/order/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !notFound) {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <header className="border-b border-cream-dark bg-background/95 sticky top-0 z-20 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-coral font-bold tracking-tight">Sniff</span>
                <span className="text-sage-dark font-bold tracking-tight">Shift</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-pulse">
              <div className="h-8 w-3/4 bg-cream-dark rounded mx-auto mb-4"></div>
              <div className="h-6 w-1/2 bg-cream-dark rounded mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col flex-1">
        <header className="border-b border-cream-dark bg-background/95 sticky top-0 z-20 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-coral font-bold tracking-tight">Sniff</span>
                <span className="text-sage-dark font-bold tracking-tight">Shift</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Not Found</h1>
            <p className="text-sage-dark mb-8">The order you're looking for doesn't exist.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-coral font-medium hover:text-coral-dark"
            >
              Return to Home
            </Link>
          </div>
        </main>
      </div>
    );
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
          </div>
        </div>
      </header>
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed</h1>
          <p className="text-sage-dark mb-6">
            Thank you for your order! Your order reference is{" "}
            <span className="font-bold text-coral">{order.orderNumber}</span>.
          </p>
          <div className="p-6 bg-cream-dark rounded-2xl border border-cream-dark mb-8 text-left">
            <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3 text-sage-dark text-sm">
              <div className="flex justify-between">
                <span>Order #</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium text-sage-dark capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="font-medium">
                  ${(order.items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sage-dark/20">
                <span className="font-bold">Total</span>
                <span className="font-bold text-coral">${(order.totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-coral font-medium hover:text-coral-dark"
          >
            ← Return to Home
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
