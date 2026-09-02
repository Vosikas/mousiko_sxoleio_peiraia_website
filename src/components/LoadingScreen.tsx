"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playFlourish, playNote } from "@/lib/audio";

/* --------------------------------------------------------------- πλήκτρα */

type Key = {
  note: string;
  freq: number;
  black: boolean;
  /** Θέση σε «λευκά πλήκτρα» — τα μαύρα κάθονται ανάμεσα. */
  index: number;
  kbd: string;
};

const KEYS: Key[] = [
  { note: "ντο", freq: 261.63, black: false, index: 0, kbd: "a" },
  { note: "ντο#", freq: 277.18, black: true, index: 0, kbd: "w" },
  { note: "ρε", freq: 293.66, black: false, index: 1, kbd: "s" },
  { note: "ρε#", freq: 311.13, black: true, index: 1, kbd: "e" },
  { note: "μι", freq: 329.63, black: false, index: 2, kbd: "d" },
  { note: "φα", freq: 349.23, black: false, index: 3, kbd: "f" },
  { note: "φα#", freq: 369.99, black: true, index: 3, kbd: "t" },
  { note: "σολ", freq: 392.0, black: false, index: 4, kbd: "g" },
  { note: "σολ#", freq: 415.3, black: true, index: 4, kbd: "y" },
  { note: "λα", freq: 440.0, black: false, index: 5, kbd: "h" },
  { note: "λα#", freq: 466.16, black: true, index: 5, kbd: "u" },
  { note: "σι", freq: 493.88, black: false, index: 6, kbd: "j" },
  { note: "ντο΄", freq: 523.25, black: false, index: 7, kbd: "k" },
];

const WHITE_COUNT = KEYS.filter((k) => !k.black).length;
const GLYPHS = ["♪", "♫", "♩", "♬", "𝄞"];

type FloatingNote = { id: number; left: number; glyph: string; dx: number; rot: number };

/* ------------------------------------------------------------- component */

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [notes, setNotes] = useState<FloatingNote[]>([]);
  const [played, setPlayed] = useState(0);
  const noteId = useRef(0);

  /* Εμφανίζεται μία φορά ανά επίσκεψη. */
  useEffect(() => {
    if (sessionStorage.getItem("msp:intro")) return;
    sessionStorage.setItem("msp:intro", "1");
    setHidden(false);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* Μπάρα προόδου με ελαφρώς ανομοιόμορφο ρυθμό — μοιάζει «ζωντανή». */
  useEffect(() => {
    if (hidden) return;
    let raf = 0;
    const start = performance.now();
    const total = 2300;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hidden]);

  const spawnNote = useCallback((left: number) => {
    const id = noteId.current++;
    setNotes((n) => [
      ...n,
      {
        id,
        left,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        dx: Math.round((Math.random() - 0.5) * 90),
        rot: Math.round((Math.random() - 0.5) * 60),
      },
    ]);
    setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 2000);
  }, []);

  const strike = useCallback(
    (key: Key) => {
      playNote(key.freq);
      setActive(key.note);
      setPlayed((p) => p + 1);
      setTimeout(() => setActive((a) => (a === key.note ? null : a)), 180);
      const left = key.black
        ? ((key.index + 1) / WHITE_COUNT) * 100
        : ((key.index + 0.5) / WHITE_COUNT) * 100;
      spawnNote(left);
    },
    [spawnNote],
  );

  /* Παίξιμο και από το πληκτρολόγιο. */
  useEffect(() => {
    if (hidden) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const key = KEYS.find((k) => k.kbd === e.key.toLowerCase());
      if (key) {
        e.preventDefault();
        strike(key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hidden, strike]);

  const dismiss = useCallback(() => {
    if (leaving) return;
    playFlourish();
    setLeaving(true);
    document.body.style.overflow = "";
    setTimeout(() => setHidden(true), 900);
  }, [leaving]);

  /* Αυτόματη έξοδος λίγο μετά την ολοκλήρωση, με περιθώριο αν παίζει ο χρήστης. */
  useEffect(() => {
    if (!ready || leaving) return;
    const t = setTimeout(dismiss, played > 0 ? 4200 : 1100);
    return () => clearTimeout(t);
  }, [ready, leaving, played, dismiss]);

  if (hidden) return null;

  const whites = KEYS.filter((k) => !k.black);
  const blacks = KEYS.filter((k) => k.black);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Φόρτωση ιστοσελίδας"
      className={
        "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink-950 transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] " +
        (leaving ? "pointer-events-none -translate-y-full opacity-0" : "")
      }
    >
      {/* Λάμψη φόντου */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(208,169,95,0.16),transparent_62%)] blur-2xl" />

      {/* Πεντάγραμμο που «γράφεται» */}
      <svg
        aria-hidden
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[18%] h-24 w-full opacity-25"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0"
            y1={20 + i * 18}
            x2="1200"
            y2={20 + i * 18}
            stroke="var(--color-brass-400)"
            strokeWidth="1"
            strokeDasharray="1200"
            style={{ animation: "stave-draw 1.6s " + i * 0.12 + "s cubic-bezier(0.16,1,0.3,1) both" }}
          />
        ))}
      </svg>

      {/* Νότες που πετούν από τα πλήκτρα */}
      <div className="pointer-events-none absolute bottom-[26%] left-1/2 h-0 w-full max-w-2xl -translate-x-1/2 px-6">
        {notes.map((n) => (
          <span
            key={n.id}
            className="absolute bottom-0 select-none text-3xl text-brass-300"
            style={
              {
                left: n.left + "%",
                "--dx": n.dx + "px",
                "--rot": n.rot + "deg",
                animation: "note-rise 1.9s cubic-bezier(0.16,1,0.3,1) forwards",
              } as React.CSSProperties
            }
          >
            {n.glyph}
          </span>
        ))}
      </div>

      {/* Τίτλος */}
      <div className="relative z-10 px-6 text-center">
        <p
          className="mb-4 text-[0.68rem] uppercase tracking-[0.55em] text-brass-400/80"
          style={{ animation: "rise 0.9s 0.15s both" }}
        >
          Πειραιάς · Μουσική Παιδεία
        </p>
        <h1
          className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          style={{ animation: "rise 1s 0.3s both" }}
        >
          <span className="block text-gradient-brass">Μουσικό Σχολείο</span>
          <span className="block text-cream/95">Πειραιά</span>
        </h1>
        <p
          className="mx-auto mt-6 h-10 max-w-sm text-sm text-muted"
          style={{ animation: "rise 1s 0.5s both" }}
        >
          {active ? (
            <span className="text-brass-200">Νότα: {active}</span>
          ) : (
            "Παίξτε μερικές νότες όσο φορτώνει — με το ποντίκι ή το πληκτρολόγιο."
          )}
        </p>
      </div>

      {/* Πιάνο */}
      <div
        className="relative z-10 mt-6 w-full max-w-2xl px-6"
        style={{ animation: "rise 1s 0.65s both" }}
      >
        <div className="relative mx-auto h-36 select-none rounded-b-2xl rounded-t-md bg-ink-800 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-brass-500/25 sm:h-44">
          <div className="relative flex h-full gap-[3px]">
            {whites.map((k) => (
              <button
                key={k.note}
                type="button"
                aria-label={"Νότα " + k.note}
                onPointerDown={() => strike(k)}
                className={
                  "group relative flex-1 rounded-b-lg bg-gradient-to-b from-cream to-[#d9d4c7] transition-all duration-100 active:translate-y-[3px] " +
                  (active === k.note ? "translate-y-[3px] from-brass-200 to-brass-300" : "")
                }
              >
                <span className="absolute inset-x-0 bottom-2 text-center text-[0.6rem] font-medium uppercase tracking-wider text-ink-900/35">
                  {k.kbd}
                </span>
              </button>
            ))}

            {blacks.map((k) => (
              <button
                key={k.note}
                type="button"
                aria-label={"Νότα " + k.note}
                onPointerDown={() => strike(k)}
                style={{ left: "calc(" + ((k.index + 1) / WHITE_COUNT) * 100 + "% - 3.2%)" }}
                className={
                  "absolute top-0 z-10 h-[62%] w-[6.4%] rounded-b-md bg-gradient-to-b from-ink-700 to-ink-950 shadow-[0_6px_10px_rgba(0,0,0,0.6)] transition-all duration-100 active:translate-y-[3px] " +
                  (active === k.note ? "translate-y-[3px] from-brass-500 to-brass-600" : "")
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Πρόοδος */}
      <div className="relative z-10 mt-10 w-full max-w-xs px-6 text-center">
        <div className="h-px w-full overflow-hidden bg-cream/15">
          <div
            className="h-full bg-gradient-to-r from-brass-500 via-brass-200 to-brass-400 transition-[width] duration-200 ease-out"
            style={{ width: progress + "%" }}
          />
        </div>
        <div className="mt-5 flex h-10 items-center justify-center text-[0.65rem] uppercase tracking-[0.35em] text-muted">
          {ready ? (
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full border border-brass-400/40 px-6 py-2 tracking-[0.3em] text-brass-200 transition hover:border-brass-300 hover:bg-brass-400/10 hover:text-brass-100"
            >
              Είσοδος
            </button>
          ) : (
            <span>Κούρδισμα… {progress}%</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-6 right-6 z-10 text-[0.65rem] uppercase tracking-[0.3em] text-muted/60 transition hover:text-brass-200"
      >
        Παράλειψη
      </button>
    </div>
  );
}
