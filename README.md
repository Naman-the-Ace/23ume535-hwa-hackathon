# SniffShift — Premium Dog Enrichment Concept

> **Live Demo:** https://23ume535-hwa-hackathon.vercel.app

A conceptual e-commerce storefront for **SniffShift**, a delayed-access puzzle feeder that makes dogs work through scent, shifting, and waiting — presented as a prototype design, not a finished product.

---

## The Problem

**Dogs eat too fast.** Modern feeding bowls encourage gulping, leading to:
- Bloat and digestive issues
- Boredom and destructive behaviors
- Lack of mental stimulation during mealtime
- Weight gain from rapid consumption

Existing "slow feeders" are static maze bowls — they don't engage a dog's natural foraging sequence (sniff → manipulate → wait). **SniffShift proposes a three-stage delayed-access mechanism** that turns mealtime into an enrichment activity.

---

## The Solution (Concept)

SniffShift is a **conceptual enrichment station** with a proposed three-stage sequence:

| Stage | Action | Purpose |
|-------|--------|---------|
| **01 Sniff & Locate** | Dog sniffs coral scent chamber to locate hidden kibble | Engages olfactory sense, builds anticipation |
| **02 Shift & Align** | Dog slides dual sage sliders with paws/nose to align release path | Physical manipulation, problem-solving |
| **03 Wait & Release** | Timed gate opens after correct alignment, releasing a portion | Delayed gratification, impulse control |

> ⚠️ **Concept Simulation** — All visuals and interactions are illustrative. No functional product exists. Performance has not been verified.

---

## Feature Highlights

### 🎨 Premium Visual Identity
- **Custom concept illustrations** (6 scenes: hero, top, side, cutaway, in-use, mechanism) rendered as AVIF/WebP/PNG
- **Cohesive color system**: Cream `#FBFAF5` · Sage `#9FB08A` · Coral `#E76F51` · Deep Green `#2D3A2E`
- **Responsive typography** with fluid scaling, reduced-motion support

### 🛍️ Complete E-Commerce Flow
- **Product page** with 5-image interactive gallery, variant selection (Small/Medium/Large), quantity controls
- **Cart** with live quantity updates, tax (8%) display, free shipping
- **Demo checkout** with 8-field form, idempotency keys, order confirmation page
- **Order API** with idempotency-key deduplication (check-then-write via Vercel Blob)

### 🎮 Interactive Mechanism Demo
- **Sniff stage**: Click/tap the scent chamber to advance; animated scent waves from coral chamber
- **Shift stage**: Dual keyboard-accessible sliders (Arrow keys, Home/End) — both must reach 100%
- **Wait stage**: Timed gate animation → treat release
- **Reset / Replay** controls, full keyboard support, "Concept simulation" badge

### ✨ 3D-Style Hero Interaction
- **Pointer-controlled tilt** (max 5°) with smooth return-to-center
- **Subtle glare effect** tracking cursor position
- **Touch support** for mobile
- **Respects `prefers-reduced-motion`** — instantly disables all motion

### ♿ Accessibility
- Semantic HTML5, ARIA labels/roles throughout
- Focus-visible outlines (coral), focus management
- Keyboard navigation for all interactive elements
- Sufficient contrast ratios (WCAG AA)
- `alt` text on all images, `figcaption` disclosures

---

## Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 16 (App Router)                │
├─────────────────────────────────────────────────────────────┤
│  Frontend                                                   │
│  ├── React 19 + TypeScript                                  │
│  ├── Tailwind CSS v4 (CSS-first, design tokens in :root)   │
│  ├── Client components for cart, checkout, mechanism demo  │
│  └── HeroTilt / MechanismDemo — zero-dependency animations │
├─────────────────────────────────────────────────────────────┤
│  Backend (Serverless Functions)                             │
│  ├── POST /api/order      — Create order (idempotent)       │
│  ├── GET  /api/order/[id] — Retrieve order (no PII leak)   │
│  └── Vercel Blob storage  — Check-then-write, concurrency  │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                             │
│  ├── Vercel (edge deployment, zero config)                 │
│  └── CDP-based browser tests (desktop + mobile viewports)  │
└─────────────────────────────────────────────────────────────┘
```

### Key Dependencies
| Package | Purpose |
|---------|---------|
| `next@16` | React framework (Turbopack, App Router) |
| `tailwindcss@4` | Utility-first CSS with design tokens |
| `zod` | Runtime validation for order payloads |
| `@vercel/blob` | Serverless blob storage for orders |
| `sharp` | SVG → AVIF/WebP/PNG asset generation |

---

## Local Development

### Prerequisites
- Node.js 22+
- npm (or yarn/pnpm)

### Setup
```bash
# Clone & install
git clone https://github.com/Naman-the-Ace/23ume535-hwa-hackathon.git
cd 23ume535-hwa-hackathon
npm install

# Generate product assets (optional — already committed)
node scripts/generate-product-images.mjs

# Start dev server
npm run dev
```

Open http://localhost:3000

### Available Scripts
```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint (zero errors required)
npm run typecheck    # TypeScript --noEmit
```

### Generate Product Assets
```bash
node scripts/generate-product-images.mjs
# Outputs 30 files to public/images/product/
# hero|top|side|cutaway|in-use|mechanism × {png,webp,avif} + -sm variants
```

---

## Demo Workflow

1. **Landing** → Hero with 3D tilt interaction, CTA to product
2. **Product Page** → 5-image gallery, select size/quantity, "Add to Demo Order"
3. **Cart** → Review items, see tax (8%) + free shipping, "Proceed to Checkout"
4. **Checkout** → Fill 8-field form, "Place Demo Order"
5. **Confirmation** → Order ID `SS-YYYYMMDD-XXXXXXXX`, order number `SNIF-XXXXXXXX`
6. **Refresh** → Order persists (localStorage cart + server order record)
7. **Mechanism Demo** → Interactive Sniff→Shift→Wait simulation (homepage & product page)

> **No real payment is collected.** All orders are demo records stored in Vercel Blob.

---

## Limitations & Known Constraints

| Area | Limitation |
|------|------------|
| **Product Reality** | SniffShift is a **concept only** — no physical prototype, no manufacturing, no fulfillment |
| **Performance Claims** | "Delayed access extends feeding time" is **unverified** — stated as proposed mechanism only |
| **Local API** | `POST /api/order` returns 500 on localhost (Vercel Blob OIDC requires deployed environment) — works in production |
| **Single Product** | Only one SKU (`sniffshift-original`) with three size variants |
| **No Auth** | Demo checkout uses sessionStorage idempotency keys, no user accounts |
| **Blob Concurrency** | Vercel Blob has no native transactions — uses idempotency keys + check-then-write |
| **Images** | All product visuals are **AI-generated concept illustrations** (SVG → sharp → AVIF/WebP), not photographs |

---

## Project Structure

```
├── app/
│   ├── api/order/           # Order API (POST, GET)
│   ├── cart/                # Cart page
│   ├── checkout/            # Demo checkout form
│   ├── order/[id]/          # Order confirmation
│   ├── products/[slug]/     # Product detail page
│   ├── globals.css          # Tailwind v4 + design tokens
│   ├── layout.tsx           # Root layout + providers
│   └── page.tsx             # Homepage with hero, demo, FAQ
├── components/
│   ├── hero-tilt.tsx        # 3D pointer tilt (zero-dep)
│   ├── mechanism-demo.tsx   # Interactive Sniff→Shift→Wait
│   ├── product-image.tsx    # Responsive <picture> + disclosure
│   ├── cart-provider.tsx    # Cart context + localStorage
│   ├── cart-drawer.tsx      # Slide-over cart
│   ├── header.tsx           # Nav + logo + cart button
│   ├── button.tsx           # Primary/secondary button
│   └── not-found.tsx        # 404 page
├── app/lib/
│   ├── product.ts           # Product data (single source)
│   └── orders.ts            # Order helpers (ids, formatting)
├── scripts/
│   └── generate-product-images.mjs  # Sharp asset pipeline
├── public/images/product/   # 30 generated assets (committed)
├── .vercel/                 # Vercel project config
├── vercel.json              # Framework override
└── README.md                # This file
```

---

## Quality Checklist (Pre-Deploy)

- [x] `npm run lint` — 0 errors
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — Successful production build
- [x] Desktop browser tests (1440px) — 17/18 pass (1 expected local API 500)
- [x] Mobile browser tests (390px) — 19/20 pass (1 expected local API 500)
- [x] Viewports verified: 360, 390, 768, 1440px
- [x] No horizontal overflow at any breakpoint
- [x] Keyboard navigation: all interactive elements reachable
- [x] Focus visible: coral outline on all focusable elements
- [x] Contrast: WCAG AA compliant (verified manually)
- [x] Reduced motion: all animations disable via media query
- [x] 404 for unknown product slugs (`notFound()`)
- [x] No broken links (internal anchors resolve)
- [x] Demo wording consistent across cart/checkout/confirmation

---

## Deployment

```bash
# Push to main → auto-deploys to Vercel
git push origin main

# Or manual production deploy
npm run build && vercel --prod
```

**Production URL:** https://23ume535-hwa-hackathon.vercel.app

---

## License & Attribution

This project was built for the **Happy While Away Web Design Hackathon**.

- **Concept & Design:** Original work for hackathon entry
- **Code:** Written with OpenCode (open-source models only)
- **Images:** Generated via custom Sharp pipeline (SVG → AVIF/WebP/PNG)
- **Fonts:** Geist (Vercel) — self-hosted via `next/font`
- **Icons:** Inline SVG (zero external dependencies)

> **No paid/closed models, no Copilot/Cursor/Claude Code, no external prompts or skills used.** All code authored during the hackathon window.

---

*SniffShift — Delayed access. Real enrichment. (Concept only.)*