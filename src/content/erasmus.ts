import type { StandalonePage } from "./types";

/**
 * «ERASMUS» — ξεχωριστή επιλογή στο κεντρικό μενού, πριν από τις Δράσεις.
 *
 * Τα κείμενα είναι ΕΝΔΕΙΚΤΙΚΑ (draft: true). Αντικατάστησέ τα με το
 * τελικό κείμενο και σβήσε το `draft: true`.
 *
 * ΑΡΘΡΑ: η σελίδα δείχνει ό,τι μπαίνει στην κατηγορία «Erasmus» του
 * WordPress (υπάρχει ήδη) — κάθε άρθρο ανοίγει για ανάγνωση.
 * Τύποι τουβλακιών και οδηγίες: src/content/types.ts
 */
export const ERASMUS: StandalonePage = {
  slug: "erasmus",
  title: "Erasmus+",
  eyebrow: { el: "Ευρωπαϊκά προγράμματα", en: "European programmes" },
  summary:
    { el: "Η συμμετοχή του σχολείου στο πρόγραμμα Erasmus+ της Ευρωπαϊκής Ένωσης: συνεργασίες, κινητικότητες και οι εμπειρίες των μαθητών μας.", en: "The school's participation in the European Union's Erasmus+ programme: partnerships, mobilities and our students' experiences." },
  draft: true,
  wpCategories: ["Erasmus"],
  blocks: [
    {
      type: "text",
      title: { el: "Το πρόγραμμα", en: "The programme" },
      paragraphs: [
        { el: "Εδώ παρουσιάζεται η συμμετοχή του σχολείου στο Erasmus+: ποια σχέδια υλοποιούνται, με ποια σχολεία συνεργαζόμαστε και ποιοι είναι οι στόχοι τους.", en: "This section presents the school's participation in Erasmus+: which projects are running, which schools we work with and what they aim to achieve." },
        { el: "Μια δεύτερη παράγραφος μπορεί να εξηγεί πώς επιλέγονται οι μαθητές και οι εκπαιδευτικοί που συμμετέχουν στις κινητικότητες.", en: "A second paragraph can explain how the students and teachers taking part in mobilities are selected." },
      ],
    },
    {
      type: "list",
      title: { el: "Τι περιλαμβάνει", en: "What it includes" },
      items: [
        { el: "Κινητικότητες μαθητών", en: "Student mobilities" },
        { el: "Κινητικότητες εκπαιδευτικών", en: "Teacher mobilities" },
        { el: "Συνεργασίες με σχολεία άλλων χωρών", en: "Partnerships with schools abroad" },
        { el: "Κοινές μουσικές δράσεις και συναυλίες", en: "Joint music activities and concerts" },
        { el: "Διάχυση των αποτελεσμάτων", en: "Sharing the results" },
      ],
    },
  ],
};
