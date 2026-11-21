import Link from "next/link";

const stages = [
  {
    number: "01",
    title: "Sniff & Discover",
    description: "Your dog investigates the new scent and texture, engaging natural curiosity.",
  },
  {
    number: "02",
    title: "Shift & Engage",
    description: "Paws and nose work together to unlock the hidden treat inside.",
  },
  {
    number: "03",
    title: "Thrive & Relax",
    description: "Mental stimulation leaves your dog satisfied, calm, and happy.",
  },
];

const faqs = [
  {
    q: "What is SniffShift?",
    a: "SniffShift is a single-product dog enrichment toy designed to turn mealtime into a mental workout. It engages your dog's natural foraging instincts with a hidden treat compartment.",
  },
  {
    q: "How does the 3-stage process work?",
    a: "First, your dog sniffs and discovers the toy. Second, they shift and engage with their paws and nose to unlock treats. Third, they thrive and relax from the mental stimulation.",
  },
  {
    q: "Is it safe for all dog sizes?",
    a: "Yes. SniffShift comes in Small, Medium, and Large variants and is suitable for all breeds and sizes. It's made from BPA-free, non-toxic, food-grade silicone.",
  },
  {
    q: "How do I clean it?",
    a: "SniffShift is dishwasher safe (top rack). You can also rinse it with warm water after each use. Inspect regularly for wear and replace if damaged.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes, all SniffShift orders ship free within the contiguous United States.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Enrich every day.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-sage-dark max-w-2xl mx-auto leading-relaxed">
            The single enrichment toy that turns mealtime into a mental workout. Designed for
            curious dogs who love to sniff, shift, and solve.
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
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
              <p className="mt-4 text-sage-dark">Three simple stages, endless enrichment.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {stages.map((stage) => (
                <div
                  key={stage.number}
                  className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-cream-dark"
                >
                  <div className="w-14 h-14 rounded-full bg-coral text-white flex items-center justify-center mb-6 text-xl font-mono">
                    {stage.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                  <p className="text-sage-dark text-sm leading-relaxed">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-coral/10 rounded-2xl blur-[80px]"></div>
                <div className="relative bg-sage/10 p-8 rounded-2xl border border-sage/20 text-center">
                  <div className="text-6xl mb-4">🦴</div>
                  <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-inner border-4 border-sage"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">One toy. Every dog.</h2>
                <p className="text-sage-dark text-lg leading-relaxed mb-6">
                  SniffShift is crafted from durable, non-toxic materials with a hidden treat
                  compartment that challenges your dog's mind and slows fast eating.
                </p>
                <ul className="space-y-3">
                  {[
                    "Mental stimulation for bored pups",
                    "Slows down fast eaters",
                    "Easy to clean, dishwasher safe",
                    "All sizes & breeds welcome",
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">FAQ</h2>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to enrich?</h2>
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
            Premium dog enrichment. Designed for happy tails.
          </p>
          <div className="flex gap-4 text-sm text-sage/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
