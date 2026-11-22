"use client";

type ProductImageVariant =
  | "hero"
  | "detail"
  | "in-use"
  | "side"
  | "top"
  | "mechanism";

interface ProductImageProps {
  variant?: ProductImageVariant;
  className?: string;
  width?: number | string;
  height?: number | string;
  showDisclosure?: boolean;
}

const variantMap: Record<ProductImageVariant, { file: string; alt: string; title: string }> = {
  hero: {
    file: "hero",
    alt: "SniffShift Enrichment Station — front-three-quarter concept view showing cream body, sage slider bar and knobs, coral scent chamber, and dark green grip base",
    title: "SniffShift Enrichment Station — Hero View",
  },
  detail: {
    file: "cutaway",
    alt: "Cutaway concept illustration revealing internal treat chamber, slider rail, release gate, and sage control components",
    title: "SniffShift — Internal Mechanism Cutaway",
  },
  "in-use": {
    file: "in-use",
    alt: "Concept illustration of a dog sniffing the coral scent chamber with front paw resting on the floor beside the station",
    title: "SniffShift — Dog Interaction Concept",
  },
  side: {
    file: "side",
    alt: "Side profile concept view showing the cylindrical form, top rim, and scent chamber placement",
    title: "SniffShift — Side Profile View",
  },
  top: {
    file: "top",
    alt: "Top-down concept view displaying the scent chamber, dual sage slider knobs, and release gate arrangement",
    title: "SniffShift — Top-Down View",
  },
  mechanism: {
    file: "mechanism",
    alt: "Three-panel concept sequence: sniff & locate, shift & align, wait & release — proposed delayed-access mechanism",
    title: "SniffShift — Proposed Mechanism Sequence",
  },
};

export function ProductImage({
  variant = "hero",
  className = "",
  width = 400,
  height = 400,
  showDisclosure = true,
}: ProductImageProps) {
  const { file, alt, title } = variantMap[variant];
  const basePath = `/images/product/${file}`;

  const srcSetAvif = `${basePath}-sm.avif 800w, ${basePath}.avif 1600w`;
  const srcSetWebp = `${basePath}-sm.webp 800w, ${basePath}.webp 1600w`;

  const imgWidth = typeof width === "number" ? width : 400;
  const imgHeight = typeof height === "number" ? height : 400;

  return (
    <figure className={`relative ${className}`} style={{ width: "100%", height: "auto" }}>
      <picture>
        <source
          type="image/avif"
          srcSet={srcSetAvif}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
        <source
          type="image/webp"
          srcSet={srcSetWebp}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
        <img
          src={`${basePath}.png`}
          alt={alt}
          width={imgWidth}
          height={imgHeight}
          loading={variant === "hero" ? "eager" : "lazy"}
          decoding="async"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "16px",
          }}
        />
      </picture>
      {showDisclosure && (
        <figcaption className="absolute bottom-2 left-2 right-2 text-xs text-sage-dark/70 bg-cream/90 backdrop-blur-sm px-2 py-1 rounded text-center">
          Concept illustration — not a photograph of a finished product
        </figcaption>
      )}
      <title>{title}</title>
    </figure>
  );
}