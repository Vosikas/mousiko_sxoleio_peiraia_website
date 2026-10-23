import type { L } from "@/i18n/l10n";
import type { StandalonePage } from "./types";

/**
 * «ERASMUS+» — ξεχωριστή επιλογή στο κεντρικό μενού, πριν από τις Δράσεις.
 *
 * ΠΗΓΗ: το blog «Erasmus+ Music School of Piraeus» (ERASMUS_BLOG) — εκεί
 * γράφει η ομάδα Erasmus+ του σχολείου. Τα άρθρα του έρχονται ΑΥΤΟΜΑΤΑ (RSS)
 * και ανοίγουν μέσα στο site, στο /erasmus/<άρθρο>. Τα κείμενα αυτού του
 * αρχείου (πρόγραμμα, «γιατί Erasmus+», η χρονιά με μια ματιά) είναι παρμένα
 * από το blog· ενημέρωσέ τα όταν ξεκινήσει νέο πρόγραμμα ή νέα χρονιά.
 */
export const ERASMUS: StandalonePage = {
  slug: "erasmus",
  title: "Erasmus+",
  eyebrow: { el: "Ευρωπαϊκά προγράμματα", en: "European programmes" },
  summary: {
    el: "Όταν η μουσική συναντά την Ευρώπη: οι κινητικότητες, οι συνεργασίες και οι εμπειρίες μαθητών και καθηγητών μας μέσα από το Erasmus+.",
    en: "When music meets Europe: our mobilities, partnerships and the experiences of our students and teachers through Erasmus+.",
  },
  // Και τα άρθρα του WordPress του σχολείου με «Erasmus» στον τίτλο.
  wpCategories: ["Erasmus"],
  blocks: [],
};

/** Το blog της ομάδας Erasmus+ (WordPress του sch.gr) — από εδώ έρχονται τα άρθρα. */
export const ERASMUS_BLOG = "https://blogs.sch.gr/eleantony";

/** Ο πίνακας Padlet της κινητικότητας στη Μπολόνια (Διεύθυνση Δ.Ε. Πειραιά). */
export const ERASMUS_PADLET = {
  embed: "https://padlet.com/embed/nfs8vcniichwg3kn",
  link: "https://padlet.com/christodoulou1ralleio/_-erasmus-nfs8vcniichwg3kn",
  title: { el: "Διαπιστευμένη Εθνική Κοινοπραξία Erasmus+ — ΔΔΕ Πειραιά", en: "Accredited National Erasmus+ Consortium — Piraeus Directorate" } as L,
  text: {
    el: "Ο πίνακας της Διεύθυνσης Δευτεροβάθμιας Εκπαίδευσης Πειραιά για την κινητικότητα στο Liceo Laura Bassi της Μπολόνια.",
    en: "The Piraeus Directorate of Secondary Education's board for the mobility to Liceo Laura Bassi in Bologna.",
  } as L,
};

/** Το τρέχον πρόγραμμα — από τη σελίδα «ERASMUS+ 2025-2026» του blog. */
export const ERASMUS_PROGRAMME = {
  name: { el: "«Η Μουσική δίνει ενότητα στη διαφορετικότητα»", en: "“Music Gives Unity to Diversity”" } as L,
  action: "Erasmus+ KA122-SCH",
  code: "2025-1-EL01-KA122-SCH-000345707",
  paragraphs: [
    {
      el: "Το Μουσικό Σχολείο Πειραιά υλοποιεί το ευρωπαϊκό πρόγραμμα Erasmus+ KA122-SCH με τίτλο «Η Μουσική δίνει ενότητα στη διαφορετικότητα», το οποίο στοχεύει στην ενίσχυση της ευρωπαϊκής συνεργασίας, της συμπερίληψης και της καινοτομίας στην εκπαίδευση.",
      en: "The Music School of Piraeus is implementing the European Erasmus+ KA122-SCH program entitled “Music Gives Unity to Diversity,” which aims to strengthen European cooperation, inclusion, and innovation in education.",
    },
    {
      el: "Μέσα από δράσεις επιμόρφωσης, ανταλλαγής καλών πρακτικών και συνεργασίας με ευρωπαϊκούς εκπαιδευτικούς οργανισμούς, το σχολείο επιδιώκει να αξιοποιήσει τη μουσική ως ένα ισχυρό παιδαγωγικό εργαλείο που προάγει τον σεβασμό στη διαφορετικότητα, την πολιτισμική κατανόηση και τη δημιουργική έκφραση των μαθητών.",
      en: "Through training activities, the exchange of best practices, and collaboration with European educational organizations, the school seeks to utilize music as a powerful pedagogical tool that promotes respect for diversity, cultural understanding, and the creative expression of its students.",
    },
    {
      el: "Το πρόγραμμα δίνει τη δυνατότητα στους εκπαιδευτικούς να αναπτύξουν νέες παιδαγωγικές και ψηφιακές δεξιότητες, να γνωρίσουν καινοτόμες εκπαιδευτικές πρακτικές και να μεταφέρουν τις εμπειρίες αυτές στη σχολική κοινότητα. Παράλληλα, ενισχύεται η ευρωπαϊκή διάσταση της εκπαίδευσης και καλλιεργείται στους μαθητές το πνεύμα συνεργασίας, αλληλοσεβασμού και ανοιχτότητας προς άλλους πολιτισμούς.",
      en: "The program enables teachers to develop new pedagogical and digital skills, discover innovative educational practices, and transfer these experiences back to the school community. At the same time, it enhances the European dimension of education and cultivates a spirit of cooperation, mutual respect, and openness towards other cultures among students.",
    },
  ] as L[],
  stages: [
    { title: { el: "Επιμόρφωση εκπαιδευτικών", en: "Training courses" }, where: { el: "Ιταλία", en: "Italy" } },
    { title: { el: "Job shadowing", en: "Job shadowing" }, where: { el: "Ιταλία – Πολωνία", en: "Italy – Poland" } },
    {
      title: { el: "Επίσκεψη μαθητών και μαθητριών σε σχολείο του εξωτερικού", en: "Student visit to a school abroad" },
      where: { el: "Πολωνία", en: "Poland" },
    },
  ] as { title: L; where: L }[],
};

/** «Η αξία του Erasmus+ για το Μουσικό Σχολείο Πειραιά» — από το άρθρο καλωσορίσματος του blog. */
export const ERASMUS_VALUES: { title: L; text: L }[] = [
  {
    title: { el: "Διεύρυνση μουσικών οριζόντων", en: "Expanding musical horizons" },
    text: {
      el: "Οι μαθητές μας έρχονται σε επαφή με διαφορετικές μουσικές παραδόσεις, όργανα και τεχνικές. Συμπράττουν με συμμαθητές τους από την υπόλοιπη Ευρώπη, δημιουργώντας πολυπολιτισμικά μουσικά σύνολα που αποδεικνύουν ότι η τέχνη δεν έχει σύνορα.",
      en: "Our students come into contact with different musical traditions, instruments, and techniques. They collaborate with peers from across Europe, creating multicultural musical ensembles that prove art truly has no borders.",
    },
  },
  {
    title: { el: "Πολιτιστική ανταλλαγή & ευρωπαϊκή ταυτότητα", en: "Cultural exchange & European identity" },
    text: {
      el: "Ταξιδεύοντας, φιλοξενώντας και αλληλεπιδρώντας, οι μαθητές μας γίνονται ενεργοί Ευρωπαίοι πολίτες. Μαθαίνουν να σέβονται τη διαφορετικότητα, να καταρρίπτουν στερεότυπα και να χτίζουν γέφυρες φιλίας.",
      en: "By traveling, hosting, and interacting, our students become active European citizens. They learn to respect diversity, break down stereotypes, and build lasting bridges of friendship.",
    },
  },
  {
    title: { el: "Προσωπικές & γλωσσικές δεξιότητες", en: "Personal & language skills" },
    text: {
      el: "Η συμμετοχή σε ευρωπαϊκά προγράμματα ενισχύει την αυτοπεποίθηση, την προσαρμοστικότητα και την ομαδικότητα. Παράλληλα, αποτελεί το τέλειο περιβάλλον για την πρακτική εξάσκηση ξένων γλωσσών σε πραγματικές συνθήκες.",
      en: "Participating in European programs boosts self-confidence, adaptability, and teamwork. At the same time, it provides the perfect environment for practicing foreign languages in real-world situations.",
    },
  },
  {
    title: { el: "Εξωστρέφεια & καινοτομία", en: "International outlook & innovation" },
    text: {
      el: "Μέσω των συμπράξεων, οι εκπαιδευτικοί μας ανταλλάσσουν καλές πρακτικές και καινοτόμες διδακτικές μεθόδους με συναδέλφους τους από το εξωτερικό. Το Μουσικό Σχολείο Πειραιά εξελίσσεται σε έναν δυναμικό και ανοιχτό εκπαιδευτικό κόμβο.",
      en: "Through these partnerships, our educators exchange best practices and innovative teaching methods with colleagues from abroad. The Piraeus Music School is continuously evolving into a dynamic, open-minded educational hub.",
    },
  },
];

/**
 * Η χρονιά 2025–2026 με μια ματιά — σύνοψη των άρθρων του blog.
 * `post` = το τελευταίο κομμάτι της διεύθυνσης του άρθρου στο blog.
 */
export const ERASMUS_TIMELINE: { when: L; place: L; title: L; text: L; post: string }[] = [
  {
    when: { el: "14–20 Δεκεμβρίου 2025", en: "14–20 December 2025" },
    place: { el: "Μπολόνια, Ιταλία", en: "Bologna, Italy" },
    title: { el: "Επιμόρφωση εκπαιδευτικών", en: "Teacher training course" },
    text: {
      el: "«ChatGPT and AI for Teachers»: η τεχνητή νοημοσύνη στο σχολείο και στην εκπαίδευση, με την Erasmus Learning Academy.",
      en: "“ChatGPT and AI for Teachers”: artificial intelligence in schools and education, with Erasmus Learning Academy.",
    },
    post: "erasmus-training-courses-bologna-december-2025",
  },
  {
    when: { el: "Μάρτιος 2026", en: "March 2026" },
    place: { el: "Μπολόνια, Ιταλία", en: "Bologna, Italy" },
    title: { el: "Job shadowing", en: "Job shadowing" },
    text: {
      el: "Στο Liceo Musicale Laura Bassi, με την εκπαιδευτικό Μαρία Φραγκούλη.",
      en: "At Liceo Musicale Laura Bassi, with our teacher Maria Fragkouli.",
    },
    post: "job-shadowing-bologna-liceo-musicale-laura-basi",
  },
  {
    when: { el: "19–24 Απριλίου 2026", en: "19–24 April 2026" },
    place: { el: "Μπιάλιστοκ, Πολωνία", en: "Białystok, Poland" },
    title: { el: "Επίσκεψη μαθητών", en: "Student visit" },
    text: {
      el: "14 μαθητές και 5 εκπαιδευτικοί στο VII Liceum Ogólnokształcące: κοινά εργαστήρια και ηχογραφήσεις ελληνικής και πολωνικής μουσικής.",
      en: "14 students and 5 teachers at VII Liceum Ogólnokształcące: joint workshops recording Greek and Polish music.",
    },
    post: "piraeus-music-school-embarks-on-erasmus-journey-to-poland-music-gives-unity-to-diversity",
  },
  {
    when: { el: "18–22 Μαΐου 2026", en: "18–22 May 2026" },
    place: { el: "Σάσαρι, Σαρδηνία", en: "Sassari, Sardinia" },
    title: { el: "Job shadowing", en: "Job shadowing" },
    text: {
      el: "Οι καθηγήτριες Γ. Μπουμπουχεροπούλου και Π. Ευτυχιάδου στο Istituto Comprensivo Monte Rosello Alto.",
      en: "Our teachers G. Bouboucheropoulou and P. Eftychiadou at Istituto Comprensivo Monte Rosello Alto.",
    },
    post: "job-shadowing-istituto-comprensivo-monte-rosello-alto-in-sassari-sardinia",
  },
  {
    when: { el: "Σεπτέμβριος 2026", en: "September 2026" },
    place: { el: "Πειραιάς", en: "Piraeus" },
    title: { el: "Διάχυση των αποτελεσμάτων", en: "Sharing the results" },
    text: {
      el: "Τα αποτελέσματα του προγράμματος παρουσιάζονται στη σχολική κοινότητα και στην τοπική κοινωνία.",
      en: "The programme's results are presented to our school and the local community.",
    },
    post: "erasmus-dissemination-to-our-school-and-the-local-community",
  },
];
