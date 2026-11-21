"use client";

import Link from "next/link";
import { useState, useCallback, FormEvent } from "react";
import { product } from "@/app/lib/product";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/button";
import { ProductImage } from "@/components/product-image";

export default function ProductPage() {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants[0].id
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const variant = product.variants.find((v) => v.id === selectedVariant);
  const priceCents = variant
    ? product.priceCents + variant.priceDelta
    : product.priceCents;
  const isInStock = variant ? variant.stock > 0 : false;
  const mainImage = product.images[selectedImageIndex] ?? product.images[0];

  const handleAddToCart = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!variant || !isInStock || isAdding) return;
      setIsAdding(true);
      addItem({
        productId: product.id,
        variantId: variant.id,
        variantName: variant.name,
        quantity,
        unitPriceCents: priceCents,
      });
      setTimeout(() => setIsAdding(false), 800);
    },
    [variant, isInStock, isAdding, addItem, quantity]
  );

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-8 text-xs text-sage-dark">
            <Link href="/" className="hover:text-coral transition-colors">Home</Link>
            <span className="mx-1 text-sage-dark/50">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="relative bg-cream-dark rounded-2xl overflow-hidden aspect-square flex items-center justify-center text-sage-dark">
                <ProductImage size="large" />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl border flex-shrink-0 transition-colors flex items-center justify-center ${
                      selectedImageIndex === idx
                        ? "border-coral bg-coral/10"
                        : "border-sage-dark/20 hover:border-coral"
                    }`}
                  >
                    <ProductImage size="small" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-coral font-bold text-sm tracking-wider uppercase">
                  Dog Enrichment
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-sage-dark leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              <div className="px-4 py-6 rounded-2xl border border-cream-dark bg-cream-dark/50">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    ${(priceCents / 100).toFixed(2)}
                  </span>
                  <span className="text-sage-dark text-sm">USD</span>
                </div>
                <p className="text-sm text-sage-dark">
                  Free shipping on all orders
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-sage-dark">
                  Size
                </h3>
                <div className="flex gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-all ${
                        selectedVariant === v.id
                          ? "bg-coral text-white border-coral shadow-md shadow-coral/20"
                          : "bg-background text-sage-dark border-sage-dark/30 hover:border-sage-dark hover:bg-cream-dark"
                      }`}
                    >
                      {v.name}
                      {v.priceDelta > 0 && (
                        <span className="text-xs ml-1 opacity-80">+${(v.priceDelta / 100).toFixed(2)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-sage-dark">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-sage-dark/30 flex items-center justify-center hover:bg-cream-dark text-sage-dark"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= 10)
                        setQuantity(val);
                    }}
                    className="w-12 h-10 text-center border border-sage-dark/30 rounded-lg text-sage-dark focus:outline-none focus:ring-2 focus:ring-coral"
                    min="1"
                    max="10"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 rounded-full border border-sage-dark/30 flex items-center justify-center hover:bg-cream-dark text-sage-dark"
                  >
                    +
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddToCart}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-coral/20"
                  isLoading={isAdding}
                  disabled={!isInStock || isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </Button>
              </form>
            </div>
          </div>

          {/* Product details */}
          <section id="details" className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Product Details</h2>
            <p className="text-sage-dark leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-foreground mb-4">What's Included</h3>
                <ul className="space-y-3 text-sage-dark">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-coral font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-4">Specifications</h3>
                <table className="w-full text-left text-sage-dark text-sm">
                  <tbody className="divide-y divide-cream-dark">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="py-3">
                        <td className="font-medium text-sage-dark/70 w-1/3">{key}</td>
                        <td className="text-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Mechanism */}
          <section id="mechanism" className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {product.mechanism.title}
            </h2>
            <p className="text-sage-dark leading-relaxed mb-8">
              {product.mechanism.description}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {product.mechanism.stages.map((stage) => (
                <div
                  key={stage.number}
                  className="p-6 bg-cream-dark rounded-2xl border border-cream-dark text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-coral text-white flex items-center justify-center mx-auto mb-4 text-sm font-mono font-bold">
                    {stage.number}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{stage.title}</h3>
                  <p className="text-sage-dark text-sm">{stage.description}</p>
                  <p className="text-xs text-sage-dark/60 mt-2 font-mono">
                    {stage.action}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Care instructions */}
          <section id="care" className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Care Instructions</h2>
            <ul className="space-y-3 text-sage-dark list-disc pl-6">
              {product.careInstructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </section>

          {/* Prototype disclosure */}
          <section id="prototype" className="mt-12">
            <div className="p-6 bg-sage-dark/10 rounded-2xl border border-sage-dark/30">
              <h3 className="font-bold text-coral mb-2">Prototype Disclosure</h3>
              <p className="text-sage-dark text-sm leading-relaxed">
                {product.prototypeNote}
              </p>
            </div>
          </section>
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
          <div className="flex gap-4 text-sm text-sage/40">
            <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/#care" className="hover:text-white transition-colors">Care</a>
            <a href="/#prototype" className="hover:text-white transition-colors">Disclosure</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
