import GreekOnlyNote from "@/components/i18n/GreekOnlyNote";
import type { WpEntry } from "@/lib/wordpress";

/**
 * Κείμενο από το παλιό site (πεδίο `wpContent` της υποσελίδας): κάθε σελίδα
 * του WordPress σε γκρι κουτί.
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
        </section>
      ))}
    </div>
  );
}
