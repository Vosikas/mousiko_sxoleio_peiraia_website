"use client";

import { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { useLanguage } from "@/hooks/useLanguage";
import { WidgetLabel } from "./ClockWidget";

const MONTHS = [
  "Ιανουάριος",
  "Φεβρουάριος",
  "Μάρτιος",
  "Απρίλιος",
  "Μάιος",
  "Ιούνιος",
  "Ιούλιος",
  "Αύγουστος",
  "Σεπτέμβριος",
  "Οκτώβριος",
  "Νοέμβριος",
  "Δεκέμβριος",
];

/** Η ελληνική εβδομάδα ξεκινά Δευτέρα. */
const WEEKDAYS = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"];

export type SchoolEvent = { date: string; title: string; kind?: "concert" | "exam" | "trip" };

/** Εκδηλώσεις — αργότερα μπορούν να έρθουν από custom post type του WordPress. */
const EVENTS: SchoolEvent[] = [
  { date: "2026-09-11", title: "Αγιασμός — έναρξη σχολικής χρονιάς", kind: "trip" },
  { date: "2026-09-19", title: "Ακροάσεις για τα μουσικά σύνολα", kind: "exam" },
  { date: "2026-09-27", title: "Συναυλία υποδοχής νέων μαθητών", kind: "concert" },
  { date: "2026-10-16", title: "Ρεσιτάλ πιάνου — Αίθουσα Εκδηλώσεων", kind: "concert" },
];

const KIND_COLOR: Record<string, string> = {
  concert: "bg-brass-300",
  exam: "bg-sun-500",
  trip: "bg-emerald-400",
};

const iso = (y: number, m: number, d: number) =>
  y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");

export default function CalendarWidget() {
  const { language, t } = useLanguage();
  // Ανανέωση ανά λεπτό: αρκεί για να «γυρίσει» το σημερινό κελί τα μεσάνυχτα.
  const today = useNow(60_000);

  // Όσο ο χρήστης δεν έχει αλλάξει μήνα, ακολουθούμε τον τρέχοντα.
  const [cursor, setCursor] = useState<{ year: number; month: number } | null>(null);
  const view = cursor ?? {
    year: today?.getFullYear() ?? 2026,
    month: today?.getMonth() ?? 0,
  };

  const grid = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    // getDay(): 0=Κυριακή → μετατροπή σε εβδομάδα που ξεκινά Δευτέρα.
    const offset = (first.getDay() + 6) % 7;
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view.year, view.month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, SchoolEvent[]>();
    for (const e of EVENTS) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, []);

  const upcoming = useMemo(() => {
    if (!today) return EVENTS.slice(0, 3);
    // Τοπική ημερομηνία, όχι UTC — αλλιώς μετά τα μεσάνυχτα «χάνεται» μια μέρα.
    const t = iso(today.getFullYear(), today.getMonth(), today.getDate());
    return EVENTS.filter((e) => e.date >= t).slice(0, 3);
  }, [today]);

  const shift = (delta: number) => {
    const m = view.month + delta;
    setCursor({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };

  if (!today) return <CalendarSkeleton />;

  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Ημερολόγιο</WidgetLabel>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          aria-label="Προηγούμενος μήνας"
          onClick={() => shift(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/10 text-muted transition hover:border-brass-400/50 hover:text-brass-600"
        >
          ‹
        </button>
        <p className="font-display text-lg tracking-wide text-cream">
          {new Intl.DateTimeFormat(language === "EN" ? "en-US" : "el-GR", { month: "long" }).format(
            new Date(view.year, view.month, 1),
          )} <span className="text-brass-400">{view.year}</span>
        </p>
        <button
          type="button"
          aria-label="Επόμενος μήνας"
          onClick={() => shift(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/10 text-muted transition hover:border-brass-400/50 hover:text-brass-600"
        >
          ›
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2 text-[0.58rem] uppercase tracking-widest text-muted/70">
            {d}
          </span>
        ))}

        {grid.map((day, i) => {
          if (day === null) return <span key={"e" + i} />;
          const key = iso(view.year, view.month, day);
          const isToday = key === todayIso;
          const dayEvents = eventsByDate.get(key);
          const weekend = i % 7 >= 5;

          return (
            <span key={key} className="relative flex flex-col items-center py-1">
              <span
                title={dayEvents?.map((e) => e.title).join(" · ")}
                className={
                  "flex h-8 w-8 items-center justify-center rounded-full text-[0.78rem] tabular-nums transition " +
                  (isToday
                    ? "bg-gradient-to-br from-brass-300 to-brass-500 font-semibold text-ink-950 shadow-[0_0_18px_rgba(14,147,140,0.28)]"
                    : dayEvents
                      ? "cursor-default text-cream ring-1 ring-brass-400/35 hover:ring-brass-300"
                      : weekend
                        ? "text-muted/50"
                        : "text-cream/80")
                }
              >
                {day}
              </span>
              <span className="mt-0.5 flex h-1 gap-0.5">
                {dayEvents?.slice(0, 3).map((e, j) => (
                  <span
                    key={j}
                    className={"h-1 w-1 rounded-full " + (KIND_COLOR[e.kind ?? "concert"] ?? "bg-brass-300")}
                  />
                ))}
              </span>
            </span>
          );
        })}
      </div>

      <div className="mt-6 border-t border-cream/8 pt-5">
        <h3 className="text-[0.6rem] uppercase tracking-[0.28em] text-brass-300">{t("Προσεχώς")}</h3>
        <ul className="mt-4 space-y-3.5">
          {upcoming.length === 0 && (
            <li className="text-xs text-muted">{t("Δεν υπάρχουν προγραμματισμένες εκδηλώσεις.")}</li>
          )}
          {upcoming.map((e) => {
            const d = new Date(e.date);
            return (
              <li key={e.date + e.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-brass-400/25 bg-ink-900/70">
                  <span className="text-[0.8rem] font-semibold leading-none text-brass-600">
                    {d.getDate()}
                  </span>
                  <span className="mt-0.5 text-[0.5rem] uppercase tracking-wider text-muted">
                    {new Intl.DateTimeFormat(language === "EN" ? "en-US" : "el-GR", { month: "short" }).format(
                      d,
                    )}
                  </span>
                </span>
                <span className="text-[0.78rem] leading-snug text-cream/80">{e.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

function CalendarSkeleton() {
  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Ημερολόγιο</WidgetLabel>
      <div className="mx-auto mt-5 h-7 w-40 animate-pulse rounded bg-ink-850" />
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-full bg-ink-850" />
        ))}
      </div>
      <div className="mt-6 h-24 animate-pulse rounded bg-ink-850" />
    </article>
  );
}
