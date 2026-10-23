import { ERASMUS_BLOG } from "@/content/erasmus";
import { cleanWpHtml } from "./wp-clean";
import { decodeHtml, keepLastGoodVersion, stripHtml, truncate } from "./wordpress";

/**
 * Τα άρθρα του blog «Erasmus+ Music School of Piraeus» (ERASMUS_BLOG).
 * Το blog (blogs.sch.gr) δεν ανοίγει το REST API του, αλλά το RSS του έχει
 * ολόκληρο το κείμενο: το διαβάζουμε σελίδα-σελίδα και το καθαρίζουμε όπως
 * τις σελίδες του παλιού site (src/lib/wp-clean.ts). Ανανέωση: κάθε ώρα.
 */

export type ErasmusPost = {
  slug: string;
  title: string;
  date: string;
  link: string;
  author: string | null;
  excerpt: string;
  cover: string | null;
  html: string;
};

const REVALIDATE = 3600;
const MAX_FEED_PAGES = 10;

/** Το κείμενο ενός στοιχείου του RSS (με ή χωρίς CDATA). */
function field(item: string, name: string): string {
  const m = item.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  const cdata = m[1].trim().match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1] : decodeHtml(m[1].trim());
}

/** Διεύθυνση χωρίς ελληνικά/σύμβολα: «Welcome! When Music…» → «welcome-when-music…». */
const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

function parseItem(item: string): ErasmusPost {
  const title = decodeHtml(stripHtml(field(item, "title")));
  const link = field(item, "link");
  // Το slug του blog· αν είναι σκέτος αριθμός (π.χ. «32»), από τον τίτλο.
  let slug = decodeURIComponent(link.replace(/\/+$/, "").split("/").pop() ?? "");
  if (!slug || /^\d+$/.test(slug)) slug = slugify(title) || slug;
  const content = field(item, "content:encoded");
  const cover =
    [...content.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)]
      .map((m) => decodeHtml(m[1]))
      .find((src) => /^https?:/.test(src) && !/padlet\.net\/embeds\//.test(src)) ?? null;
  const excerpt = stripHtml(field(item, "description"))
    .replace(/\s*\[(…|&hellip;|\.\.\.)\]\s*$/, "")
    .replace(/\s*(Continue reading|Διαβάστε περισσότερα).*$/i, "")
    .trim();
  const date = new Date(field(item, "pubDate"));
  return {
    slug,
    title,
    date: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
    link,
    author: decodeHtml(field(item, "dc:creator")) || null,
    excerpt: truncate(excerpt, 180),
    cover,
    html: withoutLeadingTitle(cleanWpHtml(content, { base: link || ERASMUS_BLOG }), title),
  };
}

/**
 * Πολλά άρθρα ξεκινούν με τον τίτλο τους (επικεφαλίδα ή έντονη παράγραφο)·
 * η σελίδα τον δείχνει ήδη. Μια παράγραφος φεύγει μόνο αν είναι ΑΚΡΙΒΩΣ ο τίτλος.
 */
function withoutLeadingTitle(html: string, title: string): string {
  const first = html.match(/^\s*<(h[2-4]|p)>([\s\S]*?)<\/\1>/);
  if (!first) return html;
  const key = (s: string) => slugify(decodeHtml(stripHtml(s)));
  const head = key(first[2]);
  const same = first[1] === "p" ? head === key(title) : key(title).startsWith(head);
  return head && same ? html.slice(first[0].length).trim() : html;
}

/** Όλα τα άρθρα, νεότερα πρώτα· null αν το blog δεν απαντά. */
async function fetchPosts(): Promise<ErasmusPost[] | null> {
  const posts: ErasmusPost[] = [];
  for (let page = 1; page <= MAX_FEED_PAGES; page++) {
    let res: Response;
    try {
      res = await fetch(`${ERASMUS_BLOG}/feed/${page > 1 ? `?paged=${page}` : ""}`, {
        headers: { Accept: "application/rss+xml, application/xml" },
        next: { revalidate: REVALIDATE },
      });
    } catch (err) {
      console.warn("[erasmus] αποτυχία σύνδεσης με το blog:", (err as Error).message);
      if (page === 1) return null;
      break;
    }
    // Μετά την τελευταία σελίδα το WordPress απαντά 404.
    if (!res.ok) {
      if (page === 1) return res.status === 404 ? [] : null;
      break;
    }
    const items = [...(await res.text()).matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => parseItem(m[1]));
    if (!items.length) break;
    posts.push(...items);
  }
  return posts;
}

/** Τα άρθρα του blog (νεότερα πρώτα). Αν το blog δεν απαντά, η σελίδα κρατά την τελευταία καλή έκδοση. */
export async function getErasmusPosts(): Promise<ErasmusPost[]> {
  const posts = await fetchPosts();
  if (posts === null) {
    keepLastGoodVersion("Blog Erasmus+");
    return [];
  }
  return posts;
}

export async function getErasmusPost(slug: string): Promise<ErasmusPost | null> {
  return (await getErasmusPosts()).find((post) => post.slug === slug) ?? null;
}
