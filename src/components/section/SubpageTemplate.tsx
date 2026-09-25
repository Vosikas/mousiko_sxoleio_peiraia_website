import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubpage, sectionHref, shortTitle, subpageHref, type SectionSlug } from "@/content";
import type { Section, Subpage } from "@/content/types";
import Blocks from "./Blocks";
import PageIntro from "./PageIntro";

/**
 * ΤΟ TEMPLATE ΚΑΘΕ ΥΠΟΣΕΛΙΔΑΣ
 *
 *   Διαδρομή · ετικέτα · τίτλος · εισαγωγή
 *   ┌──────────────┬───────────────────────────────┐
 *   │ πλαϊνό μενού │ τουβλάκια περιεχομένου         │
 *   │ της ενότητας │ (γκρι κουτιά)                  │
 *   │ (sticky)     │ ← Προηγούμενη    Επόμενη →     │
 *   └──────────────┴───────────────────────────────┘
 *
 * Όλο το περιεχόμενο έρχεται από src/content/ — εδώ μόνο η διάταξη.
 * Server component: δεν στέλνει JavaScript στον browser.
 */
export default function SubpageTemplate({ section: sectionSlug, slug }: { section: SectionSlug; slug: string }) {
  const found = getSubpage(sectionSlug, slug);
  if (!found) notFound();
  const { section, page, prev, next } = found;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10 sm:px-8 sm:pt-14">
      <PageIntro
        crumbs={[
          { label: "Αρχική", href: "/" },
          { label: section.title, href: sectionHref(section) },
          { label: shortTitle(page) },
        ]}
        eyebrow={section.title}
        title={page.title}
        lead={page.summary}
        draft={page.draft}
        size="md"
      />

      {/* Κινητό / tablet: οι υποσελίδες ως οριζόντια λίστα που κυλάει. */}
      <nav
        aria-label={"Σελίδες: " + section.title}
        className="-mx-6 mt-10 overflow-x-auto px-6 pb-1 sm:-mx-8 sm:px-8 lg:hidden"
      >
        <ul className="flex w-max gap-2">
          {section.subpages.map((p) => {
            const active = p.slug === page.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={subpageHref(section, p)}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition " +
                    (active ? "bg-plum-500 text-white" : "bg-box text-cream/80 hover:text-plum-500")
                  }
                >
                  {shortTitle(p)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        {/* Υπολογιστής: πλαϊνό μενού που ακολουθεί το scroll. */}
        <aside className="hidden lg:block">
          <nav aria-label={"Σελίδες: " + section.title} className="surface-box sticky top-24 p-3">
            <p className="px-3 pb-3 pt-2 text-[0.6rem] font-medium uppercase tracking-[0.28em] surface-box-accent">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.subpages.map((p) => {
                const active = p.slug === page.slug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={subpageHref(section, p)}
                      aria-current={active ? "page" : undefined}
                      className={
                        "block rounded-xl px-3 py-2.5 text-sm leading-snug transition " +
                        (active
                          ? "bg-white font-semibold text-plum-500 shadow-sm"
                          : "text-cream/75 hover:bg-white/60 hover:text-plum-500")
                      }
                    >
                      {shortTitle(p)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <Blocks blocks={page.blocks} />

          {(prev || next) && (
            <nav aria-label="Περιήγηση ενότητας" className="mt-10 grid gap-4 sm:grid-cols-2">
              {prev && <PagerLink section={section} page={prev} direction="prev" />}
              {next && <PagerLink section={section} page={next} direction="next" />}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function PagerLink({ section, page, direction }: { section: Section; page: Subpage; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={subpageHref(section, page)}
      className={
        "surface-box group flex flex-col gap-1.5 border border-transparent p-6 transition duration-300 hover:border-plum-500/35 " +
        // Η «Επόμενη» μένει πάντα δεξιά, ακόμη κι όταν δεν υπάρχει «Προηγούμενη».
        (isNext ? "text-right sm:col-start-2" : "")
      }
    >
      <span className="text-[0.62rem] uppercase tracking-[0.22em] text-muted">
        {isNext ? "Επόμενη →" : "← Προηγούμενη"}
      </span>
      <span className="font-display text-lg font-semibold leading-snug text-cream transition-colors group-hover:text-plum-500">
        {shortTitle(page)}
      </span>
    </Link>
  );
}
