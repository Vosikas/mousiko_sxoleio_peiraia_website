"use client";

import { eventsOn, nextObservance, observancesOn } from "@/content/days";
import { useNow } from "@/hooks/useNow";
import { useLanguage } from "@/hooks/useLanguage";
import { el, intlLocale } from "@/i18n/l10n";
import { WidgetLabel } from "./ClockWidget";

/**
 * «Σαν σήμερα»: η παγκόσμια ημέρα που γιορτάζεται σήμερα και ιστορικά
 * γεγονότα της ημερομηνίας. Δεδομένα (σε δύο γλώσσες): src/content/days.ts.
 * Όπως το ρολόι και το ημερολόγιο, διαβάζει την ημερομηνία του επισκέπτη.
 */
export default function TodayWidget() {
  // Ανά λεπτό: αρκεί για να «γυρίσει» το περιεχόμενο τα μεσάνυχτα.
  const now = useNow(60_000);
  const { language, t, l } = useLanguage();

  if (!now) return <TodaySkeleton />;

  const date = new Intl.DateTimeFormat(intlLocale(language), { day: "numeric", month: "long" });
  const today = observancesOn(now);
  const events = eventsOn(now);
  const next = nextObservance(now);

  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Σαν σήμερα</WidgetLabel>
      <p className="mt-4 text-center font-display text-lg text-cream">{date.format(now)}</p>

      {today.length > 0 && (
        <div className="mt-5 rounded-xl bg-plum-100 p-4">
          <p className="text-[0.58rem] font-medium uppercase tracking-[0.22em] text-plum-600">{t("Σήμερα είναι")}</p>
          <ul className="mt-2 space-y-2">
            {today.map((day) => (
              <li key={el(day.name)} className="text-[0.84rem] font-semibold leading-snug text-plum-600">
                {/* «Σήμερα είναι η …» — το άρθρο υπάρχει μόνο στα ελληνικά. */}
                {language === "GR" ? "η " : ""}
                {l(day.name)}
                {day.music && (
                  <span aria-label={t("μουσικό γεγονός")} className="ml-1.5">
                    ♪
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {events.length > 0 ? (
        <ul className="mt-5 space-y-4">
          {events.map((event) => (
            <li key={event.year + el(event.text)} className="flex gap-3">
              <span className="w-11 shrink-0 font-display text-base font-semibold tabular-nums leading-snug text-plum-500">
                {event.year}
              </span>
              <span className="text-[0.8rem] leading-snug text-cream/85">
                {l(event.text)}
                <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  {t("πριν από {n} χρόνια", { n: now.getFullYear() - event.year })}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : today.length === 0 ? (
        <p className="mt-5 text-center text-[0.78rem] leading-relaxed text-muted">
          {t("Για σήμερα δεν υπάρχει καταχωρισμένο γεγονός.")}
        </p>
      ) : null}

      {next && (
        <div className="mt-6 border-t border-cream/8 pt-4">
          <h3 className="text-[0.6rem] uppercase tracking-[0.28em] text-plum-300">{t("Προσεχώς")}</h3>
          <p className="mt-2 text-[0.78rem] leading-snug text-cream/80">
            <span className="font-semibold text-plum-500">{date.format(next.date)}</span> · {l(next.days[0].name)}
            {next.days.length > 1 && <span className="text-muted"> (+{next.days.length - 1})</span>}
          </p>
        </div>
      )}
    </article>
  );
}

function TodaySkeleton() {
  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Σαν σήμερα</WidgetLabel>
      <div className="mx-auto mt-4 h-6 w-32 animate-pulse rounded bg-ink-850" />
      <div className="mt-5 h-20 animate-pulse rounded-xl bg-ink-850" />
      <div className="mt-5 h-12 animate-pulse rounded bg-ink-850" />
    </article>
  );
}
