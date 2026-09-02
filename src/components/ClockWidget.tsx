"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const DAYS = ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"];
const MONTHS = [
  "Ιαν",
  "Φεβ",
  "Μαρ",
  "Απρ",
  "Μαΐ",
  "Ιουν",
  "Ιουλ",
  "Αυγ",
  "Σεπ",
  "Οκτ",
  "Νοε",
  "Δεκ",
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Ο server δεν ξέρει την ώρα του επισκέπτη — κρατάμε τον χώρο και γεμίζουμε μετά.
  if (!now) return <ClockSkeleton />;

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourAngle = ((h % 12) + m / 60) * 30;
  const minuteAngle = (m + s / 60) * 6;
  const secondAngle = s * 6;

  const isOpen =
    (site.hours.openDays as readonly number[]).includes(now.getDay()) &&
    h >= site.hours.openHour &&
    h < site.hours.closeHour;

  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Ώρα σχολείου</WidgetLabel>

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[190px]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <radialGradient id="face" cx="50%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#1c2029" />
              <stop offset="100%" stopColor="#0a0c12" />
            </radialGradient>
          </defs>

          <circle cx="100" cy="100" r="94" fill="url(#face)" stroke="rgba(208,169,95,0.28)" strokeWidth="1" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth="1" />

          {/* Δείκτες ωρών */}
          {Array.from({ length: 60 }, (_, i) => {
            const major = i % 5 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            const outer = 84;
            const inner = major ? 74 : 80;
            return (
              <line
                key={i}
                x1={100 + Math.sin(angle) * inner}
                y1={100 - Math.cos(angle) * inner}
                x2={100 + Math.sin(angle) * outer}
                y2={100 - Math.cos(angle) * outer}
                stroke={major ? "#d0a95f" : "rgba(244,241,234,0.22)"}
                strokeWidth={major ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* Νότα αντί για λογότυπο */}
          <text
            x="100"
            y="70"
            textAnchor="middle"
            fill="rgba(208,169,95,0.55)"
            fontSize="16"
            fontFamily="serif"
          >
            ♪
          </text>

          {/* Δείκτες */}
          <g style={{ transform: "rotate(" + hourAngle + "deg)", transformOrigin: "100px 100px" }}>
            <line x1="100" y1="112" x2="100" y2="52" stroke="#f4f1ea" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g style={{ transform: "rotate(" + minuteAngle + "deg)", transformOrigin: "100px 100px" }}>
            <line x1="100" y1="116" x2="100" y2="34" stroke="#ecd9ae" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g
            style={{
              transform: "rotate(" + secondAngle + "deg)",
              transformOrigin: "100px 100px",
              transition: s === 0 ? "none" : "transform 0.15s cubic-bezier(0.4,2.2,0.5,1)",
            }}
          >
            <line x1="100" y1="122" x2="100" y2="28" stroke="#c08e3c" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          <circle cx="100" cy="100" r="5" fill="#d0a95f" />
          <circle cx="100" cy="100" r="2" fill="#0a0c12" />
        </svg>
      </div>

      <div className="mt-5 text-center">
        <p className="font-display text-3xl tabular-nums tracking-wide text-cream">
          {pad(h)}
          <span className="animate-pulse text-brass-400">:</span>
          {pad(m)}
          <span className="ml-1 align-top text-sm text-muted">{pad(s)}</span>
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted">
          {DAYS[now.getDay()]} {now.getDate()} {MONTHS[now.getMonth()]}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-cream/10 bg-ink-900/60 py-2 text-[0.62rem] uppercase tracking-[0.2em]">
        <span className="relative flex h-2 w-2">
          {isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
          )}
          <span
            className={
              "relative inline-flex h-2 w-2 rounded-full " +
              (isOpen ? "bg-emerald-400" : "bg-muted/60")
            }
          />
        </span>
        <span className={isOpen ? "text-emerald-300" : "text-muted"}>
          {isOpen ? "Ανοιχτά τώρα" : "Εκτός ωραρίου"}
        </span>
      </div>

      <p className="mt-3 text-center text-[0.62rem] leading-relaxed text-muted/70">
        Δευτέρα – Παρασκευή · {pad(site.hours.openHour)}:00 – {pad(site.hours.closeHour)}:00
      </p>
    </article>
  );
}

function ClockSkeleton() {
  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Ώρα σχολείου</WidgetLabel>
      <div className="mx-auto mt-5 aspect-square w-full max-w-[190px] animate-pulse rounded-full border border-cream/8 bg-ink-850" />
      <div className="mx-auto mt-6 h-8 w-28 animate-pulse rounded bg-ink-850" />
      <div className="mx-auto mt-3 h-3 w-36 animate-pulse rounded bg-ink-850" />
      <div className="mt-5 h-8 w-full animate-pulse rounded-full bg-ink-850" />
    </article>
  );
}

export function WidgetLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-brass-400/50 to-transparent" />
      <h2 className="text-[0.6rem] uppercase tracking-[0.32em] text-brass-300">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-l from-brass-400/50 to-transparent" />
    </div>
  );
}
