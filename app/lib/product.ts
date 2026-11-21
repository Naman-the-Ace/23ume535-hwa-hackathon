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
    "SniffShift is a multi-stage enrichment station that uses delayed access to turn every meal into a problem-solving session. Your dog must sniff out the scent chamber, shift internal sliders to align the release path, and wait for the timed gate to open—extending feeding time and engaging natural foraging instincts.",
  shortDescription:
    "A delayed-access puzzle feeder that makes dogs work for their food through scent, shifting, and waiting.",
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
    "Primary function": "Delayed-access puzzle feeder",
    "Stages": "3 (sniff, shift, wait)",
    "Materials": "Food-safe polymer, silicone grip base",
    "Dimensions": "18 cm x 12 cm x 7 cm",
    "Weight": "280 g",
    "Capacity": "Up to 1 cup of dry kibble or treats",
    "Cleaning": "Hand wash with warm, soapy water",
    "Sizes": "Small, Medium, Large",
  },
  features: [
    "Delayed-access gate extends feeding time",
    "Scent chamber engages natural foraging instincts",
    "Slider mechanism requires paw and nose coordination",
    "Non-slip silicone base stays in place during use",
    "Three size options for different breeds",
  ],
  careInstructions: [
    "Hand wash only with warm, soapy water",
    "Do not submerge in water or place in dishwasher",
    "Supervise your dog during initial introduction",
    "Remove if your dog shows signs of frustration",
    "Inspect regularly for wear and discontinue if damaged",
  ],
  materials: ["Food-safe polymer", "Silicone grip base"],
  isActive: true,
  mechanism: {
    title: "How the delayed-access mechanism works",
    description:
      "SniffShift doesn't give up treats immediately. Your dog works through three physical stages before food is released, turning a 30-second meal into a 10-minute enrichment session.",
    stages: [
      {
        number: "01",
        title: "Sniff & Locate",
        description:
          "Your dog sniffs the scent chamber to locate the hidden kibble inside.",
        action: "Scent detection",
      },
      {
        number: "02",
        title: "Shift & Align",
        description:
          "Using paws and nose, your dog slides internal gates to align the release path.",
        action: "Physical manipulation",
      },
      {
        number: "03",
        title: "Wait & Release",
        description:
          "The timed gate opens only after correct alignment, releasing a small portion.",
        action: "Delayed gratification",
      },
    ],
  },
  prototypeNote:
    "Prototype disclosure: SniffShift is an early-stage prototype design. The images shown are conceptual representations. Functional specifications, materials, and performance may change before final production. Not a guaranteed solution for all dogs—some dogs may require additional training or may not engage with the delayed-access mechanism.",
};

export function getVariantPriceCents(variantId: string): number {
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return product.priceCents;
  return product.priceCents + variant.priceDelta;
}
