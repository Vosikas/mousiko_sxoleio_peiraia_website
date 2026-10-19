import type { Section } from "./types";

/**
 * «ΔΡΑΣΕΙΣ» — το περιεχόμενο της ενότητας.
 *
 * Τα κείμενα είναι ΕΝΔΕΙΚΤΙΚΑ (draft: true). Αντικατάστησέ τα με το
 * τελικό κείμενο και σβήσε το `draft: true`.
 *
 * ΑΡΘΡΑ ΑΠΟ ΤΟ WORDPRESS: κάθε υποσελίδα δείχνει τα άρθρα των κατηγοριών
 * του `wpCategories` — είτε είναι στην κατηγορία στο WordPress είτε ο
 * τίτλος τους περιέχει τις λέξεις του CATEGORY_KEYWORDS (src/content/news.ts).
 * ΒΙΝΤΕΟ / ΚΕΙΜΕΝΑ ΑΠΟ ΤΟ ΠΑΛΙΟ SITE: πεδία `videos` και `wpContent`.
 * Τύποι τουβλακιών και οδηγίες: src/content/types.ts
 */
export const DRASEIS: Section = {
  slug: "draseis",
  title: { el: "Δράσεις", en: "Activities" },
  eyebrow: { el: "Σχολική ζωή", en: "School life" },
  intro:
    { el: "Η μουσική ζωή του σχολείου πέρα από την τάξη: εργαστήρια, συναυλίες, εκδηλώσεις, προγράμματα και εκδρομές.", en: "The school's musical life beyond the classroom: workshops, concerts, events, programmes and trips." },
  subpages: [
    {
      slug: "ergastiria",
      wpCategories: ["Εργαστήρια"],
      title: { el: "Παρουσιάσεις Εργαστηρίων", en: "Workshop Presentations" },
      shortTitle: { el: "Εργαστήρια", en: "Workshops" },
      summary:
        { el: "Οι μαθητές και οι μαθήτριες παρουσιάζουν δημόσια ό,τι δημιούργησαν στα εργαστήρια της χρονιάς.", en: "Students present in public what they created in the year's workshops." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Σε κάθε παρουσίαση τα εργαστήρια ανοίγουν στο κοινό: οι μαθητές δείχνουν τη δουλειά τους και μοιράζονται τη διαδικασία που οδήγησε σε αυτήν.", en: "At each presentation the workshops open to the public: students show their work and share the process behind it." },
          ],
        },
        {
          type: "list",
          title: { el: "Τι παρουσιάζεται", en: "What is presented" },
          items: [
            { el: "Εργαστήρια σύνθεσης και αυτοσχεδιασμού", en: "Composition and improvisation workshops" },
            { el: "Εργαστήρια μουσικής τεχνολογίας", en: "Music technology workshops" },
            { el: "Μουσικό θέατρο", en: "Music theatre" },
            { el: "Διαθεματικά εργαστήρια", en: "Cross-curricular workshops" },
          ],
        },
      ],
    },
    {
      slug: "synavlies",
      wpCategories: ["Συναυλίες"],
      // Τα βίντεο του παλιού site (Portfolio «Βίντεο»), ανά μουσικό σύνολο —
      // ομάδα = tag του WordPress. Τα #id ανοίγουν από την κάρτα της αρχικής.
      videos: {
        category: "Βίντεο",
        groups: [
          { id: "symfoniki", title: { el: "Συμφωνική Ορχήστρα", en: "Symphony Orchestra" }, tags: ["ΣΥΜΦΩΝΙΚΗ ΟΡΧΗΣΤΡΑ"] },
          { id: "laiki", title: { el: "Λαϊκή Ορχήστρα", en: "Popular Music Orchestra" }, tags: ["ΛΑΙΚΗ ΟΡΧΗΣΤΡΑ"] },
          { id: "paradosiaka", title: { el: "Παραδοσιακά Σύνολα", en: "Traditional Music Ensembles" }, tags: ["ΠΑΡΑΔΟΣΙΑΚΑ"] },
          { id: "entechno", title: { el: "Έντεχνο", en: "Entechno Ensemble" }, tags: ["ΕΝΤΕΧΝΟ"] },
          { id: "chorodies", title: { el: "Χορωδίες", en: "Choirs" }, tags: ["ΧΟΡΩΔΙΕΣ"] },
        ],
      },
      title: { el: "Συναυλίες", en: "Concerts" },
      summary:
        { el: "Οι συναυλίες των συνόλων, της χορωδίας και των σολίστ του σχολείου, μέσα και έξω από τον Πειραιά.", en: "Concerts by the school's ensembles, choir and soloists, in Piraeus and beyond." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Εδώ συγκεντρώνονται οι συναυλίες της χρονιάς: τα μουσικά σύνολα, η χορωδία και τα ρεσιτάλ των μαθητών, με ημερομηνίες, χώρους και πρόγραμμα.", en: "This is where the year's concerts are gathered: the music ensembles, the choir and student recitals, with dates, venues and programmes." },
          ],
        },
        {
          type: "list",
          title: { el: "Σύνολα που εμφανίζονται", en: "Performing ensembles" },
          items: [{ el: "Ορχήστρα", en: "Orchestra" }, { el: "Χορωδία", en: "Choir" }, { el: "Σύνολα παραδοσιακής μουσικής", en: "Traditional music ensembles" }, { el: "Σύνολα μοντέρνας μουσικής", en: "Contemporary music ensembles" }],
        },
      ],
    },
    {
      slug: "ekdiloseis",
      wpCategories: ["Εκδηλώσεις"],
      videos: {
        category: "Βίντεο",
        groups: [
          {
            id: "scholikes",
            title: { el: "Σχολικές εκδηλώσεις", en: "School events" },
            tags: ["ΣΧΟΛΙΚΕΣ ΕΚΔΗΛΩΣΕΙΣ", "ΝΕΑ ΜΟΥΣΙΚΟΥ"],
          },
        ],
      },
      title: { el: "Εκδηλώσεις", en: "Events" },
      summary:
        { el: "Σχολικές γιορτές, επετειακές εκδηλώσεις και ανοιχτές εκδηλώσεις για γονείς και κοινό.", en: "School celebrations, commemorations and open events for parents and the public." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Οι εκδηλώσεις της σχολικής χρονιάς — από τις εθνικές επετείους μέχρι τη γιορτή λήξης — με το πρόγραμμα και τις πληροφορίες για όσους θέλουν να τις παρακολουθήσουν.", en: "The events of the school year — from national anniversaries to the end-of-year celebration — with programmes and information for anyone who would like to attend." },
          ],
        },
      ],
    },
    {
      slug: "programmata",
      // Το Erasmus έχει δική του σελίδα στο μενού (src/content/erasmus.ts).
      wpCategories: ["Προγράμματα"],
      wpContent: [
        { type: "portfolio", id: 1071 }, // «School Exchange» — e-twinning 2014
        { type: "portfolio", id: 1063 }, // Αδελφοποίηση με το Λύκειο Capriotti
      ],
      title: { el: "Προγράμματα", en: "Programmes" },
      summary:
        { el: "Τα εθνικά και ευρωπαϊκά προγράμματα στα οποία συμμετέχει το σχολείο, όπως ανταλλαγές και συνεργασίες.", en: "The national and European programmes the school takes part in, such as exchanges and partnerships." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Κάθε πρόγραμμα με μια σύντομη περιγραφή: στόχος, συνεργαζόμενα σχολεία, διάρκεια και ό,τι προέκυψε από αυτό.", en: "Each programme with a short description: its goal, partner schools, duration and outcomes." },
          ],
        },
        {
          type: "list",
          title: { el: "Κατηγορίες", en: "Categories" },
          items: [{ el: "Ευρωπαϊκά προγράμματα", en: "European programmes" }, { el: "Εθνικά προγράμματα", en: "National programmes" }, { el: "Πολιτιστικά προγράμματα", en: "Cultural programmes" }, { el: "Προγράμματα σχολικών δραστηριοτήτων", en: "School activity programmes" }],
        },
      ],
    },
    {
      slug: "ekdromes",
      wpCategories: ["Εκδρομές"],
      // Οι «Επισκέψεις» του παλιού site.
      wpContent: [
        { type: "portfolio", id: 1099 }, // Γερμανική Εκκλησία Αθηνών, 21/11/2019
        { type: "portfolio", id: 1287 }, // Ο Τίτος Πατρίκιος στο ΜΣΠ
      ],
      title: { el: "Εκδρομές", en: "Trips" },
      summary:
        { el: "Εκπαιδευτικές εκδρομές, επισκέψεις σε χώρους πολιτισμού και μουσικά ταξίδια των τάξεων.", en: "Educational trips, visits to cultural venues and musical journeys by our classes." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Οι εκδρομές και οι επισκέψεις της χρονιάς, με προορισμό, τάξεις που συμμετέχουν και σύντομο απολογισμό.", en: "The year's trips and visits, with destinations, participating classes and a short review." },
          ],
        },
      ],
    },
  ],
};
