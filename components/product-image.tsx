"use client";

export function ProductImage({
  className = "",
  size = "large",
}: {
  className?: string;
  size?: "small" | "large";
}) {
  const w = size === "small" ? 20 : 64;
  const h = size === "small" ? 20 : 64;
  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SniffShift enrichment station"
      role="img"
    >
      {/* Base */}
      <rect
        x="2"
        y="14"
        width="20"
        height="6"
        rx="3"
        fill="#F1EFE4"
        stroke="#9FB08A"
        strokeWidth="1.5"
      />
      {/* Body */}
      <rect
        x="4"
        y="8"
        width="16"
        height="8"
        rx="2"
        fill="#E7E3D4"
        stroke="#6B8A67"
        strokeWidth="1.5"
      />
      {/* Scent chamber */}
      <circle cx="12" cy="10" r="2.5" fill="#E76F51" opacity="0.9" />
      {/* Slider tracks */}
      <rect x="6" y="13" width="4" height="1" fill="#C9C2B3" rx="0.5" />
      <rect x="14" y="13" width="4" height="1" fill="#C9C2B3" rx="0.5" />
      {/* Release gate */}
      <rect x="10" y="16" width="4" height="2" rx="1" fill="#9FB08A" />
    </svg>
  );
}
