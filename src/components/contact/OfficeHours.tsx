"use client";

import { useEffect, useState } from "react";
import { clockLabel, DAY_END, DAY_START, OFFICE_HOURS } from "@/lib/school";

/**
 * The week drawn to scale rather than listed: you can see at a glance that
 * Wednesday runs late and that Friday closes early.
 */

const SPAN = DAY_END - DAY_START;
const TICKS = [8, 10, 12, 14, 16, 18].map((hour) => hour * 60);
const position = (minutes: number) => ((minutes - DAY_START) / SPAN) * 100;

type Now = { day: number; minutes: number };

export default function OfficeHours() {
  // resolved after mount: the server has no idea what time it is for the reader
  const [now, setNow] = useState<Now | null>(null);

  useEffect(() => {
    const read = () => {
      const date = new Date();
      setNow({ day: (date.getDay() + 6) % 7, minutes: date.getHours() * 60 + date.getMinutes() });
    };
    read();
    const timer = window.setInterval(read, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now ? OFFICE_HOURS[now.day] : null;
  const openNow =
    now && today?.open != null && today.close != null && now.minutes >= today.open && now.minutes < today.close;

  const nextOpening = () => {
    if (!now) return null;
    for (let step = 0; step < 8; step += 1) {
      const day = OFFICE_HOURS[(now.day + step) % 7];
      if (day.open == null) continue;
      if (step === 0 && now.minutes >= day.open) continue;
      const when = step === 0 ? "σήμερα" : step === 1 ? "αύριο" : day.label;
      return `${when} στις ${clockLabel(day.open)}`;
    }
    return null;
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-[#102a43] sm:text-3xl">Ωράριο γραμματείας</h2>
        <p
          aria-live="polite"
          className={
            "rounded-full px-3 py-1.5 text-sm font-medium " +
            (now === null
              ? "bg-[#eef4f7] text-[#5b7285]"
              : openNow
                ? "bg-[#0e938c]/10 text-[#0b6f6a]"
                : "bg-[#f4b942]/20 text-[#8a5f10]")
          }
        >
          {now === null
            ? "Έλεγχος ώρας"
            : openNow
              ? `Ανοιχτά τώρα, έως τις ${clockLabel(today!.close!)}`
              : `Κλειστά τώρα${nextOpening() ? `, ανοίγει ${nextOpening()}` : ""}`}
        </p>
      </div>

      <div className="mt-6">
        <div className="relative ml-[4.5rem] hidden h-5 sm:block" aria-hidden>
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 text-xs tabular-nums text-[#7d93a4]"
              style={{ left: `${position(tick)}%` }}
            >
              {clockLabel(tick)}
            </span>
          ))}
        </div>

        <ul className="mt-1 space-y-1.5">
          {OFFICE_HOURS.map((day, index) => {
            const isToday = now?.day === index;
            const closed = day.open == null || day.close == null;
            return (
              <li
                key={day.label}
                className={
                  "flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors sm:gap-4 " +
                  (isToday ? "bg-[#f4b942]/10 ring-1 ring-[#f4b942]/45" : "")
                }
              >
                <span
                  className={
                    "w-[4.5rem] shrink-0 text-sm " + (isToday ? "font-semibold text-[#102a43]" : "text-[#5b7285]")
                  }
                >
                  <span className="hidden sm:inline">{day.label}</span>
                  <span className="sm:hidden">{day.short}</span>
                </span>

                <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-[#eef4f7]">
                  {TICKS.map((tick) => (
                    <span
                      key={tick}
                      aria-hidden
                      className="absolute inset-y-0 w-px bg-white/70"
                      style={{ left: `${position(tick)}%` }}
                    />
                  ))}
                  {closed ? (
                    <span className="absolute inset-y-0 left-3 flex items-center text-xs text-[#8ea3b3]">Κλειστά</span>
                  ) : (
                    <span
                      className="absolute inset-y-1 flex items-center rounded-md bg-[linear-gradient(90deg,#0e938c,#35b7ae)] px-2.5 text-xs font-medium text-white shadow-[0_2px_8px_rgba(14,147,140,0.28)]"
                      style={{
                        left: `${position(day.open!)}%`,
                        width: `${position(day.close!) - position(day.open!)}%`,
                      }}
                    >
                      <span className="truncate">
                        {clockLabel(day.open!)}–{clockLabel(day.close!)}
                      </span>
                    </span>
                  )}
                  {isToday && now ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 w-0.5 bg-[#c0392b]"
                      style={{
                        left: `${Math.min(100, Math.max(0, position(now.minutes)))}%`,
                        display: now.minutes < DAY_START || now.minutes > DAY_END ? "none" : undefined,
                      }}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        {OFFICE_HOURS.filter((day) => day.note).map((day) => (
          <p key={day.label} className="mt-4 text-sm text-[#5b7285]">
            <span className="font-medium text-[#102a43]">{day.label}:</span> {day.note}
          </p>
        ))}
      </div>
    </div>
  );
}
