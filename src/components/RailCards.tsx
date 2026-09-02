import Link from "next/link";
import { WidgetLabel } from "./ClockWidget";
import { site } from "@/lib/site";

const ENSEMBLES = [
  { name: "Συμφωνική Ορχήστρα", href: "/tmimata#orchestra" },
  { name: "Χορωδία", href: "/tmimata#xorodia" },
  { name: "Παραδοσιακό Σύνολο", href: "/tmimata#paradosiako" },
  { name: "Μπάντα Πνευστών", href: "/tmimata#pnefsta" },
  { name: "Σύνολο Τζαζ", href: "/tmimata#jazz" },
];

/** Αριστερή στήλη: γρήγορη πρόσβαση στα μουσικά σύνολα. */
export function EnsemblesCard() {
  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Μουσικά σύνολα</WidgetLabel>
      <ul className="mt-5 space-y-1">
        {ENSEMBLES.map((e) => (
          <li key={e.href}>
            <Link
              href={e.href}
              className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[0.78rem] text-cream/75 transition hover:bg-brass-400/8 hover:text-brass-100"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-brass-400/70 transition-transform duration-300 group-hover:scale-125">
                  ♪
                </span>
                {e.name}
              </span>
              <span className="text-muted/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brass-300">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Δεξιά στήλη: επικοινωνία με μια ματιά. */
export function ContactCard() {
  return (
    <article className="relative overflow-hidden rounded-xl2 border border-brass-400/25 bg-gradient-to-br from-brass-400/12 via-ink-850/70 to-ink-900 p-6">
      <span className="pointer-events-none absolute -right-8 -top-8 font-display text-[8rem] leading-none text-brass-400/10">
        𝄞
      </span>
      <h2 className="relative font-display text-xl text-cream">Εγγραφές &amp; πληροφορίες</h2>
      <p className="relative mt-3 text-[0.78rem] leading-relaxed text-muted">
        Η γραμματεία δέχεται ερωτήματα για εισαγωγικές εξετάσεις, μεταγραφές και μουσικά όργανα.
      </p>
      <div className="relative mt-5 space-y-2 text-[0.78rem]">
        <a
          href={"tel:" + site.contact.phone.replace(/\s/g, "")}
          className="flex items-center gap-2.5 text-cream/85 transition hover:text-brass-200"
        >
          <span className="text-brass-400">☎</span> {site.contact.phone}
        </a>
        <a
          href={"mailto:" + site.contact.email}
          className="flex items-center gap-2.5 break-all text-cream/85 transition hover:text-brass-200"
        >
          <span className="text-brass-400">✉</span> {site.contact.email}
        </a>
      </div>
      <Link
        href="/epikoinonia"
        className="relative mt-6 flex items-center justify-center gap-2 rounded-full border border-brass-300/45 py-3 text-[0.64rem] uppercase tracking-[0.2em] text-brass-200 transition hover:bg-brass-400/15 hover:text-brass-100"
      >
        Φόρμα επικοινωνίας →
      </Link>
    </article>
  );
}

/** Οριζόντια ταινία με τα αντικείμενα σπουδών. */
export function Marquee() {
  const items = [
    "Πιάνο",
    "Βιολί",
    "Κιθάρα",
    "Βυζαντινή Μουσική",
    "Παραδοσιακά Όργανα",
    "Αρμονία",
    "Χορωδία",
    "Τζαζ",
    "Κρουστά",
    "Πνευστά",
  ];
  const row = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden border-y border-cream/8 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
      <div className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={item + i}
            className="flex items-center gap-10 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.32em] text-cream/45"
          >
            {item}
            <span className="text-brass-400/70">♪</span>
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 pr-10"
      >
        {row.map((item, i) => (
          <span
            key={item + i}
            className="flex items-center gap-10 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.32em] text-cream/45"
          >
            {item}
            <span className="text-brass-400/70">♪</span>
          </span>
        ))}
      </div>
    </div>
  );
}
