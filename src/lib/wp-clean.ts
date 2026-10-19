/**
 * ΚΑΘΑΡΙΣΜΑ HTML ΑΠΟ ΤΟ ΠΑΛΙΟ SITE (WordPress με το θέμα Enfold).
 *
 * Οι σελίδες του παλιού site είναι φτιαγμένες με τον layout builder του
 * Enfold: γεμάτες <style>, «avia» wrappers, διακοσμητικά εικονίδια και
 * επαναλήψεις για το κινητό. Εδώ κρατάμε ΜΟΝΟ το περιεχόμενο — επικεφαλίδες,
 * παραγράφους, λίστες, πίνακες, εικόνες, links — και ξαναχτίζουμε κάθε tag
 * από λίστα επιτρεπτών, ώστε το αποτέλεσμα να είναι ασφαλές για
 * dangerouslySetInnerHTML και να παίρνει την εμφάνιση του νέου site
 * (κλάση .wp-content στο globals.css).
 *
 * Χωρίς εξαρτήσεις: ασφαλές για server και για δοκιμές.
 */

type El = { tag: string; attrs: Record<string, string>; children: Node[] };
type Node = El | string;

/** Tags που κρατάμε, με τα attributes που επιτρέπονται στο καθένα. */
const KEEP: Record<string, string[]> = {
  p: [], h2: [], h3: [], h4: [], ul: [], ol: [], li: [], blockquote: [],
  strong: [], em: [], br: [], a: ["href"], img: ["src", "alt"], figure: [], figcaption: [],
  table: [], thead: [], tbody: [], tr: [], td: ["colspan", "rowspan"], th: ["colspan", "rowspan"],
};
const RENAME: Record<string, string> = { b: "strong", i: "em", h1: "h2", h5: "h4", h6: "h4" };
/** Πετιούνται ΜΑΖΙ με το περιεχόμενό τους (φόρμες, media, κουμπιά). */
const DROP = new Set([
  "style", "script", "noscript", "template", "form", "button", "input", "select", "textarea",
  "svg", "object", "embed", "video", "audio", "canvas",
]);
const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "wbr", "col", "area", "embed", "track", "param"]);
/** Block στοιχεία: όπως στους browsers, ανοίγοντάς τα κλείνει ένα ανοιχτό <p>. */
const BLOCK = new Set([
  "div", "p", "ul", "ol", "table", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article",
  "header", "footer", "main", "aside", "nav", "figure", "blockquote", "form",
]);
const HEADING = /^h[2-4]$/;

/* --------------------------------------------------------------- parse */

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] !== "#") return NAMED[e.toLowerCase()] ?? m;
    const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
    return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
  });

function parseAttrs(s: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of s.matchAll(/([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

/** Ανεκτικός parser: αρκεί για το (σχεδόν πάντα σωστό) HTML του WordPress. */
function parse(html: string): Node[] {
  const root: El = { tag: "#root", attrs: {}, children: [] };
  const stack: El[] = [root];
  const openIndex = (tag: string) => stack.findLastIndex((e) => e.tag === tag);
  const source = html
    // Τα βίντεο του Enfold φορτώνουν «αργά» από ένα πρότυπο HTML μέσα σε
    // <script type="text/html">: το ανοίγουμε (περνά κι αυτό από τη λίστα επιτρεπτών).
    .replace(/<script\b[^>]*\btype\s*=\s*["']text\/html["'][^>]*>([\s\S]*?)<\/script\s*>/gi, "$1")
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, "");

  for (const m of source.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g)) {
    const [token, closing, name, rest = ""] = m;
    const parent = stack[stack.length - 1];
    if (!name) {
      if (!token.startsWith("<!")) parent.children.push(token === "<" ? "&lt;" : token);
      continue;
    }
    const tag = name.toLowerCase();
    if (closing) {
      const i = openIndex(tag);
      if (i > 0) stack.length = i;
      continue;
    }
    if (BLOCK.has(tag)) {
      const p = openIndex("p");
      if (p > 0) stack.length = p;
    }
    const el: El = { tag, attrs: parseAttrs(rest), children: [] };
    stack[stack.length - 1].children.push(el);
    if (!VOID.has(tag) && !/\/\s*$/.test(rest)) stack.push(el);
  }
  return root.children;
}

/* -------------------------------------------------------------- βίντεο */

const YOUTUBE = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})(?![\w-])/;

export type VideoSource =
  | { kind: "embed"; src: string }
  | { kind: "link"; href: string; thumb: string; site: string };

/**
 * Βίντεο μόνο από γνωστές υπηρεσίες, ξαναχτισμένο από το id του· οτιδήποτε
 * άλλο iframe πετιέται.
 *   YouTube, Vimeo → ενσωματωμένος player (το YouTube χωρίς cookies)
 *   Dailymotion    → κάρτα με τη μικρογραφία που ανοίγει το βίντεο στο
 *                    Dailymotion: ο ενσωματωμένος player του απαντά «Forbidden».
 */
export function videoSource(raw: string | undefined): VideoSource | null {
  if (!raw) return null;
  const playlist = raw.match(/youtube(?:-nocookie)?\.com\/embed\/videoseries\?(?:.*&)?list=([\w-]+)/);
  if (playlist) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/videoseries?list=${playlist[1]}` };
  const youtube = raw.match(YOUTUBE);
  if (youtube && youtube[1] !== "videoseries") return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };
  const dailymotion = raw.match(/^(?:https?:)?\/\/(?:www\.)?dailymotion\.com\/(?:embed\/)?video\/([a-z0-9]+)/i);
  if (dailymotion) {
    const id = dailymotion[1];
    return {
      kind: "link",
      href: `https://www.dailymotion.com/video/${id}`,
      thumb: `https://www.dailymotion.com/thumbnail/video/${id}`,
      site: "Dailymotion",
    };
  }
  const vimeo = raw.match(/^(?:https?:)?\/\/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return null;
}

/**
 * Τα βίντεο YouTube μιας σελίδας, με τη σειρά τους: πρώτα όσα είναι
 * ενσωματωμένα (iframe)· αν δεν υπάρχει κανένα, τα links που γράφει το κείμενο.
 */
export function youtubeIds(html: string): string[] {
  const idOf = (url: string) => url.match(YOUTUBE)?.[1];
  const embedded = [...html.matchAll(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => idOf(m[1]));
  const linked = [...html.matchAll(new RegExp(YOUTUBE.source, "g"))].map((m) => m[1]);
  const ids = embedded.some(Boolean) ? embedded : linked;
  return [...new Set(ids.filter((id): id is string => Boolean(id) && id !== "videoseries"))];
}

/* --------------------------------------------------------------- clean */

const textOf = (n: Node): string =>
  typeof n === "string" ? decode(n) : n.tag === "br" ? " " : n.children.map(textOf).join("");
const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

function safeUrl(raw: string | undefined, base: string): string | null {
  const value = raw?.trim();
  if (!value || value.startsWith("#")) return null;
  try {
    const url = new URL(value, base);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

type Ctx = { base: string; inCell: boolean; inList: boolean };

function clean(node: Node, ctx: Ctx): Node[] {
  if (typeof node === "string") return [node.replace(/\s+/g, " ")];

  const a = node.attrs;
  // Εικονίδιο-κουμπί του Enfold: άδειο, κρυφό <a class="av-icon-char"> και η
  // λεζάντα του ακριβώς μετά. Κρατάμε το link· η λεζάντα μπαίνει μέσα του
  // στο adoptButtonLabels. (Άλλα κρυφά links, π.χ. των gallery, φεύγουν.)
  if (node.tag === "a" && a["aria-hidden"] === "true" && /\bav-icon-char\b/.test(a.class ?? "") && !textOf(node).trim()) {
    const href = safeUrl(a.href, ctx.base);
    return href ? [{ tag: "a", attrs: { href, class: "wp-button" }, children: [] }] : [];
  }
  if (node.tag === "iframe") {
    const video = videoSource(a.src);
    const title = a.title?.trim() || "Βίντεο";
    if (!video) return [];
    return video.kind === "embed"
      ? [{ tag: "iframe", attrs: { src: video.src, title }, children: [] }]
      : [{ tag: "videolink", attrs: { href: video.href, thumb: video.thumb, site: video.site, title }, children: [] }];
  }
  if (DROP.has(node.tag) || a["aria-hidden"] === "true" || "hidden" in a) return [];
  // Βελάκια/τελείες των sliders του Enfold («1 2 3 4»).
  if (/\bavia-slideshow-controls\b/.test(a.class ?? "")) return [];

  // Καρτέλες του Enfold: ο τίτλος κάθε καρτέλας γίνεται επικεφαλίδα.
  if (a.role === "tab") {
    const title = textOf(node).trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return title ? [{ tag: "h3", attrs: {}, children: [title] }] : [];
  }

  let tag = RENAME[node.tag] ?? node.tag;
  const inCell = ctx.inCell || tag === "td" || tag === "th";
  const inList = ctx.inList || tag === "li";
  const children = tidy(node.children.flatMap((c) => clean(c, { ...ctx, inCell, inList })));

  // Επικεφαλίδες μέσα σε κελιά/λίστες: έντονα γράμματα, όχι τεράστιοι τίτλοι.
  const demoted = HEADING.test(tag) && (ctx.inCell || ctx.inList);
  if (demoted) tag = "strong";
  if (!(tag in KEEP)) {
    // wrapper (div, span, section…) → μόνο το περιεχόμενο. Ο «υπότιτλος από
    // πάνω» του Enfold ανήκει στην επικεφαλίδα που ακολουθεί (βλ. until).
    if (/\bav-subheading_above\b/.test(a.class ?? "")) for (const c of children) if (typeof c !== "string") kicker.add(c);
    return children;
  }

  const attrs: Record<string, string> = {};
  if (tag === "a") {
    const href = safeUrl(a.href, ctx.base);
    if (!href) return children;
    // Link «lightbox» προς τη μεγάλη εκδοχή της ίδιας φωτογραφίας: κρατάμε μόνο τη φωτογραφία.
    if (/\.(jpe?g|png|gif|webp)$/i.test(new URL(href).pathname) && children.some(meaningful) && children.every(onlyImages)) {
      return children;
    }
    attrs.href = href;
  } else if (tag === "img") {
    const src = safeUrl(a.src, ctx.base);
    if (!src || !src.startsWith("http")) return [];
    attrs.src = src;
    attrs.alt = a.alt ?? "";
    // Οι μικρότερες εκδοχές που φτιάχνει το WordPress: το κινητό δεν
    // κατεβάζει το πρωτότυπο των ~700 KB. Ελέγχεται κάθε URL ξεχωριστά.
    const srcset = (a.srcset ?? "")
      .split(",")
      .map((candidate) => candidate.trim().split(/\s+/))
      .filter(([url, width]) => url && /^\d+w$/.test(width ?? ""))
      .map(([url, width]) => {
        const safe = safeUrl(url, ctx.base);
        return safe?.startsWith("http") ? `${safe} ${width}` : null;
      })
      .filter(Boolean);
    if (srcset.length) attrs.srcset = srcset.join(", ");
  } else {
    for (const name of KEEP[tag]) if (/^\d{1,2}$/.test(a[name] ?? "")) attrs[name] = a[name];
  }
  const el: El = { tag, attrs, children };
  if (demoted) wasHeading.add(el);
  return [el];
}

/** Επικεφαλίδες που έγιναν <strong> — μετράνε ακόμη ως τίτλοι στο dedupe. */
const wasHeading = new WeakSet<El>();
/** Υπότιτλοι «από πάνω» του Enfold — φεύγουν μαζί με την επικεφαλίδα τους. */
const kicker = new WeakSet<El>();

const tidy = (nodes: Node[]) => adoptButtonLabels(dedupeHeadings(nodes));

/** Το άδειο link-κουμπί παίρνει μέσα του το ΚΕΙΜΕΝΟ που το ακολουθεί (ποτέ εικόνες, βίντεο, blocks). */
function adoptButtonLabels(nodes: Node[]): Node[] {
  const out: Node[] = [];
  const inline = (n: Node) => typeof n === "string" || n.tag === "strong" || n.tag === "em";
  for (const n of nodes) {
    const prev = out[out.length - 1];
    const empty = typeof prev === "object" && prev.attrs.class === "wp-button" && !prev.children.some(meaningful);
    if (empty && inline(n) && meaningful(n)) prev.children.push(n);
    else if (empty && typeof n === "string") continue; // κενό ανάμεσα σε κουμπί και λεζάντα
    else out.push(n);
  }
  return out;
}

/** Το Enfold επαναλαμβάνει τίτλους για το κινητό: κρατάμε μόνο την πρώτη φορά. */
function dedupeHeadings(nodes: Node[]): Node[] {
  const seen = new Set<string>();
  return nodes.filter((n) => {
    if (typeof n === "string" || !(HEADING.test(n.tag) || wasHeading.has(n))) return true;
    const key = norm(textOf(n));
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Στοιχεία που μετράνε ως περιεχόμενο χωρίς κείμενο. */
const MEDIA = new Set(["img", "iframe", "videolink"]);

const meaningful = (n: Node): boolean =>
  typeof n === "string" ? norm(decode(n)) !== "" : MEDIA.has(n.tag) || n.children.some(meaningful);

const isBr = (n: Node | undefined) => typeof n === "object" && n.tag === "br";
const onlyImages = (n: Node): boolean =>
  typeof n === "string" ? !n.trim() : n.tag === "img" || (n.tag !== "a" && n.children.every(onlyImages));
const imagesOf = (n: Node): El[] => (typeof n === "string" ? [] : n.tag === "img" ? [n] : n.children.flatMap(imagesOf));

/**
 * Βγάζει άδεια στοιχεία, άδειες γραμμές πινάκων και περιττά <br>, και
 * κάνει τις διαδοχικές εικόνες (και τα sliders του Enfold) πλέγμα φωτογραφιών.
 */
function prune(nodes: Node[], top = false): Node[] {
  const out: Node[] = [];
  for (const n of nodes) {
    if (typeof n === "string") {
      out.push(n);
      continue;
    }
    if (n.tag === "br") {
      // Τα <br> έχουν νόημα μόνο μέσα σε κείμενο, και ποτέ δύο στη σειρά.
      if (!top && !isBr(out.findLast((x) => typeof x !== "string" || x.trim()))) out.push(n);
      continue;
    }
    const children = prune(n.children);
    // Slider (λίστα μόνο με εικόνες) ή <figure> χωρίς λεζάντα → απλές εικόνες, για το πλέγμα.
    if ((n.tag === "ul" || n.tag === "ol" || n.tag === "figure") && children.some(meaningful) && children.every(onlyImages)) {
      out.push(...children.flatMap(imagesOf));
      continue;
    }
    // Χωρίς <br> στην αρχή ή στο τέλος ενός στοιχείου.
    const solid = (x: Node) => typeof x !== "string" || x.trim() !== "";
    for (let edge = children.find(solid); isBr(edge); edge = children.find(solid)) children.splice(children.indexOf(edge!), 1);
    for (let edge = children.findLast(solid); isBr(edge); edge = children.findLast(solid)) children.splice(children.lastIndexOf(edge!), 1);
    const el = { ...n, children };
    if (n.tag === "td" || n.tag === "th") out.push(el); // κρατάμε το πλέγμα του πίνακα
    else if (MEDIA.has(n.tag) || children.some(meaningful)) out.push(el);
  }
  return gallery(out);
}

function gallery(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let run: El[] = [];
  const flush = () => {
    if (run.length > 1) {
      const thumbs = run.map((img) => (img.attrs.srcset ? { ...img, attrs: { ...img.attrs, sizes: GALLERY_SIZES } } : img));
      out.push({ tag: "div", attrs: { class: "wp-gallery" }, children: thumbs });
    } else out.push(...run);
    run = [];
  };
  for (const n of nodes) {
    if (typeof n !== "string" && n.tag === "img") run.push(n);
    else if (typeof n === "string" && !n.trim() && run.length) continue;
    else {
      flush();
      out.push(n);
    }
  }
  flush();
  return out;
}

/* -------------------------------------------------------------- render */

/** Πόσο πλάτος πιάνουν οι εικόνες στη σελίδα (για να διαλέξει ο browser από το srcset). */
const IMAGE_SIZES = "(min-width: 1024px) 760px, 90vw";
const GALLERY_SIZES = "(min-width: 1024px) 240px, 45vw";

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function render(nodes: Node[]): string {
  return nodes
    .map((n) => {
      if (typeof n === "string") return n;
      let attrs = Object.entries(n.attrs)
        .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
        .join("");
      if (n.tag === "a" && /^https?:/.test(n.attrs.href)) attrs += ' target="_blank" rel="noopener noreferrer"';
      if (n.tag === "img") {
        if (n.attrs.srcset && !n.attrs.sizes) attrs += ` sizes="${IMAGE_SIZES}"`;
        return `<img${attrs} loading="lazy" decoding="async">`;
      }
      if (n.tag === "br") return "<br>";
      if (n.tag === "iframe") {
        return `<div class="wp-video"><iframe${attrs} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
      }
      if (n.tag === "videolink") {
        const { href, thumb, site, title } = n.attrs;
        return (
          `<a class="wp-video wp-video-link" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">` +
          `<img src="${escapeAttr(thumb)}" alt="" loading="lazy" decoding="async">` +
          `<span class="wp-video-play" aria-hidden="true"></span>` +
          `<span class="wp-video-caption">${escapeText(title)}<small>${escapeText(site)} ↗</small></span></a>`
        );
      }
      const html = `<${n.tag}${attrs}>${render(n.children)}</${n.tag}>`;
      // Οι πίνακες του παλιού site είναι φαρδιοί: κυλάνε οριζόντια στο κινητό.
      return n.tag === "table" ? `<div class="wp-table">${html}</div>` : html;
    })
    .join("");
}

/* ---------------------------------------------------------------- API */

export type CleanOptions = {
  /** Η διεύθυνση του παλιού site — για σχετικά links/εικόνες. */
  base: string;
  /** Σταματά ΠΡΙΝ από την επικεφαλίδα με αυτό το κείμενο (τόνοι/κεφαλαία δεν μετράνε). */
  until?: string;
};

export function cleanWpHtml(html: string, { base, until }: CleanOptions): string {
  let nodes = tidy(parse(html).flatMap((n) => clean(n, { base, inCell: false, inList: false })));
  if (until) {
    let stop = nodes.findIndex((n) => typeof n !== "string" && HEADING.test(n.tag) && norm(textOf(n)) === norm(until));
    if (stop !== -1) {
      // …μαζί με τον υπότιτλο που στέκεται ακριβώς από πάνω της.
      while (stop > 0 && (typeof nodes[stop - 1] === "string" ? !(nodes[stop - 1] as string).trim() : kicker.has(nodes[stop - 1] as El))) stop--;
      nodes = nodes.slice(0, stop);
    }
  }
  return render(prune(nodes, true))
    .replace(/\s{2,}/g, " ")
    .trim();
}
