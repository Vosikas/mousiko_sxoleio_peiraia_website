import DateText from "@/components/i18n/DateText";
import GreekOnlyNote from "@/components/i18n/GreekOnlyNote";
import T from "@/components/i18n/T";
import type { WpEntry } from "@/lib/wordpress";

/**
 * Κείμενο από το παλιό site (πεδίο `wpContent` της υποσελίδας): κάθε σελίδα
 * του WordPress σε γκρι κουτί, με την πηγή και την ημερομηνία ενημέρωσης.
 * Το HTML είναι ήδη καθαρισμένο (src/lib/wp-clean.ts) — μόνο ασφαλή tags —
 * και παίρνει την εμφάνιση του site από την κλάση .wp-content (globals.css).
 */
export default function WpContent({ entries }: { entries: WpEntry[] }) {
  return (
    <div className="space-y-6">
      <GreekOnlyNote />
      {entries.map((entry) => (
        <section key={entry.link} className="surface-box p-7 sm:p-10">
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: entry.html }} />
          <p className="surface-box-rule mt-8 border-t pt-4 text-xs leading-relaxed text-muted">
            <T v="Από το site του σχολείου" />:{" "}
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-box-accent font-medium hover:underline"
            >
              {entry.title} ↗
            </a>
            {" · "}
            <T v="ενημέρωση" /> <DateText iso={entry.modified} />
          </p>
        </section>
      ))}
    </div>
  );
}
