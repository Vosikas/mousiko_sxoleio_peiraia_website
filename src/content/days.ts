import type { L } from "@/i18n/l10n";

/**
 * «ΣΑΝ ΣΗΜΕΡΑ» & ΠΑΓΚΟΣΜΙΕΣ ΗΜΕΡΕΣ — τα δεδομένα του widget της αρχικής.
 *
 * Δύο λίστες, και οι δύο με ημερομηνία «ΜΜ-ΗΗ» (μήνας-ημέρα):
 *   WORLD_DAYS   → «Σήμερα είναι η …»  (παγκόσμιες/διεθνείς/εθνικές ημέρες)
 *   ON_THIS_DAY  → «Σαν σήμερα, 1925: …» (ιστορικά γεγονότα, με το έτος)
 *
 * ΓΛΩΣΣΕΣ: κάθε name/text είναι { el, en } — δείτε src/i18n/l10n.ts.
 *
 * ΠΡΟΣΘΗΚΗ: μια νέα γραμμή σε όποια λίστα θέλετε — π.χ. σημαντικά γεγονότα
 * του ίδιου του σχολείου (ίδρυση, διακρίσεις, πρώτη συναυλία).
 * `music: true` → τονίζεται με ♪ ως μουσικό γεγονός.
 *
 * Οι ημερομηνίες είναι του Γρηγοριανού ημερολογίου. Παραλείψαμε σκόπιμα
 * ελληνικές ημερομηνίες πριν από το 1923 (Ιουλιανό ημερολόγιο), όπου η
 * «σωστή» μέρα είναι αμφίσημη. Καλό είναι να τα ελέγξει ένας καθηγητής.
 */

export type Observance = { date: string; name: L; music?: boolean };
export type HistoryEvent = { date: string; year: number; text: L; music?: boolean };

/** Διαβάζεται ως «Σήμερα είναι η <name>» — γι' αυτό κάθε όνομα είναι θηλυκό. */
export const WORLD_DAYS: Observance[] = [
  { date: "01-24", name: { el: "Διεθνής Ημέρα Εκπαίδευσης", en: "International Day of Education" } },
  { date: "01-27", name: { el: "Διεθνής Ημέρα Μνήμης για τα Θύματα του Ολοκαυτώματος", en: "International Holocaust Remembrance Day" } },
  { date: "01-30", name: { el: "Εορτή των Τριών Ιεραρχών — Ημέρα των Γραμμάτων", en: "Feast of the Three Holy Hierarchs — Day of Letters" } },
  { date: "02-09", name: { el: "Παγκόσμια Ημέρα Ελληνικής Γλώσσας", en: "World Greek Language Day" } },
  { date: "02-11", name: { el: "Διεθνής Ημέρα Γυναικών και Κοριτσιών στην Επιστήμη", en: "International Day of Women and Girls in Science" } },
  { date: "02-13", name: { el: "Παγκόσμια Ημέρα Ραδιοφώνου", en: "World Radio Day" } },
  { date: "02-21", name: { el: "Διεθνής Ημέρα Μητρικής Γλώσσας", en: "International Mother Language Day" } },
  { date: "03-06", name: { el: "Πανελλήνια Ημέρα κατά της Σχολικής Βίας και του Εκφοβισμού", en: "Greek National Day against School Violence and Bullying" } },
  { date: "03-08", name: { el: "Παγκόσμια Ημέρα της Γυναίκας", en: "International Women's Day" } },
  { date: "03-14", name: { el: "Διεθνής Ημέρα Μαθηματικών", en: "International Day of Mathematics" } },
  { date: "03-20", name: { el: "Διεθνής Ημέρα Ευτυχίας", en: "International Day of Happiness" } },
  { date: "03-21", name: { el: "Παγκόσμια Ημέρα Ποίησης", en: "World Poetry Day" } },
  { date: "03-21", name: { el: "Ευρωπαϊκή Ημέρα Παλαιάς Μουσικής", en: "European Early Music Day" }, music: true },
  { date: "03-21", name: { el: "Παγκόσμια Ημέρα για το Σύνδρομο Down", en: "World Down Syndrome Day" } },
  { date: "03-22", name: { el: "Παγκόσμια Ημέρα Νερού", en: "World Water Day" } },
  { date: "03-25", name: { el: "Εθνική Επέτειος της Επανάστασης του 1821", en: "Greek Independence Day — anniversary of the 1821 Revolution" } },
  { date: "03-27", name: { el: "Παγκόσμια Ημέρα Θεάτρου", en: "World Theatre Day" } },
  { date: "04-02", name: { el: "Παγκόσμια Ημέρα Παιδικού Βιβλίου", en: "International Children's Book Day" } },
  { date: "04-02", name: { el: "Παγκόσμια Ημέρα Ευαισθητοποίησης για τον Αυτισμό", en: "World Autism Awareness Day" } },
  { date: "04-07", name: { el: "Παγκόσμια Ημέρα Υγείας", en: "World Health Day" } },
  { date: "04-15", name: { el: "Παγκόσμια Ημέρα Τέχνης", en: "World Art Day" } },
  { date: "04-22", name: { el: "Ημέρα της Γης", en: "Earth Day" } },
  { date: "04-23", name: { el: "Παγκόσμια Ημέρα Βιβλίου", en: "World Book Day" } },
  { date: "04-29", name: { el: "Παγκόσμια Ημέρα Χορού", en: "International Dance Day" } },
  { date: "04-30", name: { el: "Διεθνής Ημέρα Τζαζ", en: "International Jazz Day" }, music: true },
  { date: "05-09", name: { el: "Ημέρα της Ευρώπης", en: "Europe Day" } },
  { date: "05-15", name: { el: "Διεθνής Ημέρα της Οικογένειας", en: "International Day of Families" } },
  { date: "05-18", name: { el: "Διεθνής Ημέρα Μουσείων", en: "International Museum Day" } },
  { date: "06-05", name: { el: "Παγκόσμια Ημέρα Περιβάλλοντος", en: "World Environment Day" } },
  { date: "06-08", name: { el: "Παγκόσμια Ημέρα Ωκεανών", en: "World Oceans Day" } },
  { date: "06-20", name: { el: "Παγκόσμια Ημέρα Προσφύγων", en: "World Refugee Day" } },
  { date: "06-21", name: { el: "Ευρωπαϊκή Γιορτή της Μουσικής", en: "Fête de la Musique — European Music Day" }, music: true },
  { date: "07-30", name: { el: "Διεθνής Ημέρα Φιλίας", en: "International Day of Friendship" } },
  { date: "08-12", name: { el: "Διεθνής Ημέρα Νεολαίας", en: "International Youth Day" } },
  { date: "09-08", name: { el: "Διεθνής Ημέρα Αλφαβητισμού", en: "International Literacy Day" } },
  { date: "09-21", name: { el: "Διεθνής Ημέρα Ειρήνης", en: "International Day of Peace" } },
  { date: "09-26", name: { el: "Ευρωπαϊκή Ημέρα Γλωσσών", en: "European Day of Languages" } },
  { date: "09-27", name: { el: "Παγκόσμια Ημέρα Τουρισμού", en: "World Tourism Day" } },
  { date: "09-29", name: { el: "Παγκόσμια Ημέρα Καρδιάς", en: "World Heart Day" } },
  { date: "09-30", name: { el: "Διεθνής Ημέρα Μετάφρασης", en: "International Translation Day" } },
  { date: "10-01", name: { el: "Παγκόσμια Ημέρα Μουσικής", en: "International Music Day" }, music: true },
  { date: "10-04", name: { el: "Παγκόσμια Ημέρα των Ζώων", en: "World Animal Day" } },
  { date: "10-05", name: { el: "Παγκόσμια Ημέρα Εκπαιδευτικών", en: "World Teachers' Day" } },
  { date: "10-10", name: { el: "Παγκόσμια Ημέρα Ψυχικής Υγείας", en: "World Mental Health Day" } },
  { date: "10-11", name: { el: "Διεθνής Ημέρα του Κοριτσιού", en: "International Day of the Girl Child" } },
  { date: "10-16", name: { el: "Παγκόσμια Ημέρα Διατροφής", en: "World Food Day" } },
  { date: "10-24", name: { el: "Ημέρα των Ηνωμένων Εθνών", en: "United Nations Day" } },
  { date: "10-27", name: { el: "Παγκόσμια Ημέρα Οπτικοακουστικής Κληρονομιάς", en: "World Day for Audiovisual Heritage" } },
  { date: "10-28", name: { el: "Εθνική Επέτειος του «Όχι»", en: "Ohi Day — Greek national anniversary of 28 October 1940" } },
  { date: "11-13", name: { el: "Παγκόσμια Ημέρα Καλοσύνης", en: "World Kindness Day" } },
  { date: "11-16", name: { el: "Διεθνής Ημέρα Ανεκτικότητας", en: "International Day for Tolerance" } },
  { date: "11-17", name: { el: "Επέτειος της Εξέγερσης του Πολυτεχνείου", en: "Anniversary of the 1973 Athens Polytechnic Uprising" } },
  { date: "11-20", name: { el: "Παγκόσμια Ημέρα για τα Δικαιώματα του Παιδιού", en: "World Children's Day" } },
  { date: "12-01", name: { el: "Παγκόσμια Ημέρα κατά του AIDS", en: "World AIDS Day" } },
  { date: "12-03", name: { el: "Διεθνής Ημέρα Ατόμων με Αναπηρία", en: "International Day of Persons with Disabilities" } },
  { date: "12-10", name: { el: "Ημέρα των Ανθρωπίνων Δικαιωμάτων", en: "Human Rights Day" } },
];

export const ON_THIS_DAY: HistoryEvent[] = [
  { date: "01-09", year: 1926, text: { el: "Γεννιέται στην Ηλιούπολη της Αιγύπτου ο συνθέτης Γιάννης Χρήστου.", en: "Composer Jani Christou is born in Heliopolis, Egypt." }, music: true },
  { date: "01-18", year: 1984, text: { el: "Πεθαίνει στο Λονδίνο ο Βασίλης Τσιτσάνης.", en: "Vassilis Tsitsanis dies in London." }, music: true },
  { date: "01-27", year: 1756, text: { el: "Γεννιέται στο Σάλτσμπουργκ ο Βόλφγκανγκ Αμαντέους Μότσαρτ.", en: "Wolfgang Amadeus Mozart is born in Salzburg." }, music: true },
  { date: "01-31", year: 1797, text: { el: "Γεννιέται στη Βιέννη ο Φραντς Σούμπερτ.", en: "Franz Schubert is born in Vienna." }, music: true },
  { date: "02-08", year: 1972, text: { el: "Πεθαίνει ο Μάρκος Βαμβακάρης, ο «πατριάρχης» του ρεμπέτικου.", en: "Markos Vamvakaris, the “patriarch” of rebetiko, dies." }, music: true },
  { date: "02-09", year: 1857, text: { el: "Πεθαίνει στην Κέρκυρα ο Διονύσιος Σολωμός, ο ποιητής του «Ύμνου εις την Ελευθερίαν».", en: "Dionysios Solomos, the poet of the “Hymn to Liberty”, dies in Corfu." } },
  { date: "02-23", year: 1685, text: { el: "Γεννιέται στο Χάλε ο Γκέοργκ Φρίντριχ Χέντελ.", en: "George Frideric Handel is born in Halle." }, music: true },
  { date: "03-01", year: 1896, text: { el: "Γεννιέται στην Αθήνα ο μαέστρος Δημήτρης Μητρόπουλος.", en: "Conductor Dimitri Mitropoulos is born in Athens." }, music: true },
  { date: "03-04", year: 1678, text: { el: "Γεννιέται στη Βενετία ο Αντόνιο Βιβάλντι.", en: "Antonio Vivaldi is born in Venice." }, music: true },
  { date: "03-26", year: 1827, text: { el: "Πεθαίνει στη Βιέννη ο Λούντβιχ βαν Μπετόβεν.", en: "Ludwig van Beethoven dies in Vienna." }, music: true },
  { date: "03-31", year: 1685, text: { el: "Γεννιέται στο Άιζεναχ ο Γιόχαν Σεμπάστιαν Μπαχ (21 Μαρτίου με το Ιουλιανό ημερολόγιο).", en: "Johann Sebastian Bach is born in Eisenach (21 March in the Julian calendar)." }, music: true },
  { date: "03-31", year: 1732, text: { el: "Γεννιέται ο Γιόζεφ Χάυντν.", en: "Joseph Haydn is born." }, music: true },
  {
    date: "04-06",
    year: 1896,
    text: { el: "Στην έναρξη των πρώτων σύγχρονων Ολυμπιακών Αγώνων, στην Αθήνα, ακούγεται για πρώτη φορά ο Ολυμπιακός Ύμνος του Σπύρου Σαμάρα σε στίχους Κωστή Παλαμά.", en: "At the opening of the first modern Olympic Games in Athens, the Olympic Hymn by Spyridon Samaras, with lyrics by Kostis Palamas, is performed for the first time." },
    music: true,
  },
  { date: "04-14", year: 1759, text: { el: "Πεθαίνει στο Λονδίνο ο Γκέοργκ Φρίντριχ Χέντελ.", en: "George Frideric Handel dies in London." }, music: true },
  { date: "04-17", year: 1961, text: { el: "Ο Μάνος Χατζιδάκις κερδίζει το Όσκαρ για το τραγούδι «Τα παιδιά του Πειραιά».", en: "Manos Hadjidakis wins the Oscar for the song “Never on Sunday” (“The Children of Piraeus”)." }, music: true },
  { date: "05-07", year: 1824, text: { el: "Πρώτη εκτέλεση της 9ης Συμφωνίας του Μπετόβεν, στη Βιέννη.", en: "Premiere of Beethoven's Ninth Symphony in Vienna." }, music: true },
  { date: "05-07", year: 1833, text: { el: "Γεννιέται στο Αμβούργο ο Γιοχάνες Μπραμς.", en: "Johannes Brahms is born in Hamburg." }, music: true },
  { date: "05-07", year: 1840, text: { el: "Γεννιέται ο Πιοτρ Ίλιτς Τσαϊκόφσκι.", en: "Pyotr Ilyich Tchaikovsky is born." }, music: true },
  { date: "06-15", year: 1994, text: { el: "Πεθαίνει ο Μάνος Χατζιδάκις.", en: "Manos Hadjidakis dies." }, music: true },
  { date: "07-28", year: 1750, text: { el: "Πεθαίνει στη Λειψία ο Γιόχαν Σεμπάστιαν Μπαχ.", en: "Johann Sebastian Bach dies in Leipzig." }, music: true },
  { date: "07-29", year: 1925, text: { el: "Γεννιέται στη Χίο ο Μίκης Θεοδωράκης.", en: "Mikis Theodorakis is born on Chios." }, music: true },
  { date: "09-02", year: 2021, text: { el: "Πεθαίνει ο Μίκης Θεοδωράκης.", en: "Mikis Theodorakis dies." }, music: true },
  { date: "09-08", year: 1841, text: { el: "Γεννιέται ο Άντονιν Ντβόρζακ.", en: "Antonín Dvořák is born." }, music: true },
  { date: "09-16", year: 1977, text: { el: "Πεθαίνει στο Παρίσι η Μαρία Κάλλας.", en: "Maria Callas dies in Paris." }, music: true },
  { date: "09-19", year: 1949, text: { el: "Πεθαίνει στην Αθήνα ο συνθέτης Νίκος Σκαλκώτας.", en: "Composer Nikos Skalkottas dies in Athens." }, music: true },
  { date: "09-25", year: 1906, text: { el: "Γεννιέται ο Ντμίτρι Σοστακόβιτς.", en: "Dmitri Shostakovich is born." }, music: true },
  { date: "10-17", year: 1849, text: { el: "Πεθαίνει στο Παρίσι ο Φρεντερίκ Σοπέν.", en: "Frédéric Chopin dies in Paris." }, music: true },
  { date: "10-22", year: 1811, text: { el: "Γεννιέται ο Φραντς Λιστ.", en: "Franz Liszt is born." }, music: true },
  { date: "10-23", year: 1925, text: { el: "Γεννιέται στην Ξάνθη ο Μάνος Χατζιδάκις.", en: "Manos Hadjidakis is born in Xanthi." }, music: true },
  { date: "10-25", year: 1825, text: { el: "Γεννιέται στη Βιέννη ο Γιόχαν Στράους ο νεότερος.", en: "Johann Strauss II is born in Vienna." }, music: true },
  { date: "10-25", year: 1838, text: { el: "Γεννιέται στο Παρίσι ο Ζορζ Μπιζέ.", en: "Georges Bizet is born in Paris." }, music: true },
  { date: "11-02", year: 1960, text: { el: "Πεθαίνει στο Μιλάνο ο Δημήτρης Μητρόπουλος, κατά τη διάρκεια πρόβας στη Σκάλα.", en: "Dimitri Mitropoulos dies in Milan during a rehearsal at La Scala." }, music: true },
  { date: "11-19", year: 1828, text: { el: "Πεθαίνει στη Βιέννη ο Φραντς Σούμπερτ.", en: "Franz Schubert dies in Vienna." }, music: true },
  { date: "12-02", year: 1923, text: { el: "Γεννιέται στη Νέα Υόρκη η Μαρία Κάλλας.", en: "Maria Callas is born in New York." }, music: true },
  { date: "12-05", year: 1791, text: { el: "Πεθαίνει στη Βιέννη ο Βόλφγκανγκ Αμαντέους Μότσαρτ.", en: "Wolfgang Amadeus Mozart dies in Vienna." }, music: true },
  { date: "12-17", year: 1770, text: { el: "Βαφτίζεται στη Βόννη ο Λούντβιχ βαν Μπετόβεν.", en: "Ludwig van Beethoven is baptised in Bonn." }, music: true },
];

/* ---------------------------------------------------------------- βοηθητικά */

const pad = (n: number) => String(n).padStart(2, "0");

/** «ΜΜ-ΗΗ» μιας ημερομηνίας, στην τοπική ώρα του επισκέπτη. */
export const monthDay = (d: Date) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const observancesOn = (d: Date) => WORLD_DAYS.filter((x) => x.date === monthDay(d));

export const eventsOn = (d: Date) =>
  ON_THIS_DAY.filter((x) => x.date === monthDay(d)).sort((a, b) => a.year - b.year);

/** Η επόμενη ημέρα (μετά από σήμερα) που έχει παγκόσμια/εθνική ημέρα. */
export function nextObservance(d: Date): { date: Date; days: Observance[] } | null {
  for (let i = 1; i <= 366; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const days = observancesOn(day);
    if (days.length) return { date: day, days };
  }
  return null;
}
