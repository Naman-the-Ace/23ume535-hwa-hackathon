"use client";

import { useState, useCallback, useEffect, useRef, KeyboardEvent, MouseEvent, TouchEvent } from "react";

type Stage = "sniff" | "shift" | "wait" | "complete";

const STAGE_LABELS: Record<Exclude<Stage, "complete">, string> = {
  sniff: "Sniff & Locate",
  shift: "Shift & Align",
  wait: "Wait & Release",
};

function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MechanismDemo() {
  const [stage, setStage] = useState<Stage>("sniff");
  const [slider1Pos, setSlider1Pos] = useState(0);
  const [slider2Pos, setSlider2Pos] = useState(0);
  const [treatVisible, setTreatVisible] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [scentWaves, setScentWaves] = useState<number[]>([]);
  const [reducedMotion] = useState(getInitialReducedMotion);

  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const shouldShowWaves = stage === "sniff" && !reducedMotion;

  useEffect(() => {
    if (!shouldShowWaves) return;
    const waves: number[] = [];
    const interval = setInterval(() => {
      waves.push(Date.now());
      if (waves.length > 3) waves.shift();
      setScentWaves([...waves]);
    }, 800);
    return () => clearInterval(interval);
  }, [shouldShowWaves]);

  useEffect(() => {
    if (stage === "shift" && slider1Pos >= 100 && slider2Pos >= 100) {
      const timer = setTimeout(() => setStage("wait"), 600);
      return () => clearTimeout(timer);
    }
  }, [slider1Pos, slider2Pos, stage]);

  useEffect(() => {
    if (stage === "wait") {
      const timer = setTimeout(() => {
        setGateOpen(true);
        setTreatVisible(true);
        setTimeout(() => setStage("complete"), 1500);
      }, prefersReducedMotionRef.current ? 500 : 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleSliderChange = useCallback(
    (slider: 1 | 2, value: number) => {
      if (stage !== "shift") return;
      if (slider === 1) setSlider1Pos(value);
      else setSlider2Pos(value);
    },
    [stage]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, slider: 1 | 2) => {
      if (stage !== "shift") return;
      const step = 10;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        handleSliderChange(slider, Math.min(100, (slider === 1 ? slider1Pos : slider2Pos) + step));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        handleSliderChange(slider, Math.max(0, (slider === 1 ? slider1Pos : slider2Pos) - step));
      } else if (e.key === "Home") {
        e.preventDefault();
        handleSliderChange(slider, 0);
      } else if (e.key === "End") {
        e.preventDefault();
        handleSliderChange(slider, 100);
      }
    },
    [stage, slider1Pos, slider2Pos, handleSliderChange]
  );

  const handleScentChamberClick = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (stage === "sniff") {
        setStage("shift");
      }
    },
    []
  );

  const handleScentChamberKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (stage === "sniff") {
          setStage("shift");
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStage("sniff");
    setSlider1Pos(0);
    setSlider2Pos(0);
    setTreatVisible(false);
    setGateOpen(false);
    setScentWaves([]);
  }, []);

  const replay = useCallback(() => {
    reset();
    setTimeout(() => setStage("sniff"), 100);
  }, []);

  const currentStageIndex = ["sniff", "shift", "wait"].indexOf(stage);
  const isComplete = stage === "complete";

  return (
    <section
      id="mechanism-demo"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-cream-dark"
      aria-labelledby="demo-title"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 id="demo-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Interactive Mechanism Demo
          </h2>
          <p className="text-sage-dark text-lg max-w-2xl mx-auto mb-6">
            Experience the proposed three-stage sequence. Click the scent chamber to begin, then use the sliders to align the mechanism,
            then watch the treat release. Keyboard accessible — use Arrow keys, Home, End.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sage/20 text-sage-dark border border-sage/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
            </span>
            Concept simulation — not a functional product
          </span>
        </div>

        <div className="relative">
          <div className="mb-8 flex items-center justify-center gap-4 flex-wrap" role="tablist" aria-label="Mechanism stages">
            {(["sniff", "shift", "wait"] as const).map((s, i) => (
              <button
                key={s}
                role="tab"
                aria-selected={stage === s || (isComplete && i === 2)}
                aria-controls={`panel-${s}`}
                id={`tab-${s}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  stage === s || (isComplete && i === 2)
                    ? "bg-coral text-white shadow-md shadow-coral/30"
                    : i < currentStageIndex || isComplete
                    ? "bg-sage text-white"
                    : "bg-cream-dark text-sage-dark border border-cream-dark"
                }`}
                disabled={isComplete}
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-xs font-mono">
                  {i + 1}
                </span>
                <span>{STAGE_LABELS[s]}</span>
              </button>
            ))}
          </div>

          <div
            ref={containerRef}
            className="relative bg-background rounded-2xl border border-cream-dark p-6 sm:p-8 min-h-[420px]"
            role="tabpanel"
            aria-labelledby={`tab-${stage}`}
          >
            <div className="relative max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-sage/20 rounded-full" />
                </div>

                <div className="relative flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-cream-dark flex items-center justify-center border border-cream-dark shadow-sm relative z-10 transition-all duration-300" style={{ transform: stage === "sniff" ? "scale(1.05)" : "scale(1)" }}>
                    <svg className="w-8 h-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2H15a2.5 2.5 0 002.5-2.5V3.935M8 3.935c0-.61.825-1.106 1.485-1.188.108-.014.217-.014.325 0C9.825 2.829 10.65 3.325 10.65 3.935V5.5" />
                    </svg>
                  </div>

                  <div className="flex-1 max-w-xs relative">
                    <label htmlFor="slider-1" className="sr-only">Slider 1 - Left alignment</label>
                    <input
                      id="slider-1"
                      type="range"
                      min={0}
                      max={100}
                      value={slider1Pos}
                      onChange={(e) => handleSliderChange(1, Number(e.target.value))}
                      onKeyDown={(e) => handleKeyDown(e, 1)}
                      disabled={stage !== "shift"}
                      className="w-full h-2 appearance-none bg-sage/20 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-background [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-coral [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-coral [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      aria-label="Slider 1 - Left alignment"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={slider1Pos}
                    />
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-cream-dark flex items-center justify-center border border-cream-dark shadow-sm relative z-10 transition-all duration-300" style={{ transform: stage === "sniff" ? "scale(1.05)" : "scale(1)" }}>
                    <svg className="w-8 h-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2H15a2.5 2.5 0 002.5-2.5V3.935M8 3.935c0-.61.825-1.106 1.485-1.188.108-.014.217-.014.325 0C9.825 2.829 10.65 3.325 10.65 3.935V5.5" />
                    </svg>
                  </div>

                  <div className="flex-1 max-w-xs relative">
                    <label htmlFor="slider-2" className="sr-only">Slider 2 - Right alignment</label>
                    <input
                      id="slider-2"
                      type="range"
                      min={0}
                      max={100}
                      value={slider2Pos}
                      onChange={(e) => handleSliderChange(2, Number(e.target.value))}
                      onKeyDown={(e) => handleKeyDown(e, 2)}
                      disabled={stage !== "shift"}
                      className="w-full h-2 appearance-none bg-sage/20 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-background [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-coral [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-coral [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      aria-label="Slider 2 - Right alignment"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={slider2Pos}
                    />
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-cream-dark flex items-center justify-center border border-cream-dark shadow-sm relative z-10">
                    <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex gap-2 pointer-events-none"
                  aria-hidden="true"
                  role="button"
                  tabIndex={0}
                  onClick={handleScentChamberClick}
                  onKeyDown={handleScentChamberKeyDown}
                  onTouchStart={handleScentChamberClick}
                  aria-label="Scent chamber - click to start the mechanism"
                  aria-pressed={stage !== "sniff"}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br from-coral to-coral-light border-4 border-coral/30 relative transition-all duration-300 ${stage === "sniff" ? "animate-pulse" : "scale-95"}`}
                    style={{ transform: stage === "sniff" ? "scale(1)" : "scale(0.9)" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2H15a2.5 2.5 0 002.5-2.5V3.935M8 3.935c0-.61.825-1.106 1.485-1.188.108-.014.217-.014.325 0C9.825 2.829 10.65 3.325 10.65 3.935V5.5" />
                      </svg>
                    </div>
                    {stage === "sniff" && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-coral rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-xs text-white font-bold">1</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex gap-2 pointer-events-none" aria-hidden="true">
                    {scentWaves.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border-2 border-coral/50 ${reducedMotion ? "opacity-0" : "animate-pulse"}`}
                        style={{ animationDelay: `${i * 300}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative min-h-[180px] flex items-center justify-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <div className="relative">
                    <div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-t from-coral/30 to-transparent rounded-full blur-xl transition-opacity duration-500 ${treatVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    />
                    <div
                      className={`relative w-32 h-32 mx-auto rounded-xl bg-gradient-to-b from-coral/10 to-coral/5 border-2 border-coral/30 flex items-end justify-center p-4 transition-all duration-700 ease-out ${gateOpen ? "translate-y-4 scale-110" : ""}`}
                      role="status"
                      aria-live="polite"
                      aria-label={gateOpen ? "Treat released!" : "Treat chamber"}
                    >
                      <div className="w-full h-16 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full relative overflow-hidden" style={{ transformOrigin: "bottom" }}>
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-500/30 rounded-full" />
                      </div>
                    </div>
                    <div
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-4 bg-sage rounded-t-lg transition-transform duration-500 ease-out ${gateOpen ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
                      aria-hidden="true"
                    >
                      <div className="w-full h-full bg-gradient-to-r from-sage via-sage-dark to-sage rounded-t-lg" />
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-sage-dark font-medium" aria-live="polite">
                      {stage === "sniff" && "Click the scent chamber to locate the treat"}
                      {stage === "shift" && "Align both sliders to open the release path"}
                      {stage === "wait" && "Wait for the timed gate to open..."}
                      {isComplete && "Treat released! The delayed-access sequence is complete."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                disabled={stage === "sniff" && slider1Pos === 0 && slider2Pos === 0 && !treatVisible}
                className="flex-1 sm:w-auto px-6 py-3 rounded-xl border border-sage-dark/30 text-sage-dark font-medium hover:bg-cream-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2"
              >
                Reset
              </button>
              <button
                onClick={replay}
                className="flex-1 sm:w-auto px-6 py-3 rounded-xl bg-coral text-white font-medium hover:bg-coral-dark shadow-md shadow-coral/25 transition-all duration-200 btn-lift focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
              >
                Replay
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-sage-dark/70">
            <p>Keyboard: <kbd className="px-1.5 py-0.5 bg-cream-dark rounded text-sage-dark font-mono">←</kbd> / <kbd className="px-1.5 py-0.5 bg-cream-dark rounded text-sage-dark font-mono">→</kbd> move slider • <kbd className="px-1.5 py-0.5 bg-cream-dark rounded text-sage-dark font-mono">Home</kbd> / <kbd className="px-1.5 py-0.5 bg-cream-dark rounded text-sage-dark font-mono">End</kbd> jump to start/end</p>
          </div>
        </div>
      </div>
    </section>
  );
}