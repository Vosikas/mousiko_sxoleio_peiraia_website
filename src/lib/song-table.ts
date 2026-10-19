/**
 * «ΤΡΑΓΟΥΔΙ ΤΗΣ ΗΜΕΡΑΣ» — διαβάζει τον πίνακα της σελίδας του WordPress.
 * Χωρίς εξαρτήσεις: ασφαλές για server, browser και δοκιμές.
 *
 * Ο πίνακας μπορεί να έχει τις στήλες με όποια σειρά (και επιπλέον στήλες,
 * π.χ. «α/α»). Για κάθε γραμμή:
 *   link        → το πρώτο κελί με σύνδεσμο (YouTube, Spotify ή οτιδήποτε)
 *   ημερομηνία  → προαιρετική: 24/12 (κάθε χρόνο) ή 24/12/2026 (μόνο τότε)
 *   τίτλος / καλλιτέχνης → από την επικεφαλίδα, αν υπάρχει· αλλιώς τα δύο
 *                          πρώτα κείμενα της γραμμής
 * Γραμμές χωρίς σύνδεσμο (π.χ. η επικεφαλίδα) δεν γίνονται τραγούδια.
 */

export type SongSource = "youtube" | "spotify" | "link";

export type Song = {
  title: string;
  artist?: string;
  url: string;
  source: SongSource;
  /** YouTube: το id του βίντεο · Spotify: «track/ID», «album/ID» κ.λπ. */
  embedId?: string;
  /** Ειδική μέρα: χωρίς `year` ισχύει κάθε χρόνο. */
  day?: number;
  month?: number;
  year?: number;
};

/* ------------------------------------------------------------- κείμενο */

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…" };

/** Το WordPress γράφει π.χ. το «&» των links ως «&#038;». */
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] !== "#") return NAMED[e.toLowerCase()] ?? m;
    const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
    return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
  });
const textOf = (html: string) =>
  decode(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
const hrefOf = (html: string) => {
  const m = html.match(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/i);
  return m ? decode(m[1]).trim() : undefined;
};
/** Χωρίς τόνους και κεφαλαία: «Ερμηνευτής» → «ερμηνευτησ». */
const key = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ς/g, "σ").trim();

/* ------------------------------------------------------------ σύνδεσμοι */

export function classify(url: string): Pick<Song, "source" | "embedId"> {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { source: "link" };
  }
  const host = u.hostname.replace(/^(www|m|music)\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.split("/")[1];
    if (id) return { source: "youtube", embedId: id };
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1];
    if (id) return { source: "youtube", embedId: id };
  }
  if (host === "open.spotify.com") {
    const m = u.pathname.match(/(?:^|\/)(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
    if (m) return { source: "spotify", embedId: `${m[1]}/${m[2]}` };
  }
  return { source: "link" };
}

/* ----------------------------------------------------------- ημερομηνίες */

// Πρώτα γράμματα των μηνών, χωρίς τόνους (ελληνικά και αγγλικά).
const MONTHS = [
  ["ιαν", "jan"], ["φεβ", "feb"], ["μαρ", "mar"], ["απρ", "apr"], ["μαι", "may"], ["ιουν", "jun"],
  ["ιουλ", "jul"], ["αυγ", "aug"], ["σεπ", "sep"], ["οκτ", "oct"], ["νοε", "nov"], ["δεκ", "dec"],
];
const monthOf = (word: string) => {
  const w = key(word);
  const i = MONTHS.findIndex((names) => names.some((n) => w.startsWith(n)));
  return i === -1 ? NaN : i + 1;
};

/**
 * 24/12 · 24-12 · 24.12 · 24/12/2026 · 2026-12-24 · 24 Δεκ · 24-Δεκεμβρίου-2026
 * → { day, month, year? }
 */
export function parseDate(text: string): Pick<Song, "day" | "month" | "year"> | null {
  const t = text.trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return valid(+m[3], +m[2], +m[1]);
  m = t.match(/^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-](\d{2}|\d{4}))?$/);
  if (m) return valid(+m[1], +m[2], year(m[3]));
  m = t.match(/^(\d{1,2})[\s/.\-]+([^\d\s/.\-]{3,})[\s/.\-]*(\d{2}|\d{4})?$/);
  if (m) return valid(+m[1], monthOf(m[2]), year(m[3]));
  return null;
}

const year = (y?: string) => (y ? (y.length === 2 ? 2000 + +y : +y) : undefined);

function valid(day: number, month: number, year?: number) {
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) return null;
  return year ? { day, month, year } : { day, month };
}

/* -------------------------------------------------------------- πίνακας */

const TITLE_WORDS = ["τιτλο", "τραγουδι", "title", "song"];
const ARTIST_WORDS = ["καλλιτεχν", "ερμηνευτ", "τραγουδιστ", "συνθετ", "artist", "singer"];
const matches = (words: string[]) => (text: string) => words.some((w) => key(text).includes(w));

export function parseSongTable(html: string): Song[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) =>
    [...r[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => c[1]),
  );

  let titleCol = -1;
  let artistCol = -1;
  const songs: Song[] = [];

  for (const cells of rows) {
    const texts = cells.map(textOf);
    const linkCol = cells.findIndex((c, i) => hrefOf(c) || /^https?:\/\//i.test(texts[i]));

    if (linkCol === -1) {
      // Επικεφαλίδα: γραμμή χωρίς σύνδεσμο πριν από το πρώτο τραγούδι.
      // Πρώτα ο καλλιτέχνης, ώστε το «Τραγουδιστής» να μη θεωρηθεί «Τραγούδι».
      // Κενές γραμμές δεν «σβήνουν» μια επικεφαλίδα που βρέθηκε ήδη.
      const artist = texts.findIndex(matches(ARTIST_WORDS));
      const title = texts.findIndex((x, i) => i !== artist && matches(TITLE_WORDS)(x));
      if (!songs.length && (artist !== -1 || title !== -1)) {
        artistCol = artist;
        titleCol = title;
      }
      continue;
    }

    const url = hrefOf(cells[linkCol]) ?? texts[linkCol];
    const dateCol = texts.findIndex((x, i) => i !== linkCol && parseDate(x));
    const date = dateCol === -1 ? null : parseDate(texts[dateCol]);

    // Κείμενα της γραμμής, χωρίς link, ημερομηνία και σκέτους αριθμούς (α/α).
    const free = texts.filter((x, i) => x && i !== linkCol && i !== dateCol && !/^\d+\.?$/.test(x));
    const at = (col: number) => (col !== -1 && col !== linkCol && col !== dateCol && texts[col]) || undefined;
    const title = at(titleCol) ?? free[0];
    const artist = at(artistCol) ?? free.find((x) => x !== title);

    songs.push({
      title: title || url,
      ...(artist && artist !== title ? { artist } : {}),
      url,
      ...classify(url),
      ...(date ?? {}),
    });
  }
  return songs;
}

/* -------------------------------------------------------- επιλογή μέρας */

/** Αύξων αριθμός της (τοπικής) ημέρας — ίδιος για όλους όλη τη μέρα. */
const dayNumber = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);

/**
 * Το τραγούδι μιας μέρας:
 *  1. τραγούδι με ΑΚΡΙΒΗ ημερομηνία (24/12/2026),
 *  2. αλλιώς τραγούδι για αυτή τη μέρα κάθε χρόνο (24/12),
 *  3. αλλιώς τα τραγούδια ΧΩΡΙΣ ημερομηνία, ένα τη μέρα, με τη σειρά του
 *     πίνακα και κυκλικά.
 */
export function songForDate(songs: Song[], d: Date): Song | null {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const exact = songs.find((s) => s.day === day && s.month === month && s.year === d.getFullYear());
  if (exact) return exact;
  const yearly = songs.find((s) => s.day === day && s.month === month && s.year === undefined);
  if (yearly) return yearly;
  const pool = songs.filter((s) => s.day === undefined);
  return pool.length ? pool[dayNumber(d) % pool.length] : null;
}
