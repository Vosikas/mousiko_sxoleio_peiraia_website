"use client";

import { useCallback, useEffect, useState } from "react";
import { markIntroSeen, revealPage, useIntroSeen } from "@/hooks/useIntro";
import { playBandIntro } from "@/lib/audio";
import { useLanguage } from "@/hooks/useLanguage";

const INSTRUMENTS = [
  { name: "Έγχορδα", detail: "χρώμα", symbol: "∿", tone: "from-brass-200 to-brass-500" },
  { name: "Πνευστά", detail: "ανάσα", symbol: "◌", tone: "from-sky-200 to-brass-400" },
  { name: "Κρουστά", detail: "ρυθμός", symbol: "◉", tone: "from-sun-100 to-sun-500" },
  { name: "Πιάνο", detail: "αρμονία", symbol: "⌁", tone: "from-brass-300 to-brass-600" },
];

export default function LoadingScreen() {
  const hidden = useIntroSeen();
  const { t } = useLanguage();
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(53,183,174,0.16),transparent_48%),linear-gradient(135deg,rgba(244,185,66,0.10),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="text-[0.62rem] uppercase tracking-[0.5em] text-brass-600">{t("Μουσική παιδεία · Πειραιάς")}</p>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-cream sm:text-6xl">
          {t("Μια ορχήστρα ξεκινά")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          {t("Η κάμερα κινείται μέσα σε μια μπάντα καθώς το σχολείο βρίσκει τον ρυθμό του.")}
        </p>

        <div className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-[2rem] border border-cream/15 bg-ink-900 px-4 py-7 shadow-[0_24px_80px_rgba(16,42,67,0.14)] sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(53,183,174,0.24),transparent_48%)]" />
          <div className="relative flex items-end justify-between gap-2 sm:gap-5" style={{ animation: "camera-pan 4s ease-in-out infinite" }}>
          {INSTRUMENTS.map((instrument, index) => (
            <div
              key={instrument.name}
              className={
                "relative flex min-h-36 flex-1 flex-col justify-end overflow-hidden rounded-xl border p-3 text-left transition-all duration-500 sm:min-h-44 sm:p-5 " +
                (active === index
                  ? "-translate-y-3 border-brass-500 bg-white shadow-[0_16px_40px_rgba(14,147,140,0.22)]"
                  : "border-cream/15 bg-white/70")
              }
            >
              <span className={`mb-auto bg-gradient-to-br ${instrument.tone} bg-clip-text font-display text-5xl text-transparent sm:text-6xl`} style={{ animation: `instrument-bob ${2.2 + index * 0.3}s ease-in-out infinite` }}>
                {instrument.symbol}
              </span>
              <span className="mt-4 block text-xs font-semibold text-cream sm:text-sm">{t(instrument.name)}</span>
              <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-muted">{t(instrument.detail)}</span>
            </div>
          ))}
          </div>
          <div className="relative mt-7 flex items-center justify-center gap-3 text-[0.58rem] uppercase tracking-[0.32em] text-brass-600">
            <span className="h-px w-8 bg-brass-400/60" />
            {t("Τώρα παίζουν όλοι")}
            <span className="h-px w-8 bg-brass-400/60" />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-xs">
          <div className="h-1 overflow-hidden rounded-full bg-ink-700">
            <div className="h-full rounded-full bg-gradient-to-r from-brass-600 via-brass-400 to-sun-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 text-[0.62rem] uppercase tracking-[0.3em] text-muted">{t("Η σελίδα ετοιμάζεται")} · {progress}%</p>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 rounded-full border border-brass-400/40 px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.25em] text-brass-600 transition hover:border-brass-500 hover:bg-brass-100"
      >
        {t("Παράλειψη intro")}
      </button>
    </div>
  );
}
