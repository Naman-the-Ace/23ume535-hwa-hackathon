"use client";

type ProductImageVariant = "hero" | "detail" | "in-use";

interface ProductImageProps {
  variant?: ProductImageVariant;
  className?: string;
  width?: number;
  height?: number;
}

export function ProductImage({
  variant = "hero",
  className = "",
  width = 400,
  height = 400,
}: ProductImageProps) {
  const configs: Record<ProductImageVariant, { title: string; desc: string }> = {
    hero: {
      title: "SniffShift Enrichment Station — Hero View",
      desc: "Premium concept illustration of the SniffShift delayed-access puzzle feeder showing cream body, sage accents, coral scent chamber, and sage grip feet from a front-three-quarter perspective.",
    },
    detail: {
      title: "SniffShift — Internal Mechanism Close-up",
      desc: "Detailed concept close-up showing the internal slider gates, release mechanism, alignment markers, and treat chamber with premium materials and construction details.",
    },
    "in-use": {
      title: "SniffShift — Dog Interaction Concept",
      desc: "Concept illustration showing a dog's nose and paws engaging with the SniffShift enrichment station during the sniff, shift, and wait stages of the delayed-access mechanism.",
    },
  };
  const config = configs[variant];

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={config.title}
      tabIndex={0}
    >
      <title>{config.title}</title>
      <desc>{config.desc}</desc>
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FBFAF5" }} />
          <stop offset="100%" style={{ stopColor: "#F1EFE4" }} />
        </linearGradient>
        <linearGradient id="mechGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#9FB08A" }} />
          <stop offset="100%" style={{ stopColor: "#6B8A67" }} />
        </linearGradient>
        <linearGradient id="coralGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#E76F51" }} />
          <stop offset="100%" style={{ stopColor: "#C0563D" }} />
        </linearGradient>
        <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#9FB08A" }} />
          <stop offset="100%" style={{ stopColor: "#6B8A67" }} />
        </linearGradient>
        <linearGradient id="bodyShade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#E7E3D4", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#E7E3D4", stopOpacity: 0.4 }} />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.15" />
        </filter>
        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.25" />
        </filter>
      </defs>

      {/* Hero view: full device from front-three-quarter angle */}
      {variant === "hero" && (
        <>
          {/* Cast shadow */}
          <ellipse cx="12" cy="18.5" rx="7" ry="1.5" fill="#000" opacity="0.08" />

          {/* Base platform */}
          <rect x="5" y="14" width="14" height="6" rx="3" fill="url(#bodyGrad)" stroke="#C9C2B3" strokeWidth="1" />

          {/* Main body */}
          <rect
            x="7"
            y="8"
            width="10"
            height="8"
            rx="2"
            fill="url(#bodyShade)"
            stroke="#6B8A67"
            strokeWidth="1.5"
            filter="url(#dropShadow)"
          />

          {/* Top ridge/detail */}
          <path d="M7 8 Q12 6 17 8" fill="none" stroke="#9FB08A" strokeWidth="1.5" />

          {/* Scent chamber (coral accent) */}
          <circle cx="12" cy="10" r="2.5" fill="url(#coralGrad)" opacity="0.95" />
          <circle cx="12" cy="10" r="1.5" fill="#C0563D" />

          {/* Slider tracks */}
          <rect x="6.5" y="13" width="4" height="1.5" rx="0.75" fill="#D8D2C4" />
          <rect x="13.5" y="13" width="4" height="1.5" rx="0.75" fill="#D8D2C4" />

          {/* Release gate */}
          <rect
            x="10"
            y="16.5"
            width="4"
            height="2.5"
            rx="1.25"
            fill="#9FB08A"
            stroke="#6B8A67"
            strokeWidth="1"
          />

          {/* Grip feet */}
          <rect x="6" y="18.5" width="2" height="1.5" rx="0.5" fill="#6B8A67" />
          <rect x="16" y="18.5" width="2" height="1.5" rx="0.5" fill="#6B8A67" />

          {/* Side panel accent */}
          <rect x="6.5" y="8.5" width="1" height="7" rx="0.5" fill="#C9C2B3" opacity="0.6" />
        </>
      )}

      {/* Detail view: internal mechanism close-up */}
      {variant === "detail" && (
        <>
          {/* Cast shadow */}
          <ellipse cx="12" cy="20" rx="8" ry="1.5" fill="#000" opacity="0.08" />

          {/* Base platform */}
          <rect x="3" y="16" width="18" height="6" rx="3" fill="#F1EFE4" stroke="#C9C2B3" strokeWidth="1" />

          {/* Mechanism housing */}
          <rect
            x="5"
            y="10"
            width="14"
            height="8"
            rx="2"
            fill="#E7E3D4"
            stroke="#6B8A67"
            strokeWidth="1.5"
            filter="url(#dropShadow)"
          />

          {/* Slider 1 (left) */}
          <rect x="6.5" y="12" width="3.5" height="3" rx="1" fill="#FFFFFF" stroke="#9FB08A" strokeWidth="1" />
          <rect x="6.5" y="12" width="3.5" height="0.5" rx="0.25" fill="url(#coralGrad)" opacity="0.8" />

          {/* Slider 2 (right) */}
          <rect x="14" y="12" width="3.5" height="3" rx="1" fill="#FFFFFF" stroke="#9FB08A" strokeWidth="1" />
          <rect x="14" y="12" width="3.5" height="0.5" rx="0.25" fill="url(#coralGrad)" opacity="0.8" />

          {/* Release gate */}
          <rect
            x="9"
            y="15.5"
            width="6"
            height="3"
            rx="1.5"
            fill="#9FB08A"
            stroke="#6B8A67"
            strokeWidth="1.5"
          />

          {/* Treat chamber indicator */}
          <circle cx="12" cy="9" r="1.5" fill="url(#coralGrad)" opacity="0.9" />
          <circle cx="12" cy="9" r="0.5" fill="#FFFFFF" opacity="0.6" />

          {/* Alignment markers */}
          <rect x="10" y="13.5" width="1" height="0.5" rx="0.25" fill="#C0563D" />
          <rect x="13" y="13.5" width="1" height="0.5" rx="0.25" fill="#C0563D" />

          {/* Mechanism details */}
          <path d="M5 10 L5 18" fill="none" stroke="#C9C2B3" strokeWidth="1" opacity="0.5" />
          <path d="M19 10 L19 18" fill="none" stroke="#C9C2B3" strokeWidth="1" opacity="0.5" />
        </>
      )}

      {/* In-use view: dog interaction */}
      {variant === "in-use" && (
        <>
          {/* Cast shadow */}
          <ellipse cx="12" cy="19" rx="8" ry="1.5" fill="#000" opacity="0.08" />

          {/* Device base */}
          <rect x="7" y="15" width="10" height="5" rx="2.5" fill="#F1EFE4" stroke="#C9C2B3" strokeWidth="1" />

          {/* Device body */}
          <rect
            x="8.5"
            y="11"
            width="7"
            height="6"
            rx="2"
            fill="#E7E3D4"
            stroke="#6B8A67"
            strokeWidth="1.5"
            filter="url(#dropShadow)"
          />

          {/* Scent chamber */}
          <circle cx="12" cy="11.5" r="2" fill="url(#coralGrad)" opacity="0.95" />

          {/* Dog nose contact */}
          <ellipse cx="12" cy="11.5" rx="1.2" ry="1.8" fill="#E76F51" opacity="0.4" />

          {/* Dog paws contact */}
          <rect x="9.5" y="16" width="1.5" height="1" rx="0.5" fill="#C9C2B3" opacity="0.6" />
          <rect x="13" y="16" width="1.5" height="1" rx="0.5" fill="#C9C2B3" opacity="0.6" />

          {/* Release gate */}
          <rect
            x="9.5"
            y="17"
            width="5"
            height="2"
            rx="1"
            fill="#9FB08A"
            stroke="#6B8A67"
            strokeWidth="1"
          />

          {/* Interaction sparkles */}
          <circle cx="10.5" cy="10.5" r="0.5" fill="url(#coralGrad)" opacity="0.6" />
          <circle cx="13.5" cy="10.5" r="0.3" fill="url(#coralGrad)" opacity="0.4" />
          <circle cx="12" cy="9.5" r="0.4" fill="url(#coralGrad)" opacity="0.5" />

          {/* Motion lines */}
          <path d="M15 9 L17 9" fill="none" stroke="#9FB08A" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M9 9 L7 9" fill="none" stroke="#9FB08A" strokeWidth="1" strokeDasharray="2,2" />
        </>
      )}
    </svg>
  );
}
