import Link from "next/link";
import { site } from "@/lib/site";

const STATS = [
  { value: "420", label: "μαθητές & μαθήτριες" },
  { value: "18", label: "μουσικά σύνολα" },
  { value: "35", label: "χρόνια λειτουργίας" },
];

const FLOATING = [
  { glyph: "♪", left: "8%", top: "24%", size: "text-4xl", delay: "0s" },
  { glyph: "♫", left: "88%", top: "30%", size: "text-5xl", delay: "1.4s" },
  { glyph: "♩", left: "16%", top: "68%", size: "text-3xl", delay: "2.6s" },
  { glyph: "♬", left: "78%", top: "72%", size: "text-4xl", delay: "0.8s" },
  { glyph: "𝄞", left: "50%", top: "12%", size: "text-3xl", delay: "3.4s" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-28">
      {/* Φόντο */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-12%] h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(208,169,95,0.15),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(192,142,60,0.10),transparent_62%)] blur-3xl" />

        {/* Πεντάγραμμο */}
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-1/2 h-72 w-full -translate-y-1/2 opacity-[0.14]"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={140 + i * 30}
              x2="1440"
              y2={140 + i * 30}
              stroke="var(--color-brass-300)"
              strokeWidth="1"
              strokeDasharray="1440"
              style={{
                animation: "stave-draw 2.4s " + (0.3 + i * 0.15) + "s cubic-bezier(0.16,1,0.3,1) both",
              }}
            />
          ))}
        </svg>

        {FLOATING.map((f) => (
          <span
            key={f.glyph + f.left}
            className={"absolute animate-float text-brass-300/25 " + f.size}
            style={{ left: f.left, top: f.top, animationDelay: f.delay }}
          >
            {f.glyph}
          </span>
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,var(--color-ink-950)_100%)]" />
      </div>

      {/* Περιεχόμενο */}
      <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-20 lg:px-10">
        <div className="max-w-4xl">
          <p
            className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-brass-400"
            style={{ animation: "rise 0.9s 0.1s both" }}
          >
            <span className="h-px w-10 bg-brass-400/60" />
            Γυμνάσιο &amp; Λύκειο · Δημόσια μουσική εκπαίδευση
          </p>

          {/* 🎨 ΧΡΩΜΑΤΑ ΤΙΤΛΟΥ: μην τα αλλάζετε εδώ.
              Κάθε γραμμή παίρνει το χρώμα της από μία μεταβλητή στο
              src/app/globals.css → ενότητα «ΣΗΜΑΣΙΟΛΟΓΙΚΑ ΧΡΩΜΑΤΑ»:
              --hero-line-1 (ΜΟΥΣΙΚΟ) · --hero-line-2 (ΣΧΟΛΕΙΟ) · --hero-line-3 (ΠΕΙΡΑΙΑ) */}
          <h1
            aria-label={site.name}
            className="hero-title mt-7 font-display font-light"
            style={{ animation: "rise 1.1s 0.25s both" }}
          >
            <TitleLine text="ΜΟΥΣΙΚΟ" line={1} />
            <TitleLine text="ΣΧΟΛΕΙΟ" line={2} />
            <TitleLine text="ΠΕΙΡΑΙΑ" line={3} />
          </h1>

          <p
            className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animation: "rise 1.1s 0.45s both" }}
          >
            {site.description}
          </p>

          <div
            className="mt-11 flex flex-wrap items-center gap-4"
            style={{ animation: "rise 1.1s 0.6s both" }}
          >
            <Link
              href="/to-scholeio"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brass-300 to-brass-500 px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-950 transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="relative z-10">Γνωρίστε το σχολείο</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <a
              href="#video"
              className="group flex items-center gap-3 rounded-full border border-cream/15 px-7 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-cream/85 transition-all duration-300 hover:border-brass-400/60 hover:text-brass-100"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brass-300/60">
                <svg viewBox="0 0 24 24" className="ml-px h-2.5 w-2.5 fill-brass-200">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                </svg>
              </span>
              Δείτε το βίντεο
            </a>
          </div>

          {/* Στατιστικά */}
          <dl
            className="mt-16 flex flex-wrap gap-x-14 gap-y-8 border-t border-cream/8 pt-9"
            style={{ animation: "rise 1.1s 0.8s both" }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-4xl text-brass-200">{s.value}</span>
                  <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.22em] text-muted">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Ένδειξη κύλισης */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="text-[0.55rem] uppercase tracking-[0.32em] text-muted/70">Κύλιση</span>
        <span className="h-12 w-px bg-gradient-to-b from-brass-400/70 to-transparent" />
      </div>
    </section>
  );
}

/**
 * Μία γραμμή του τίτλου.
 *
 * Τα γράμματα μπαίνουν σε flex με `space-between`: έτσι κάθε λέξη «απλώνει»
 * όσο χρειάζεται ώστε και οι τρεις γραμμές να έχουν ακριβώς το ίδιο πλάτος
 * και να ευθυγραμμίζονται αριστερά και δεξιά — το κενό ανάμεσα στα γράμματα
 * υπολογίζεται μόνο του, δεν χρειάζεται χειροκίνητο padding.
 *
 * Το χρώμα ορίζεται στο globals.css (--hero-line-1/2/3), όχι εδώ.
 */
function TitleLine({ text, line }: { text: string; line: 1 | 2 | 3 }) {
  return (
    <span aria-hidden className={"hero-title__line hero-title__line--" + line}>
      {Array.from(text).map((letter, i) => (
        <span key={i}>{letter}</span>
      ))}
    </span>
  );
}
