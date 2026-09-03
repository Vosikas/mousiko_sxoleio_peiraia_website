/**
 * WordPress REST API client (headless).
 *
 * Ρύθμιση: βάλτε στο .env.local
 *   WORDPRESS_API_URL=https://to-site-sas.gr/wp-json/wp/v2
 *
 * Όσο δεν υπάρχει διαθέσιμο WordPress, το site πέφτει αυτόματα σε
 * δείγμα περιεχομένου ώστε να δουλεύει η ανάπτυξη χωρίς backend.
 * Τα δεδομένα ανανεώνονται με ISR (revalidate) — ο διαχειριστής γράφει
 * στο WordPress και το Next.js ενημερώνεται μόνο του.
 */

import { unstable_noStore } from "next/cache";

export const WP_API_URL = process.env.WORDPRESS_API_URL?.replace(/\/$/, "") ?? "";

/** Δευτερόλεπτα μέχρι το Next.js να ξαναρωτήσει το WordPress. */
export const REVALIDATE_SECONDS = Number(process.env.WORDPRESS_REVALIDATE ?? 300);

/* ---------------------------------------------------------------- types */

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width: number;
    height: number;
    sizes?: Record<string, { source_url: string; width: number; height: number }>;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

/** Custom fields exposed by WordPress, ACF, or another REST-enabled plugin. */
export type WPCustomFields = Record<string, unknown>;

export interface WPEmbedded {
  "wp:featuredmedia"?: WPMedia[];
  "wp:term"?: WPTerm[][];
  author?: { id: number; name: string; avatar_urls?: Record<string, string> }[];
}

/** Minimum shape required to render a WordPress post in the article view. */
export interface WPData {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
  };
}

export interface WPRawPost extends WPData {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  sticky?: boolean;
  /** Present when the post type or plugin exposes custom fields in REST. */
  meta?: WPCustomFields;
  acf?: WPCustomFields;
  _embedded?: WPEmbedded;
}

/** Κανονικοποιημένη ανάρτηση, έτοιμη για τα components. */
export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category: string | null;
  author: string | null;
  image: { src: string; alt: string } | null;
  readingMinutes: number;
}

/* ------------------------------------------------------------- helpers */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&hellip;": "…",
  "&nbsp;": " ",
};

export function decodeHtml(input: string): string {
  return input.replace(/&[#a-zA-Z0-9]+;/g, (m) => ENTITIES[m] ?? m);
}

export function stripHtml(input: string): string {
  return decodeHtml(input.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

export function truncate(input: string, max = 160): string {
  if (input.length <= max) return input;
  return input.slice(0, input.lastIndexOf(" ", max)).trimEnd() + "…";
}

const GREEK_MONTHS = [
  "Ιανουαρίου",
  "Φεβρουαρίου",
  "Μαρτίου",
  "Απριλίου",
  "Μαΐου",
  "Ιουνίου",
  "Ιουλίου",
  "Αυγούστου",
  "Σεπτεμβρίου",
  "Οκτωβρίου",
  "Νοεμβρίου",
  "Δεκεμβρίου",
];

/** Σταθερή ελληνική μορφοποίηση — ίδια σε server και client (χωρίς hydration mismatch). */
export function formatGreekDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${GREEK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function normalize(raw: WPRawPost): Post {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const imageSrc =
    media?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.large?.source_url;
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((t) => t?.taxonomy === "category" && t.slug !== "uncategorized");
  const plainExcerpt = stripHtml(raw.excerpt?.rendered ?? "");
  const words = stripHtml(raw.content?.rendered ?? "").split(" ").length;

  return {
    id: raw.id,
    slug: raw.slug,
    title: decodeHtml(stripHtml(raw.title?.rendered ?? "")),
    excerpt: truncate(plainExcerpt || stripHtml(raw.content?.rendered ?? ""), 165),
    date: raw.date,
    href: `/nea/${raw.slug}`,
    category: category ? decodeHtml(category.name) : null,
    author: raw._embedded?.author?.[0]?.name ?? null,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: decodeHtml(media?.alt_text || stripHtml(raw.title?.rendered ?? "")),
        }
      : null,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

/* ---------------------------------------------------------------- fetch */

type FetchOptions = { revalidate?: number; noStore?: boolean };

async function wpFetch<T>(path: string, opts: FetchOptions = {}): Promise<T | null> {
  if (!WP_API_URL) return null;
  if (opts.noStore) unstable_noStore();

  try {
    const res = await fetch(`${WP_API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: opts.noStore ? undefined : { revalidate: opts.revalidate ?? REVALIDATE_SECONDS },
      cache: opts.noStore ? "no-store" : undefined,
    });
    if (!res.ok) {
      console.warn(`[wp] ${res.status} ${res.statusText} για ${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn("[wp] αποτυχία σύνδεσης με το WordPress:", (err as Error).message);
    return null;
  }
}

/** Τα N πιο πρόσφατα άρθρα. Πέφτει σε δείγμα αν λείπει το WordPress. */
export async function getRecentPosts(count = 4): Promise<Post[]> {
  const raw = await wpFetch<WPRawPost[]>(
    `/posts?per_page=${count}&_embed=true&orderby=date&order=desc`,
  );
  if (!raw?.length) return SAMPLE_POSTS.slice(0, count);
  return raw.map(normalize);
}

/** Όλες οι αναρτήσεις, σελίδα-σελίδα ώστε να μην περιορίζονται στις 100. */
export async function getAllPosts(): Promise<Post[]> {
  if (!WP_API_URL) return SAMPLE_POSTS;

  const all: WPRawPost[] = [];
  const perPage = 100;
  let page = 1;

  while (true) {
    const raw = await wpFetch<WPRawPost[]>(
      `/posts?per_page=${perPage}&page=${page}&_embed=true&orderby=date&order=desc`,
    );
    if (!raw?.length) break;
    all.push(...raw);
    if (raw.length < perPage) break;
    page += 1;
  }

  return all.length ? all.map(normalize) : SAMPLE_POSTS;
}

/** Ένα άρθρο με βάση το slug. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const raw = await wpFetch<WPRawPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed=true`);
  if (!raw?.length) return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
  return normalize(raw[0]);
}

/** Σελίδα (WordPress page) με βάση το slug — για ΤΟ ΣΧΟΛΕΙΟ, ΕΠΙΚΟΙΝΩΝΙΑ κ.λπ. */
export async function getPageBySlug(slug: string): Promise<{ title: string; html: string } | null> {
  const raw = await wpFetch<WPRawPost[]>(`/pages?slug=${encodeURIComponent(slug)}&_embed=true`);
  if (!raw?.length) return null;
  return { title: decodeHtml(stripHtml(raw[0].title.rendered)), html: raw[0].content.rendered };
}

/** true όταν υπάρχει ρυθμισμένο WordPress endpoint. */
export const isWordPressConfigured = () => Boolean(WP_API_URL);

/* -------------------------------------------------------- sample content */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    slug: "christougenniatiki-synavlia",
    title: "Χριστουγεννιάτικη Συναυλία στο Δημοτικό Θέατρο Πειραιά",
    excerpt:
      "Η Συμφωνική Ορχήστρα και η Χορωδία του σχολείου παρουσιάζουν έργα από το κλασικό και το ελληνικό ρεπερτόριο, με ελεύθερη είσοδο για το κοινό.",
    date: daysAgo(2),
    href: "/nea/christougenniatiki-synavlia",
    category: "Εκδηλώσεις",
    author: "Γραμματεία",
    image: null,
    readingMinutes: 2,
  },
  {
    id: 2,
    slug: "eggrafes-2026",
    title: "Εγγραφές μαθητών & μαθητριών για το σχολικό έτος 2026–2027",
    excerpt:
      "Άνοιξε η πλατφόρμα υποβολής αιτήσεων για την Α΄ Γυμνασίου. Δείτε τα δικαιολογητικά, τις ημερομηνίες και τη διαδικασία των εξετάσεων μουσικής ικανότητας.",
    date: daysAgo(6),
    href: "/nea/eggrafes-2026",
    category: "Ανακοινώσεις",
    author: "Διεύθυνση",
    image: null,
    readingMinutes: 3,
  },
  {
    id: 3,
    slug: "diakrisi-panelladiko-diagonismo",
    title: "Πρώτη διάκριση στον Πανελλήνιο Διαγωνισμό Μουσικών Συνόλων",
    excerpt:
      "Το σύνολο παραδοσιακής μουσικής του σχολείου κατέκτησε το πρώτο βραβείο, εκπροσωπώντας τον Πειραιά ανάμεσα σε 34 σχολεία από όλη τη χώρα.",
    date: daysAgo(11),
    href: "/nea/diakrisi-panelladiko-diagonismo",
    category: "Διακρίσεις",
    author: "Σύλλογος Καθηγητών",
    image: null,
    readingMinutes: 2,
  },
  {
    id: 4,
    slug: "erasmus-mousiki-gefyra",
    title: "Erasmus+: «Μουσική Γέφυρα» — ανταλλαγή μαθητών με τη Σεβίλλη",
    excerpt:
      "Δεκαοκτώ μαθητές ταξιδεύουν στην Ισπανία για μια εβδομάδα κοινών προβών, εργαστηρίων και μιας τελικής συναυλίας στο ιστορικό κέντρο της πόλης.",
    date: daysAgo(18),
    href: "/nea/erasmus-mousiki-gefyra",
    category: "Προγράμματα",
    author: "Ομάδα Erasmus+",
    image: null,
    readingMinutes: 4,
  },
];
