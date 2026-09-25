import Link from "next/link";
import { SECTIONS, subpageHref, type SectionSlug } from "@/content";
import PageIntro from "./PageIntro";

/**
 * Η κεντρική σελίδα μιας ενότητας (π.χ. /to-scholeio): εισαγωγή και
 * μια κάρτα για κάθε υποσελίδα. Οι κάρτες βγαίνουν από το περιεχόμενο,
 * οπότε μια νέα υποσελίδα εμφανίζεται εδώ χωρίς καμία αλλαγή κώδικα.
 */
export default function SectionIndex({ section: slug }: { section: SectionSlug }) {
  const section = SECTIONS[slug];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10 sm:px-8 sm:pt-14">
      <PageIntro
        crumbs={[{ label: "Αρχική", href: "/" }, { label: section.title }]}
        eyebrow={section.eyebrow}
        title={section.title}
        lead={section.intro}
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.subpages.map((page, i) => (
          <li key={page.slug} style={{ animation: `rise 0.9s ${0.25 + i * 0.06}s both` }}>
            <Link
              href={subpageHref(section, page)}
              className="surface-box group flex h-full flex-col border border-transparent p-7 transition duration-300 hover:-translate-y-1 hover:border-plum-500/35"
            >
              <span className="font-display text-sm font-semibold tabular-nums surface-box-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-cream transition-colors group-hover:text-plum-500">
                {page.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{page.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] surface-box-accent">
                Δείτε περισσότερα
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
