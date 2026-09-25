import type { Metadata } from "next";
import { DRASEIS } from "./draseis";
import { TO_SCHOLEIO } from "./to-scholeio";
import type { NavItem, Section, Subpage } from "./types";

/**
 * Το «μητρώο» των ενοτήτων. Από εδώ βγαίνουν ΟΛΑ:
 * οι σελίδες, τα metadata, οι σύνδεσμοι και το μενού του header.
 *
 * Μόνο server κώδικας εισάγει αυτό το αρχείο (περιέχει όλα τα κείμενα).
 * Το header —που είναι client component— παίρνει μόνο το έτοιμο `NAV`
 * από το layout, οπότε τα κείμενα δεν φορτώνονται ποτέ στον browser.
 */
export const SECTIONS = {
  "to-scholeio": TO_SCHOLEIO,
  draseis: DRASEIS,
} as const;

export type SectionSlug = keyof typeof SECTIONS;

export const sectionHref = (section: Section) => `/${section.slug}`;
export const subpageHref = (section: Section, page: Subpage) => `/${section.slug}/${page.slug}`;
export const shortTitle = (page: Subpage) => page.shortTitle ?? page.title;

/** Μια υποσελίδα μαζί με τη θέση της (για «Προηγούμενη / Επόμενη»). */
export function getSubpage(sectionSlug: SectionSlug, slug: string) {
  const section = SECTIONS[sectionSlug];
  const index = section.subpages.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    section,
    page: section.subpages[index],
    prev: section.subpages[index - 1] ?? null,
    next: section.subpages[index + 1] ?? null,
  };
}

/** Για το generateStaticParams: κάθε υποσελίδα παράγεται στατικά στο build. */
export const subpageParams = (sectionSlug: SectionSlug) =>
  SECTIONS[sectionSlug].subpages.map((p) => ({ slug: p.slug }));

export function sectionMetadata(sectionSlug: SectionSlug): Metadata {
  const section = SECTIONS[sectionSlug];
  return {
    title: section.title,
    description: section.intro,
    alternates: { canonical: sectionHref(section) },
  };
}

export function subpageMetadata(sectionSlug: SectionSlug, slug: string): Metadata {
  const found = getSubpage(sectionSlug, slug);
  if (!found) return {};
  return {
    title: shortTitle(found.page),
    description: found.page.summary,
    alternates: { canonical: subpageHref(found.section, found.page) },
  };
}

/* ------------------------------------------------------------------ μενού */

function sectionNav(section: Section): NavItem {
  return {
    label: section.title,
    href: sectionHref(section),
    children: section.subpages.map((p) => ({ label: p.title, href: subpageHref(section, p) })),
  };
}

/** Το κύριο μενού. Οι υποσελίδες προστίθενται αυτόματα από το περιεχόμενο. */
export const NAV: NavItem[] = [
  { label: "Αρχική", href: "/" },
  sectionNav(TO_SCHOLEIO),
  { label: "Νέα – Ανακοινώσεις", href: "/nea" },
  sectionNav(DRASEIS),
  { label: "Επικοινωνία", href: "/epikoinonia" },
];
