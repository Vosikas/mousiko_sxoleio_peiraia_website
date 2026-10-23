/**
 * «ΤΡΑΓΟΥΔΙ ΤΗΣ ΗΜΕΡΑΣ» — από τις γραμμές ενός πίνακα (το Excel του σχολείου)
 * στα τραγούδια, και η επιλογή του τραγουδιού κάθε μέρας.
 * Χωρίς εξαρτήσεις: ασφαλές για server, browser και δοκιμές.
 *
 * Οι στήλες μπορούν να είναι με όποια σειρά, και να υπάρχουν κι άλλες
 * (π.χ. «Ημέρα», «α/α»). Για κάθε γραμμή:
 *   link        → το πρώτο κελί με σύνδεσμο (YouTube, Spotify ή οτιδήποτε)
 *   ημερομηνία  → προαιρετική: 24/12 (κάθε χρόνο) ή 24/12/2026 (μόνο τότε)
 *   κομμάτι / καλλιτέχνης → από την επικεφαλίδα, αν υπάρχει· αλλιώς τα δύο
 *                           πρώτα κείμενα της γραμμής
 * Γραμμές χωρίς σύνδεσμο (π.χ. η επικεφαλίδα) δεν γίνονται τραγούδια.
 */

// Μόνο τύπος — δεν φέρνει τον κώδικα του server (zlib) στον browser.
import type { Cell } from "./xlsx";

export type SongSource = "youtube" | "spotify" | "link";

export type Song = {
  title: string;
  artist?: string;
  url: string;
  source: SongSource;
  /** YouTube: το id του βίντεο · Spotify: «track/ID», «album/ID» κ.λπ. */
  embedId?: string;
  /** Ο κάτοχος του βίντεο δεν επιτρέπει να παίζει σε άλλα sites: ανοίγει στο YouTube. */
  noEmbed?: boolean;
  /** Ημερομηνία: χωρίς `year` ισχύει κάθε χρόνο. */
  day?: number;
  month?: number;
  year?: number;
};

/** Χωρίς τόνους και κεφαλαία: «Συνθέτης» → «συνθετησ». */
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
 * και οι ημερομηνίες που το Excel αποθηκεύει ως αριθμό (π.χ. 46296)
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
  // Αύξων αριθμός ημέρας του Excel (1 = 1/1/1900)· μόνο σε λογικό εύρος (1955–2119).
  if (/^\d{5}(\.\d+)?$/.test(t) && +t > 20_000 && +t < 80_000) {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(+t) * 86_400_000);
    return valid(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
  }
  return null;
}

const year = (y?: string) => (y ? (y.length === 2 ? 2000 + +y : +y) : undefined);

function valid(day: number, month: number, year?: number) {
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) return null;
  return year ? { day, month, year } : { day, month };
}

/* -------------------------------------------------------------- πίνακας */

const TITLE_WORDS = ["κομματ", "τιτλο", "τραγουδι", "εργο", "title", "song", "piece"];
const ARTIST_WORDS = ["καλλιτεχν", "ερμηνευτ", "τραγουδιστ", "συνθετ", "artist", "singer", "composer"];
const WEEKDAYS = new Set(
  ["δευτερα", "τριτη", "τεταρτη", "πεμπτη", "παρασκευη", "σαββατο", "κυριακη",
   "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
);
const matches = (words: string[]) => (text: string) => words.some((w) => key(text).includes(w));

export function parseSongRows(rows: Cell[][]): Song[] {
  let titleCol = -1;
  let artistCol = -1;
  const songs: Song[] = [];

  for (const cells of rows) {
    const texts = cells.map((c) => c.text.trim());
    const linkCol = cells.findIndex((c, i) => c.href || /^https?:\/\//i.test(texts[i]));

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

    const url = (cells[linkCol].href ?? texts[linkCol]).trim();
    const dateCol = texts.findIndex((x, i) => i !== linkCol && parseDate(x));
    const date = dateCol === -1 ? null : parseDate(texts[dateCol]);

    // Κείμενα της γραμμής, χωρίς link, ημερομηνία, μέρα της εβδομάδας και σκέτους αριθμούς (α/α).
    const free = texts.filter(
      (x, i) => x && i !== linkCol && i !== dateCol && !/^\d+\.?$/.test(x) && !WEEKDAYS.has(key(x)),
    );
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
const dayOf = (s: Song) => Math.floor(Date.UTC(s.year!, s.month! - 1, s.day!) / 86_400_000);

/**
 * Το τραγούδι μιας μέρας:
 *  1. τραγούδι με ΑΚΡΙΒΗ ημερομηνία (24/12/2026),
 *  2. αλλιώς τραγούδι για αυτή τη μέρα κάθε χρόνο (24/12),
 *  3. αλλιώς τα τραγούδια ΧΩΡΙΣ ημερομηνία, ένα τη μέρα, με τη σειρά του
 *     πίνακα και κυκλικά,
 *  4. αλλιώς (ημερολόγιο σχολικής χρονιάς, όπου όλα έχουν ημερομηνία) σε
 *     μέρες χωρίς τραγούδι — Σαββατοκύριακα, διακοπές — μένει το τελευταίο
 *     που πέρασε· πριν ξεκινήσει το ημερολόγιο, το πρώτο. Τότε `today: false`.
 */
export function songForDate(songs: Song[], d: Date): { song: Song; today: boolean } | null {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const exact = songs.find((s) => s.day === day && s.month === month && s.year === d.getFullYear());
  if (exact) return { song: exact, today: true };
  const yearly = songs.find((s) => s.day === day && s.month === month && s.year === undefined);
  if (yearly) return { song: yearly, today: true };
  const pool = songs.filter((s) => s.day === undefined);
  if (pool.length) return { song: pool[dayNumber(d) % pool.length], today: true };

  const dated = songs.filter((s) => s.year !== undefined).sort((a, b) => dayOf(a) - dayOf(b));
  const before = dated.filter((s) => dayOf(s) <= dayNumber(d));
  const song = before.at(-1) ?? dated[0];
  return song ? { song, today: false } : null;
}
