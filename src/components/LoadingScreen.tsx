"use client";

import { useCallback, useEffect, useState } from "react";
import { markIntroSeen, revealPage, useIntroSeen } from "@/hooks/useIntro";
import { playBandIntro } from "@/lib/audio";

const INSTRUMENTS = [
  { name: "Έγχορδα", detail: "χρώμα", symbol: "∿", tone: "from-brass-200 to-brass-400" },
  { name: "Πνευστά", detail: "ανάσα", symbol: "◌", tone: "from-cyan-100 to-brass-300" },
  { name: "Κρουστά", detail: "ρυθμός", symbol: "◉", tone: "from-rose-200 to-orange-300" },
  { name: "Πιάνο", detail: "αρμονία", symbol: "⌁", tone: "from-brass-300 to-teal-500" },
];

export default function LoadingScreen() {
  const hidden = useIntroSeen();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (hidden) return;
    document.body.style.overflow = "hidden";
    playBandIntro();

    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const value = Math.min(1, (now - started) / 2800);
      setProgress(Math.round(value * 100));
      setActive(Math.min(INSTRUMENTS.length - 1, Math.floor(value * INSTRUMENTS.length)));
      if (value < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [hidden]);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    revealPage();
    window.setTimeout(markIntroSeen, 700);
  }, [leaving]);

  useEffect(() => {
    if (hidden) return;
    const timeout = window.setTimeout(dismiss, 3600);
    return () => window.clearTimeout(timeout);
  }, [hidden, dismiss]);

  if (hidden) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Μουσική εισαγωγή"
      className={
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink-950 px-6 transition-all duration-700 ease-out " +
        (leaving ? "pointer-events-none -translate-y-full opacity-0" : "")
      }
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(53,183,174,0.16),transparent_48%),linear-gradient(135deg,rgba(239,132,110,0.08),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="text-[0.62rem] uppercase tracking-[0.5em] text-brass-500">Μουσική παιδεία · Πειραιάς</p>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-cream sm:text-6xl">
          Μια ορχήστρα ξεκινά
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Ένα σύντομο μουσικό καλωσόρισμα από τις ομάδες του σχολείου.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INSTRUMENTS.map((instrument, index) => (
            <div
              key={instrument.name}
              className={
                "relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 " +
                (active === index
                  ? "border-brass-400/70 bg-white shadow-[0_12px_45px_rgba(14,147,140,0.16)]"
                  : "border-cream/10 bg-ink-900/70")
              }
            >
              <span className={`bg-gradient-to-br ${instrument.tone} bg-clip-text font-display text-4xl text-transparent`}>
                {instrument.symbol}
              </span>
              <span className="mt-4 block text-sm font-semibold text-cream">{instrument.name}</span>
              <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-muted">{instrument.detail}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-xs">
          <div className="h-1 overflow-hidden rounded-full bg-ink-700">
            <div className="h-full rounded-full bg-gradient-to-r from-brass-500 via-brass-300 to-rose-300 transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.3em] text-muted">Η σελίδα ετοιμάζεται · {progress}%</p>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 rounded-full border border-brass-400/40 px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.25em] text-brass-600 transition hover:border-brass-500 hover:bg-brass-100"
      >
        Παράλειψη intro
      </button>
    </div>
  );
}
