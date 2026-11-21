import Link from "next/link";
import { product } from "@/app/lib/product";
import { ProductImage } from "@/components/product-image";

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
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Delayed access. Real enrichment.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-sage-dark max-w-2xl mx-auto leading-relaxed">
            SniffShift is a conceptual puzzle feeder that makes dogs work through
            scent, shifting, and waiting. Presented as a prototype design.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products/sniffshift-original"
              className="flex-1 sm:w-auto px-8 py-4 rounded-full bg-coral text-white text-lg font-semibold hover:bg-coral-dark transition-colors shadow-lg shadow-coral/20"
            >
              Order SniffShift — $34
            </Link>
            <Link
              href="#how-it-works"
              className="flex-1 sm:w-auto px-8 py-4 rounded-full border border-sage-dark text-sage-dark text-lg font-semibold hover:bg-cream-dark transition-colors"
            >
              How it works
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-cream-dark">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="mt-4 text-sage-dark">
                Three proposed stages, delayed access, conceptual engagement.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {product.mechanism.stages.map((stage) => (
                <div
                  key={stage.number}
                  className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-cream-dark"
                >
                  <div className="w-14 h-14 rounded-full bg-coral text-white flex items-center justify-center mb-6 text-xl font-mono">
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

        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative bg-sage/10 p-8 rounded-2xl border border-sage/20 text-center">
                  <ProductImage size="large" />
                  <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-inner border-4 border-sage"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  A puzzle feeder concept, not just a toy
                </h2>
                <p className="text-sage-dark text-lg leading-relaxed mb-6">
                  SniffShift uses proposed delayed access to extend feeding time
                  and engage your dog's natural foraging instincts. No instant
                  treats—your dog earns them through scent, shifting, and patience.
                  This is a conceptual design; actual performance has not been
                  verified.
                </p>
                <ul className="space-y-3">
                  {[
                    "Proposed delayed-access release gate",
                    "Proposed scent chamber for treat concealment",
                    "Proposed slider mechanism for paw and nose interaction",
                    "Three size options proposed (Small, Medium, Large)",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-coral font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 bg-cream-dark">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
              FAQ
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-background p-6 rounded-xl border border-cream-dark">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sage-dark text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to enrich?
            </h2>
            <p className="text-sage-dark mb-8">Order your SniffShift today.</p>
            <Link
              href="/products/sniffshift-original"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-coral text-white text-lg font-semibold hover:bg-coral-dark transition-colors shadow-lg shadow-coral/25"
            >
              Order SniffShift — $34
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-sage-dark text-white py-12 border-t border-sage mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-coral font-bold tracking-tight">Sniff</span>
            <span className="font-bold tracking-tight">Shift</span>
          </div>
          <p className="text-sage/40 text-sm">
            Delayed-access dog enrichment. Prototype stage.
          </p>
          <div className="flex gap-4 text-sm text-sage/40">
            <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/products/sniffshift-original#prototype" className="hover:text-white transition-colors">Disclosure</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
