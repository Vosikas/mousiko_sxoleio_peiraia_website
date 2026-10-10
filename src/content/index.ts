import type { Metadata } from "next";
import { el } from "@/i18n/l10n";
import { DRASEIS } from "./draseis";
import { ERASMUS } from "./erasmus";
import { TO_SCHOLEIO } from "./to-scholeio";
import type { NavItem, Section, StandalonePage, Subpage } from "./types";

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
    title: el(section.title),
    description: el(section.intro),
    alternates: { canonical: sectionHref(section) },
  };
}

export function subpageMetadata(sectionSlug: SectionSlug, slug: string): Metadata {
  const found = getSubpage(sectionSlug, slug);
  if (!found) return {};
  return {
    title: el(shortTitle(found.page)),
    description: el(found.page.summary),
    alternates: { canonical: subpageHref(found.section, found.page) },
  };
}

/* ------------------------------------------------------ αυτόνομες σελίδες */

export const PAGES = {
  erasmus: ERASMUS,
} as const;

export type PageSlug = keyof typeof PAGES;

export const pageHref = (page: StandalonePage) => `/${page.slug}`;

export function pageMetadata(slug: PageSlug): Metadata {
  const page = PAGES[slug];
  return {
    title: el(page.title),
    description: el(page.summary),
    alternates: { canonical: pageHref(page) },
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
  { label: { el: "Αρχική", en: "Home" }, href: "/" },
  sectionNav(TO_SCHOLEIO),
  { label: { el: "Νέα – Ανακοινώσεις", en: "News & Announcements" }, href: "/nea" },
  { label: "Erasmus", href: pageHref(ERASMUS) },
  sectionNav(DRASEIS),
  { label: { el: "Επικοινωνία", en: "Contact" }, href: "/epikoinonia" },
];
