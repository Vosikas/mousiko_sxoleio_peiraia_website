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
 * ΝΕΑ ΥΠΟΣΕΛΙΔΑ: πρόσθεσε ένα αντικείμενο στο `subpages` της ενότητας.
 * Εμφανίζεται αυτόματα στο μενού, στην κεντρική σελίδα της ενότητας
 * και στο πλαϊνό μενού των υπόλοιπων υποσελίδων.
 */

/** Παράγραφοι κειμένου. */
export type TextBlock = { type: "text"; title?: string; paragraphs: string[] };

/** Λίστα με κουκκίδες (σε δύο στήλες στις μεγάλες οθόνες). */
export type ListBlock = { type: "list"; title?: string; intro?: string; items: string[] };

/** Μεγάλοι αριθμοί με λεζάντα — π.χ. «6 · τάξεις». */
export type FactsBlock = { type: "facts"; title?: string; items: { value: string; label: string }[] };

/**
 * Αρχεία για λήψη (PDF κ.λπ.).
 * Χωρίς `href` το αρχείο δείχνει «Σύντομα» — βάλε το PDF στο /public και
 * γράψε π.χ. href: "/docs/kanonismos.pdf" για να ενεργοποιηθεί.
 */
export type DocumentsBlock = {
  type: "documents";
  title?: string;
  items: { title: string; href?: string; meta?: string }[];
};

/** Στοιχεία επικοινωνίας (ετικέτα → τιμή). Το `href` κάνει την τιμή σύνδεσμο. */
export type ContactBlock = {
  type: "contact";
  title?: string;
  items: { label: string; value: string; href?: string }[];
};

export type Block = TextBlock | ListBlock | FactsBlock | DocumentsBlock | ContactBlock;

export type Subpage = {
  /** Το τελευταίο κομμάτι του URL: /to-scholeio/<slug> */
  slug: string;
  /** Ο πλήρης τίτλος: στο μενού και ως επικεφαλίδα της σελίδας. */
  title: string;
  /** Σύντομος τίτλος για πλαϊνό μενού, διαδρομή και «Επόμενη». */
  shortTitle?: string;
  /** 1–2 προτάσεις: στην κάρτα, κάτω από τον τίτλο και στην περιγραφή SEO. */
  summary: string;
  blocks: Block[];
  /** true ⇒ σήμα «Ενδεικτικό περιεχόμενο». Βγάλ' το όταν μπει το τελικό κείμενο. */
  draft?: boolean;
};

export type Section = {
  /** Το URL της ενότητας: /<slug> */
  slug: string;
  title: string;
  /** Η μικρή ετικέτα πάνω από τον τίτλο. */
  eyebrow: string;
  intro: string;
  subpages: Subpage[];
};

/* ------------------------------------------------------------------ μενού */

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };
