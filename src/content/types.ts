import type { L } from "@/i18n/l10n";

/**
 * Οι τύποι του περιεχομένου των ενοτήτων «Το Σχολείο μας» και «Δράσεις».
 *
 * ΠΩΣ ΔΟΥΛΕΥΕΙ
 * Κάθε ενότητα (Section) έχει υποσελίδες (Subpage). Κάθε υποσελίδα είναι
 * μια σειρά από «τουβλάκια» (Block) που ζωγραφίζονται με το ίδιο template.
 * Δεν γράφεις JSX: συμπληρώνεις δεδομένα στα αρχεία
 *   src/content/to-scholeio.ts   και   src/content/draseis.ts
 * και η σελίδα, το μενού και οι σύνδεσμοι φτιάχνονται μόνα τους.
 *
 * ΓΛΩΣΣΕΣ: κάθε κείμενο είναι `L` — σκέτα ελληνικά ή { el: "…", en: "…" }.
 * Τα αγγλικά εμφανίζονται όταν ο επισκέπτης πατήσει EN (src/i18n/l10n.ts).
 *
 * ΝΕΑ ΥΠΟΣΕΛΙΔΑ: πρόσθεσε ένα αντικείμενο στο `subpages` της ενότητας.
 * Εμφανίζεται αυτόματα στο μενού, στην κεντρική σελίδα της ενότητας
 * και στο πλαϊνό μενού των υπόλοιπων υποσελίδων.
 */

/** Παράγραφοι κειμένου. */
export type TextBlock = { type: "text"; title?: L; paragraphs: L[] };

/** Λίστα με κουκκίδες (σε δύο στήλες στις μεγάλες οθόνες). */
export type ListBlock = { type: "list"; title?: L; intro?: L; items: L[] };

/** Μεγάλοι αριθμοί με λεζάντα — π.χ. «6 · τάξεις». */
export type FactsBlock = { type: "facts"; title?: L; items: { value: string; label: L }[] };

/**
 * Αρχεία για λήψη (PDF κ.λπ.).
 * Χωρίς `href` το αρχείο δείχνει «Σύντομα» — βάλε το PDF στο /public και
 * γράψε π.χ. href: "/docs/kanonismos.pdf" για να ενεργοποιηθεί.
 */
export type DocumentsBlock = {
  type: "documents";
  title?: L;
  items: { title: L; href?: string; meta?: L }[];
};

/** Στοιχεία επικοινωνίας (ετικέτα → τιμή). Το `href` κάνει την τιμή σύνδεσμο. */
export type ContactBlock = {
  type: "contact";
  title?: L;
  items: { label: L; value: L; href?: string }[];
};

export type Block = TextBlock | ListBlock | FactsBlock | DocumentsBlock | ContactBlock;

export type Subpage = {
  /** Το τελευταίο κομμάτι του URL: /to-scholeio/<slug> */
  slug: string;
  /** Ο πλήρης τίτλος: στο μενού και ως επικεφαλίδα της σελίδας. */
  title: L;
  /** Σύντομος τίτλος για το πλαϊνό μενού και την «Προηγούμενη / Επόμενη». */
  shortTitle?: L;
  /** 1–2 προτάσεις: στην κάρτα, κάτω από τον τίτλο και στην περιγραφή SEO. */
  summary: L;
  blocks: Block[];
  /** true ⇒ το κείμενο είναι ακόμη ενδεικτικό (δεν φαίνεται στον επισκέπτη· σημείωση για εμάς). */
  draft?: boolean;
  /**
   * Κατηγορίες του WordPress: η σελίδα δείχνει τα άρθρα τους κάτω από το
   * περιεχόμενο, και κάθε άρθρο ανοίγει για ανάγνωση. Γράψε το ΟΝΟΜΑ της
   * κατηγορίας όπως φαίνεται στο WordPress — τόνοι/κεφαλαία δεν μετράνε.
   * Χωρίς αυτό το πεδίο η σελίδα δεν αγγίζει καθόλου το WordPress.
   */
  wpCategories?: string[];
  /**
   * ΠΕΡΙΕΧΟΜΕΝΟ ΑΠΟ ΤΟ ΠΑΛΙΟ SITE: μία ή περισσότερες σελίδες του WordPress.
   * Όταν οριστεί, η υποσελίδα δείχνει ΑΥΤΟ το κείμενο (καθαρισμένο, με την
   * εμφάνιση του νέου site) αντί για τα `blocks`. Τα `blocks` μένουν ως
   * εφεδρεία, αν η σελίδα του WordPress σβηστεί. Για επιστροφή στο δικό μας
   * κείμενο: σβήσε αυτό το πεδίο.
   */
  wpContent?: WpSource[];
  /**
   * ΒΙΝΤΕΟ ΑΠΟ ΤΟ ΠΑΛΙΟ SITE: τα Portfolio Items μιας κατηγορίας (π.χ.
   * «Βίντεο»), σε ομάδες ανάλογα με τα tags τους. Κάθε ομάδα είναι ένα κουτί
   * με δικό της `id`, ώστε να ανοίγει απευθείας: /draseis/synavlies#symfoniki
   */
  videos?: VideoGallery;
};

export type VideoGallery = {
  /** Η κατηγορία Portfolio στο WordPress (όνομα — τόνοι/κεφαλαία δεν μετράνε). */
  category: string;
  groups: { id: string; title: L; tags: string[] }[];
};

/**
 * Μια σελίδα του παλιού site. Το `id` φαίνεται στο WordPress όταν ανοίγεις
 * τη σελίδα για επεξεργασία (…post.php?post=<id>).
 *   type "page"      → Σελίδες
 *   type "post"      → Άρθρα
 *   type "portfolio" → Portfolio Items του θέματος Enfold (οι διευθύνσεις /msp/…)
 */
export type WpSource = {
  type: "page" | "post" | "portfolio";
  id: number;
  /** Κόβει το κείμενο ΠΡΙΝ από την επικεφαλίδα με αυτό το κείμενο. */
  until?: string;
};

export type Section = {
  /** Το URL της ενότητας: /<slug> */
  slug: string;
  title: L;
  /** Η μικρή ετικέτα πάνω από τον τίτλο. */
  eyebrow: L;
  intro: L;
  subpages: Subpage[];
};

/**
 * Αυτόνομη σελίδα χωρίς υποσελίδες (π.χ. Erasmus): ίδια «τουβλάκια» και
 * ίδια ροή άρθρων με τις υποσελίδες, απλώς χωρίς πλαϊνό μενού.
 * Αν αργότερα χρειαστεί υποσελίδες, γίνεται Section.
 */
export type StandalonePage = Subpage & {
  /** Η μικρή ετικέτα πάνω από τον τίτλο. */
  eyebrow: L;
};

/* ------------------------------------------------------------------ μενού */

export type NavLink = { label: L; href: string };
export type NavItem = NavLink & { children?: NavLink[] };
