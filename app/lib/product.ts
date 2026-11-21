export type ProductVariant = {
  id: string;
  name: string;
  priceDelta: number;
  stock: number;
};

export type ProductImage = {
  url: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  priceCents: number;
  currency: string;
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  features: string[];
  careInstructions: string[];
  materials: string[];
  isActive: boolean;
};

export const product: Product = {
  id: "sniffshift-original",
  slug: "sniffshift-original",
  name: "SniffShift Enrichment Toy",
  tagline: "Mental stimulation for happy tails",
  description:
    "SniffShift is the single enrichment toy that turns mealtime into a mental workout. Designed for curious dogs who love to sniff, shift, and solve. The hidden treat compartment challenges your dog's problem-solving instincts and slows down fast eating, leaving your pup satisfied, calm, and happy.",
  shortDescription:
    "The enrichment toy that turns mealtime into a mental workout for curious dogs.",
  priceCents: 3400,
  currency: "USD",
  category: "Dog Enrichment",
  images: [
    {
      url: "/images/product/hero.jpg",
      alt: "SniffShift Enrichment Toy - cream and sage with coral accent",
    },
    {
      url: "/images/product/detail.jpg",
      alt: "SniffShift close-up showing treat compartment",
    },
    {
      url: "/images/product/in-use.jpg",
      alt: "Dog playing with SniffShift toy",
    },
  ],
  variants: [
    { id: "small", name: "Small", priceDelta: 0, stock: 50 },
    { id: "medium", name: "Medium", priceDelta: 500, stock: 50 },
    { id: "large", name: "Large", priceDelta: 1000, stock: 50 },
  ],
  specifications: {
    Material: "BPA-free, non-toxic, food-grade silicone",
    Dimensions: "18 cm x 12 cm x 7 cm",
    Weight: "280 g",
    Cleaning: "Dishwasher safe (top rack)",
    Sizes: "Small, Medium, Large",
    Origin: "Designed for dogs of all breeds",
  },
  features: [
    "Hidden treat compartment engages natural foraging instincts",
    "Slows down fast eaters to support healthy digestion",
    "Durable, chew-resistant construction",
    "Easy to clean — dishwasher safe",
    "Suitable for all breeds and sizes",
  ],
  careInstructions: [
    "Rinse with warm water after each use",
    "Dishwasher safe on top rack",
    "Inspect regularly for wear; replace if damaged",
    "Supervise your dog during play",
  ],
  materials: [
    "Food-grade silicone",
    "BPA-free plastic",
    "Non-toxic pigments",
  ],
  isActive: true,
};

export function getVariantPriceCents(variantId: string): number {
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return product.priceCents;
  return product.priceCents + variant.priceDelta;
}
