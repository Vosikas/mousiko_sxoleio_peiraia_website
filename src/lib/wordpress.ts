/**
 * WordPress REST API client (headless).
 *
 * Ρύθμιση: βάλτε στο .env.local (και στο Vercel → Environment Variables)
 *   WORDPRESS_API_URL=https://gym-mous-peiraia.att.sch.gr
 * Γίνεται δεκτό και ολόκληρο το endpoint (…/wp-json/wp/v2).
 *
 * ΠΡΟΣΟΧΗ: εδώ μπαίνει η διεύθυνση του WORDPRESS, όχι του νέου site.
 * Αν η διεύθυνση δεν απαντά, το site πέφτει σιωπηλά σε δείγμα
 * περιεχομένου — δείτε το log του server για γραμμές «[wp]».
 * Τα δεδομένα ανανεώνονται με ISR (revalidate) — ο διαχειριστής γράφει
 * στο WordPress και το Next.js ενημερώνεται μόνο του.
 */

import { unstable_noStore } from "next/cache";
import { categoryKey } from "./text";
import { parseSongTable, type Song } from "./song-table";
import { cleanWpHtml, youtubeIds } from "./wp-clean";
import { CATEGORY_KEYWORDS, POSTS_SINCE } from "@/content/news";
import { SONGS_PAGE_SLUG } from "@/content/songs";
import type { VideoGallery, WpSource } from "@/content/types";
import type { L } from "@/i18n/l10n";

/**
 * Δέχεται ΕΙΤΕ τη διεύθυνση του site ΕΙΤΕ το REST endpoint και επιστρέφει
 * πάντα το endpoint — το «/wp-json/wp/v2» ξεχνιέται εύκολα.
 */
function toRestBase(raw: string | undefined): string {
  const url = raw?.trim().replace(/\/+$/, "") ?? "";
  if (!url) return "";
  if (/\/wp-json\/wp\/v2$/.test(url)) return url;
  if (/\/wp-json$/.test(url)) return url + "/wp/v2";
  return url + "/wp-json/wp/v2";
}

export const WP_API_URL = toRestBase(process.env.WORDPRESS_API_URL);

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
  /** Η κύρια κατηγορία — η ετικέτα πάνω στην κάρτα. */
  category: string | null;
  /** Όλες οι κατηγορίες του άρθρου (για το φίλτρο στα Νέα). */
  categories: string[];
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

/** Όλες οι αριθμητικές οντότητες (&#8230; → …) και οι συνηθισμένες με όνομα. */
export function decodeHtml(input: string): string {
  return input.replace(/&(?:#(\d+)|#x([0-9a-f]+)|[a-z]+);/gi, (m, dec?: string, hex?: string) => {
    if (!dec && !hex) return ENTITIES[m] ?? m;
    const code = dec ? Number(dec) : parseInt(hex!, 16);
    return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
  });
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

/**
 * Οι κατηγορίες του WordPress + όσες προκύπτουν από τον τίτλο
 * (CATEGORY_KEYWORDS στο src/content/news.ts).
 */
function withKeywordCategories(title: string, categories: string[]): string[] {
  const key = categoryKey(title);
  const seen = new Set(categories.map(categoryKey));
  const extra = Object.entries(CATEGORY_KEYWORDS)
    .filter(([name, words]) => !seen.has(categoryKey(name)) && words.some((w) => key.includes(categoryKey(w))))
    .map(([name]) => name);
  return [...categories, ...extra];
}

function normalize(raw: WPRawPost): Post {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const inlineImageSrc = !media
    ? raw.content?.rendered?.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
    : undefined;
  const imageSrc =
    media?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.large?.source_url ??
    inlineImageSrc;
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const title = decodeHtml(stripHtml(raw.title?.rendered ?? ""));
  const categories = withKeywordCategories(
    title,
    terms.filter((t) => t?.taxonomy === "category" && t.slug !== "uncategorized").map((t) => decodeHtml(t.name)),
  );
  const plainExcerpt = stripHtml(raw.excerpt?.rendered ?? "");
  const words = stripHtml(raw.content?.rendered ?? "").split(" ").length;

  return {
    id: raw.id,
    slug: raw.slug,
    title,
    excerpt: truncate(plainExcerpt || stripHtml(raw.content?.rendered ?? ""), 165),
    date: raw.date,
    href: `/nea/${raw.slug}`,
    category: categories[0] ?? null,
    categories,
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

/**
 * «&after=…» για κάθε ερώτημα άρθρων: μόνο δημοσιεύσεις από το POSTS_SINCE
 * (src/content/news.ts) και μετά. Το `after` του WordPress είναι αυστηρό
 * («μετά από»), οπότε στέλνουμε το τελευταίο δευτερόλεπτο της προηγούμενης
 * μέρας — έτσι μετράει και ό,τι δημοσιεύτηκε ακριβώς τα μεσάνυχτα.
 */
const SINCE_FILTER = (() => {
  if (!POSTS_SINCE) return "";
  const start = new Date(POSTS_SINCE + "T00:00:00Z");
  if (Number.isNaN(start.getTime())) return "";
  return "&after=" + new Date(start.getTime() - 1000).toISOString().slice(0, 19);
})();

type FetchOptions = { revalidate?: number; noStore?: boolean };

/**
 * Ο server του sch.gr κόβει τις «ριπές» αιτημάτων (π.χ. στο build, όπου
 * χτίζονται πολλές σελίδες μαζί). Γι' αυτό: λίγα αιτήματα ταυτόχρονα και
 * νέα προσπάθεια, με αναμονή, όταν αποτύχει η σύνδεση ή ζητηθεί «πιο αργά».
 */
const MAX_PARALLEL = 3;
const RETRY_DELAYS_MS = [1000, 3000];
let active = 0;
const waiting: (() => void)[] = [];

async function withSlot<T>(task: () => Promise<T>): Promise<T> {
  if (active < MAX_PARALLEL) active++;
  else await new Promise<void>((resolve) => waiting.push(resolve)); // παίρνει τη θέση κάποιου που τελείωσε
  try {
    return await task();
  } finally {
    const next = waiting.shift();
    if (next) next();
    else active--;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Τα δεδομένα, ή null με το HTTP status της αποτυχίας (0 = καμία σύνδεση). */
async function wpRequest<T>(path: string, opts: FetchOptions = {}): Promise<{ data: T | null; status: number }> {
  if (!WP_API_URL) return { data: null, status: 0 };
  if (opts.noStore) unstable_noStore();

  for (let attempt = 0; ; attempt++) {
    const result = await withSlot(async () => {
      try {
        const res = await fetch(`${WP_API_URL}${path}`, {
          headers: { Accept: "application/json" },
          next: opts.noStore ? undefined : { revalidate: opts.revalidate ?? REVALIDATE_SECONDS },
          cache: opts.noStore ? "no-store" : undefined,
        });
        if (!res.ok) return { data: null, status: res.status, reason: `${res.status} ${res.statusText}` };
        return { data: (await res.json()) as T, status: res.status, reason: "" };
      } catch (err) {
        const cause = (err as { cause?: { code?: string } }).cause?.code;
        return { data: null, status: 0, reason: `${(err as Error).message}${cause ? ` (${cause})` : ""}` };
      }
    });
    if (result.data !== null) return result;

    const retryable = result.status === 0 || result.status === 429 || result.status >= 500;
    if (retryable && attempt < RETRY_DELAYS_MS.length) {
      await sleep(RETRY_DELAYS_MS[attempt]);
      continue;
    }
    console.warn(`[wp] ${result.reason} για ${path}${attempt ? ` (μετά από ${attempt + 1} προσπάθειες)` : ""}`);
    return { data: null, status: result.status };
  }
}

async function wpFetch<T>(path: string, opts: FetchOptions = {}): Promise<T | null> {
  return (await wpRequest<T>(path, opts)).data;
}

/**
 * Το WordPress ΔΕΝ ΑΠΑΝΤΑ: πετάμε σφάλμα, ώστε το Next.js να κρατήσει την
 * τελευταία καλή έκδοση της σελίδας (ISR) αντί να τη χαλάσει. Εξαίρεση το
 * build και το dev, όπου μια στιγμιαία αποτυχία δεν πρέπει να σταματά τίποτα.
 */
function keepLastGoodVersion(what: string): void {
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production") return;
  throw new Error(`[wp] ${what}: το WordPress δεν απαντά — κρατάμε την προηγούμενη έκδοση.`);
}

/**
 * Τα N πιο πρόσφατα άρθρα. Δείγμα ΜΟΝΟ αν το WordPress δεν απαντά (null)·
 * αν απαντά «κανένα άρθρο» (π.χ. λόγω POSTS_SINCE) επιστρέφει κενή λίστα.
 */
export async function getRecentPosts(count = 4): Promise<Post[]> {
  const raw = await wpFetch<WPRawPost[]>(
    `/posts?per_page=${count}&_embed=true&orderby=date&order=desc${SINCE_FILTER}`,
  );
  if (raw === null) return SAMPLE_POSTS.slice(0, count);
  return raw.map(normalize);
}

/** Όλες οι αναρτήσεις, σελίδα-σελίδα ώστε να μην περιορίζονται στις 100· null αν το WordPress δεν απαντά. */
async function fetchAllPosts(): Promise<Post[] | null> {
  const all: WPRawPost[] = [];
  const perPage = 100;

  for (let page = 1; ; page++) {
    const raw = await wpFetch<WPRawPost[]>(
      `/posts?per_page=${perPage}&page=${page}&_embed=true&orderby=date&order=desc${SINCE_FILTER}`,
    );
    if (raw === null) {
      if (page === 1) return null;
      break;
    }
    all.push(...raw);
    if (raw.length < perPage) break;
  }
  return all.map(normalize);
}

/** Όλες οι αναρτήσεις· δείγμα μόνο αν το WordPress δεν απαντά καθόλου. */
export async function getAllPosts(): Promise<Post[]> {
  if (!WP_API_URL) return SAMPLE_POSTS;
  return (await fetchAllPosts()) ?? SAMPLE_POSTS;
}

/** Ένα άρθρο με βάση το slug. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const raw = await wpFetch<WPRawPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed=true${SINCE_FILTER}`);
  if (!raw?.length) return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
  return normalize(raw[0]);
}

/**
 * Άρθρα μίας ή περισσότερων κατηγοριών (όνομα — τόνοι/κεφαλαία δεν μετράνε).
 * Μετράνε και οι κατηγορίες από τον τίτλο (CATEGORY_KEYWORDS), αφού στο
 * WordPress του σχολείου σχεδόν όλα τα άρθρα είναι «Ανακοινώσεις».
 * Χωρίς δείγμα περιεχομένου: αν δεν βρεθεί τίποτα, κενή λίστα.
 */
export async function getPostsByCategories(names: string[], count = 12): Promise<Post[]> {
  if (!names.length || !WP_API_URL) return [];
  const posts = await fetchAllPosts();
  if (posts === null) {
    keepLastGoodVersion("Άρθρα κατηγορίας");
    return [];
  }
  const wanted = new Set(names.map(categoryKey));
  return posts.filter((post) => post.categories.some((c) => wanted.has(categoryKey(c)))).slice(0, count);
}

/** Σελίδα (WordPress page) με βάση το slug — για ΤΟ ΣΧΟΛΕΙΟ, ΕΠΙΚΟΙΝΩΝΙΑ κ.λπ. */
export async function getPageBySlug(slug: string): Promise<{ title: string; html: string } | null> {
  const raw = await wpFetch<WPRawPost[]>(`/pages?slug=${encodeURIComponent(slug)}&_embed=true`);
  if (!raw?.length) return null;
  return { title: decodeHtml(stripHtml(raw[0].title.rendered)), html: raw[0].content.rendered };
}

/**
 * «Τραγούδι της ημέρας»: ο πίνακας της σελίδας SONGS_PAGE_SLUG
 * (οδηγίες στο src/content/songs.ts).
 *
 * Σελίδα που λείπει ή είναι άδεια → [] και η κάρτα κρύβεται. Αν όμως το
 * WordPress δεν απαντά, η αρχική κρατά την τελευταία καλή έκδοση
 * (keepLastGoodVersion) αντί να «χαθούν» τα τραγούδια.
 */
export async function getSongs(): Promise<Song[]> {
  if (!WP_API_URL) return [];
  const raw = await wpFetch<Pick<WPRawPost, "content">[]>(
    `/pages?slug=${encodeURIComponent(SONGS_PAGE_SLUG)}&_fields=content`,
  );
  if (raw === null) {
    keepLastGoodVersion("Τραγούδια");
    return [];
  }
  return raw.length ? parseSongTable(raw[0].content?.rendered ?? "") : [];
}

export type WpEntry = { title: string; html: string; link: string };

const ENDPOINT: Record<WpSource["type"], string> = { page: "pages", post: "posts", portfolio: "portfolio" };

/**
 * Μια σελίδα του παλιού site (πεδίο `wpContent`, src/content/types.ts),
 * καθαρισμένη για το νέο (src/lib/wp-clean.ts).
 * null αν σβήστηκε, έγινε ιδιωτική ή είναι άδεια — τότε η υποσελίδα δείχνει
 * τα δικά της blocks. Αν το WordPress δεν απαντά, η υποσελίδα κρατά την
 * τελευταία καλή έκδοση.
 */
export async function getWpEntry(source: WpSource): Promise<WpEntry | null> {
  if (!WP_API_URL) return null;
  const { data, status } = await wpRequest<Pick<WPRawPost, "title" | "content" | "link">>(
    `/${ENDPOINT[source.type]}/${source.id}?_fields=title,content,link`,
  );
  if (!data) {
    if (![401, 403, 404, 410].includes(status)) keepLastGoodVersion(`${source.type}/${source.id}`);
    return null;
  }
  const html = cleanWpHtml(data.content?.rendered ?? "", { base: data.link || WP_API_URL, until: source.until });
  if (!html) return null;
  return { title: decodeHtml(stripHtml(data.title?.rendered ?? "")), html, link: data.link };
}

export type VideoGroup = { id: string; title: L; items: { title: string; videos: string[] }[] };

/**
 * Τα βίντεο του παλιού site — τα Portfolio Items μιας κατηγορίας (π.χ.
 * «Βίντεο») — σε ομάδες ανάλογα με τα tags τους (πεδίο `videos` της
 * υποσελίδας, src/content/types.ts). Από κάθε item κρατάμε τα βίντεο YouTube.
 */
export async function getWpVideoGroups(gallery: VideoGallery): Promise<VideoGroup[]> {
  if (!WP_API_URL) return [];
  const [terms, tags] = await Promise.all([
    wpFetch<{ id: number; name: string; slug: string }[]>("/portfolio_entries?per_page=100&_fields=id,name,slug"),
    wpFetch<{ id: number; name: string }[]>("/tags?per_page=100&_fields=id,name"),
  ]);
  if (!terms || !tags) {
    keepLastGoodVersion("Βίντεο");
    return [];
  }
  const wanted = categoryKey(gallery.category);
  const term = terms.find((t) => categoryKey(t.name) === wanted || categoryKey(t.slug) === wanted);
  if (!term) return [];

  const items = await wpFetch<{ title: WPRendered; content: WPRendered; tags?: number[] }[]>(
    `/portfolio?portfolio_entries=${term.id}&per_page=100&orderby=date&order=desc&_fields=title,content,tags`,
  );
  if (!items) {
    keepLastGoodVersion("Βίντεο");
    return [];
  }
  const tagKey = new Map(tags.map((t) => [t.id, categoryKey(decodeHtml(t.name))]));
  const videos = items
    .map((item) => ({
      title: decodeHtml(stripHtml(item.title?.rendered ?? "")),
      videos: youtubeIds(item.content?.rendered ?? ""),
      tags: (item.tags ?? []).map((id) => tagKey.get(id) ?? ""),
    }))
    .filter((item) => item.videos.length);

  const groups = await Promise.all(
    gallery.groups.map(async (group) => {
      const groupTags = new Set(group.tags.map(categoryKey));
      const items = await Promise.all(
        videos
          .filter((v) => v.tags.some((t) => groupTags.has(t)))
          .map(async ({ title, videos }) => {
            const alive = await Promise.all(videos.map(youtubeAvailable));
            return { title, videos: videos.filter((_, i) => alive[i]) };
          }),
      );
      return { id: group.id, title: group.title, items: items.filter((item) => item.videos.length) };
    }),
  );
  return groups.filter((group) => group.items.length);
}

/**
 * Υπάρχει ακόμη το βίντεο στο YouTube και επιτρέπει ενσωμάτωση; (oEmbed —
 * ελέγχεται μία φορά τη μέρα). Σβησμένα (404) ή ιδιωτικά/χωρίς ενσωμάτωση
 * (401/403) κρύβονται· αν το YouTube δεν απαντά, δεν κρύβουμε τίποτα.
 */
async function youtubeAvailable(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(`https://www.youtube.com/watch?v=${id}`),
      { next: { revalidate: 86_400 } },
    );
    return ![400, 401, 403, 404].includes(res.status);
  } catch {
    return true;
  }
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
    categories: ["Εκδηλώσεις"],
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
    categories: ["Ανακοινώσεις"],
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
    categories: ["Διακρίσεις"],
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
    categories: ["Προγράμματα"],
    author: "Ομάδα Erasmus+",
    image: null,
    readingMinutes: 4,
  },
];
