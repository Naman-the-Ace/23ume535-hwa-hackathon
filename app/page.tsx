import Link from "next/link";
import { product } from "@/app/lib/product";
import { ProductImage } from "@/components/product-image";
import { MechanismDemo } from "@/components/mechanism-demo";
import { HeroTilt } from "@/components/hero-tilt";

const faqs = [
  {
    q: "What is SniffShift?",
    a: "SniffShift is a conceptual delayed-access enrichment station for dogs. It uses a proposed three-stage mechanism—sniff, shift, wait—to present a puzzle-feeding concept rather than instant treat access.",
  },
  {
    q: "How does the three-stage process work?",
    a: "Proposed: first, your dog sniffs the scent chamber to locate food. Second, they shift internal sliders with their paws and nose to align the release path. Third, they wait for the timed gate to open, which delays access. Actual performance has not been verified.",
  },
  {
    q: "Is SniffShift suitable for all dog sizes?",
    a: "SniffShift comes in Small, Medium, and Large sizes as a prototype concept. The right size depends on your dog's breed, snout length, and paw size. Supervise initial use to ensure your dog can engage with the mechanism.",
  },
  {
    q: "How do I clean SniffShift?",
    a: "Hand wash only with warm, soapy water. Do not place in the dishwasher or submerge in water. Dry thoroughly before reuse.",
  },
  {
    q: "Is SniffShift a finished product?",
    a: "No. SniffShift is an early-stage prototype. The images are conceptual representations, and specifications may change before final production. Some dogs may not engage with the delayed-access mechanism.",
  },
  {
    q: "Does SniffShift slow down fast eaters?",
    a: "The delayed-access design is proposed to extend feeding time by requiring your dog to work through three stages before food is released. Results vary by dog—some may learn quickly, others may need more time or may not engage at all. This has not been verified.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7 animate-fade-in-up">
                <span className="inline-block text-coral font-bold text-sm tracking-wider uppercase mb-4">
                  Dog Enrichment Concept
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                  Delayed access.<br />Real enrichment.
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-sage-dark mb-10 max-w-2xl leading-relaxed">
                  SniffShift is a conceptual puzzle feeder that makes dogs work
                  through scent, shifting, and waiting. Presented as a prototype
                  design — not a finished product.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products/sniffshift-original"
                    className="w-full sm:w-auto px-10 py-5 rounded-full bg-coral text-white text-lg font-semibold hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/25 btn-lift text-center"
                  >
                    Order SniffShift — $34
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="w-full sm:w-auto px-10 py-5 rounded-full border-2 border-sage-dark text-sage-dark text-lg font-semibold hover:bg-cream-dark transition-all duration-300 text-center"
                  >
                    How it works
                  </Link>
                </div>
                <p className="mt-6 text-sm text-sage-dark/60 italic">
                  Prototype concept — specifications and performance not verified
                </p>
              </div>
              <div className="lg:col-span-5 relative animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="relative aspect-square w-full max-w-lg mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-coral/20 via-transparent to-sage/20 rounded-3xl blur-2xl opacity-50" />
                  <div className="relative bg-cream/50 backdrop-blur-sm rounded-3xl border border-sage/20 p-2 shadow-2xl shadow-sage/10">
                    <HeroTilt maxTilt={5} perspective={1200} scale={1.015} maxGlare={0.12}>
                      <ProductImage variant="hero" width={520} height={520} className="mx-auto" showDisclosure={false} />
                    </HeroTilt>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-28 bg-cream-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="mt-4 text-sage-dark max-w-2xl mx-auto">
                Three proposed stages, delayed access, conceptual engagement.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {product.mechanism.stages.map((stage, idx) => (
                <div
                  key={stage.number}
                  className={`flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-cream-dark hover:border-coral/30 transition-all duration-300 animate-stage ${idx === 0 ? "animate-delay-100" : idx === 1 ? "animate-delay-200" : "animate-delay-300"}`}
                >
                  <div className="w-14 h-14 rounded-full bg-coral text-white flex items-center justify-center mb-6 text-xl font-mono shadow-md shadow-coral/20">
                    {stage.number}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{stage.title}</h3>
                  <p className="text-sage-dark text-sm leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">
              Proposed mechanism sequence
            </h2>
            <div className="relative max-w-full">
              <ProductImage
                variant="mechanism"
                width={1200}
                height={627}
                className="mx-auto rounded-2xl shadow-xl shadow-sage/10 max-w-full"
                showDisclosure={true}
              />
            </div>
          </div>
        </section>

        <section className="py-28 bg-cream-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="relative bg-sage/5 rounded-2xl border border-sage/20 p-4 shadow-xl shadow-sage/10 max-w-full">
                  <ProductImage variant="detail" width={560} height={560} className="mx-auto max-w-full" showDisclosure={false} />
                </div>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  A puzzle feeder concept, not just a toy
                </h2>
                <p className="text-sage-dark text-lg leading-relaxed mb-8 max-w-xl">
                  SniffShift uses proposed delayed access to extend feeding time
                  and engage your dog&apos;s natural foraging instincts. No instant
                  treats—your dog earns them through scent, shifting, and patience.
                  This is a conceptual design; actual performance has not been
                  verified.
                </p>
                <ul className="space-y-4">
                  {[
                    "Proposed delayed-access release gate",
                    "Proposed scent chamber for treat concealment",
                    "Proposed slider mechanism for paw and nose interaction",
                    "Three size options proposed (Small, Medium, Large)",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-4">
                      <span className="text-coral font-bold text-xl mt-0.5 shrink-0">✓</span>
                      <span className="text-foreground text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-28 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Designed for curious dogs
                </h2>
                <p className="text-sage-dark text-lg leading-relaxed mb-8 max-w-xl">
                  Every interaction with SniffShift is an opportunity for mental
                  stimulation. Your dog sniffs, shifts, and waits — turning
                  mealtime into enrichment.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Engages natural foraging instincts",
                    "Proposed to extend feeding duration",
                    "Three size options for different breeds",
                    "Supervised introduction recommended",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sage-dark">
                      <span className="text-coral font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products/sniffshift-original"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-coral text-white text-base font-semibold hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/25 btn-lift"
                >
                  View Product →
                </Link>
              </div>
              <div className="relative animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <div className="relative bg-sage/5 rounded-2xl border border-sage/20 p-4 shadow-xl shadow-sage/10 max-w-full">
                  <ProductImage variant="in-use" width={560} height={560} className="mx-auto max-w-full" showDisclosure={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-28 bg-cream-dark">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
              FAQ
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-background p-6 rounded-xl border border-cream-dark hover:border-sage-dark/30 transition-all duration-300">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sage-dark text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MechanismDemo />

        <section className="py-28 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-2xl animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Ready to enrich?
            </h2>
            <p className="text-sage-dark mb-8 text-lg">Order your SniffShift today.</p>
            <Link
              href="/products/sniffshift-original"
              className="inline-flex items-center justify-center gap-2 px-12 py-5 rounded-full bg-coral text-white text-lg font-semibold hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/25 btn-lift"
            >
              Order SniffShift — $34
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-sage-dark text-white py-12 border-t border-sage mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-coral font-bold tracking-tight">Sniff</span>
            <span className="font-bold tracking-tight">Shift</span>
          </div>
          <p className="text-sage/40 text-sm">
            Delayed-access dog enrichment. Prototype stage.
          </p>
          <div className="flex gap-4 text-sm text-sage/40">
            <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/products/sniffshift-original#prototype" className="hover:text-white transition-colors">Disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}