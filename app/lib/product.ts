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
  mechanism: {
    title: string;
    description: string;
    stages: {
      number: string;
      title: string;
      description: string;
      action: string;
    }[];
  };
  prototypeNote: string;
};

export const product: Product = {
  id: "sniffshift-original",
  slug: "sniffshift-original",
  name: "SniffShift Enrichment Station",
  tagline: "Delayed-access puzzle feeding for dogs",
  description:
    "SniffShift is a conceptual multi-stage enrichment station design. The proposed mechanism uses delayed access: a dog sniffs a scent chamber, shifts internal sliders with paws and nose, and waits for a release gate. Presented as a prototype; not a guaranteed solution for all dogs.",
  shortDescription:
    "A delayed-access puzzle feeder concept that makes dogs work through scent, shifting, and waiting.",
  priceCents: 3400,
  currency: "USD",
  category: "Dog Enrichment",
  images: [
    {
      url: "/images/product/hero.jpg",
      alt: "SniffShift Enrichment Station - cream and sage with coral accent",
    },
    {
      url: "/images/product/detail.jpg",
      alt: "SniffShift close-up showing slider mechanism",
    },
    {
      url: "/images/product/in-use.jpg",
      alt: "Dog using SniffShift enrichment station",
    },
  ],
  variants: [
    { id: "small", name: "Small", priceDelta: 0, stock: 50 },
    { id: "medium", name: "Medium", priceDelta: 500, stock: 50 },
    { id: "large", name: "Large", priceDelta: 1000, stock: 50 },
  ],
  specifications: {
    "Primary function": "Delayed-access puzzle feeder (conceptual)",
    "Stages": "3 (sniff, shift, wait) — proposed mechanism",
    "Materials": "Food-safe polymer, silicone grip base (prototype target)",
    "Dimensions": "18 cm x 12 cm x 7 cm (prototype target)",
    "Weight": "280 g (prototype target)",
    "Capacity": "Not yet verified (prototype)",
    "Cleaning": "Hand wash with warm, soapy water recommended",
    "Sizes": "Small, Medium, Large",
  },
  features: [
    "Proposed delayed-access release gate",
    "Proposed scent chamber for treat concealment",
    "Proposed slider mechanism for paw and nose interaction",
    "Three size options proposed (Small, Medium, Large)",
  ],
  careInstructions: [
    "Hand wash only with warm, soapy water (recommended)",
    "Do not submerge in water or place in dishwasher",
    "Supervise your dog during initial introduction",
    "Remove if your dog shows signs of frustration",
    "Inspect regularly for wear and discontinue if damaged",
  ],
  materials: ["Food-safe polymer (prototype target)", "Silicone grip base (prototype target)"],
  isActive: true,
  mechanism: {
    title: "Proposed delayed-access mechanism",
    description:
      "This is a conceptual design. The proposed mechanism would require a dog to work through three physical stages before food is released: sniffing a scent chamber, shifting internal gates with paws and nose, and waiting for timed release. Actual performance has not been verified.",
    stages: [
      {
        number: "01",
        title: "Sniff & Locate (proposed)",
        description:
          "Proposed: dog sniffs the scent chamber to locate hidden kibble.",
        action: "Scent detection (proposed)",
      },
      {
        number: "02",
        title: "Shift & Align (proposed)",
        description:
          "Proposed: dog slides internal gates with paws and nose to align release path.",
        action: "Physical manipulation (proposed)",
      },
      {
        number: "03",
        title: "Wait & Release (proposed)",
        description:
          "Proposed: timed gate opens after correct alignment to release a portion.",
        action: "Delayed gratification (proposed)",
      },
    ],
  },
  prototypeNote:
    "IMPORTANT: SniffShift is an early-stage prototype concept only. The images shown are conceptual representations, not photographs of a working product. Functional specifications, materials, dimensions, and performance are prototype targets that have not been verified or tested. This is not a guaranteed solution for all dogs. No purchase will be fulfilled—this is a demonstration storefront for a product concept.",
};

export function getVariantPriceCents(variantId: string): number {
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return product.priceCents;
  return product.priceCents + variant.priceDelta;
}
