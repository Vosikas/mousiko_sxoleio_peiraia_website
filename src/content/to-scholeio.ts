import type { Section } from "./types";

/**
 * «ΤΟ ΣΧΟΛΕΙΟ ΜΑΣ» — το περιεχόμενο της ενότητας.
 *
 * Τα κείμενα είναι ΕΝΔΕΙΚΤΙΚΑ (draft: true) και δείχνουν τι μπαίνει πού.
 * Αντικατάστησέ τα με το τελικό κείμενο του σχολείου και σβήσε το
 * `draft: true` — το σήμα «Ενδεικτικό περιεχόμενο» θα φύγει μόνο του.
 * Τύποι τουβλακιών και οδηγίες: src/content/types.ts
 */
export const TO_SCHOLEIO: Section = {
  slug: "to-scholeio",
  title: { el: "Το Σχολείο μας", en: "Our School" },
  eyebrow: { el: "Ταυτότητα", en: "About us" },
  intro:
    { el: "Η ιστορία, οι άνθρωποι και η λειτουργία του Μουσικού Σχολείου Πειραιά — όσα χρειάζεται να γνωρίζουν μαθητές, γονείς και επισκέπτες.", en: "The history, the people and the day-to-day life of the Music School of Piraeus — everything students, parents and visitors need to know." },
  subpages: [
    {
      slug: "istoria",
      title: { el: "Ιστορία του Σχολείου – Κτιριακή Υποδομή", en: "School History – Buildings & Facilities" },
      shortTitle: { el: "Ιστορία & Υποδομή", en: "History & Facilities" },
      summary:
        { el: "Πώς ξεκίνησε το σχολείο, πώς εξελίχθηκε μέσα στα χρόνια και οι χώροι όπου σήμερα διδάσκεται η μουσική.", en: "How the school began, how it has grown over the years, and the spaces where music is taught today." },
      draft: true,
      blocks: [
        {
          type: "text",
          title: { el: "Η ιστορία μας", en: "Our history" },
          paragraphs: [
            { el: "Εδώ παρουσιάζεται η ίδρυση του σχολείου και η πορεία του μέχρι σήμερα: οι πρώτες τάξεις, τα σημαντικά ορόσημα και οι άνθρωποι που διαμόρφωσαν τον χαρακτήρα του.", en: "This section presents the founding of the school and its journey to the present day: the first classes, the key milestones and the people who shaped its character." },
            { el: "Μια δεύτερη παράγραφος μπορεί να περιγράψει τη θέση του σχολείου στη μουσική ζωή του Πειραιά και τη σχέση του με την τοπική κοινωνία.", en: "A second paragraph can describe the school's place in the musical life of Piraeus and its relationship with the local community." },
          ],
        },
        {
          type: "list",
          title: { el: "Κτιριακή υποδομή", en: "Buildings & facilities" },
          intro: { el: "Οι χώροι του σχολείου και η χρήση τους:", en: "The school's spaces and how they are used:" },
          items: [
            { el: "Αίθουσες διδασκαλίας γενικής παιδείας", en: "General education classrooms" },
            { el: "Αίθουσες ατομικής διδασκαλίας οργάνων", en: "Rooms for individual instrument lessons" },
            { el: "Αίθουσα συνόλων και προβών", en: "Ensemble and rehearsal room" },
            { el: "Αίθουσα εκδηλώσεων", en: "Events hall" },
            { el: "Εργαστήρια και βιβλιοθήκη", en: "Labs and library" },
            { el: "Αύλειος χώρος", en: "Schoolyard" },
          ],
        },
      ],
    },
    {
      // Γενικές πληροφορίες των τμημάτων και οι μαθητικές κοινότητες.
      slug: "mathites",
      title: { el: "Μαθητές", en: "Students" },
      summary:
        { el: "Γενικές πληροφορίες για τα τμήματα του σχολείου και τις μαθητικές κοινότητες.", en: "General information about the school's classes and student communities." },
      draft: true,
      blocks: [
        {
          type: "facts",
          items: [
            { value: "2", label: { el: "βαθμίδες: Γυμνάσιο & Λύκειο", en: "levels: lower & upper secondary" } },
            { value: "6", label: { el: "τάξεις φοίτησης", en: "school years" } },
          ],
        },
        {
          type: "text",
          title: { el: "Τα τμήματα", en: "Classes" },
          paragraphs: [
            { el: "Εδώ μπαίνουν οι γενικές πληροφορίες για τα τμήματα: πόσα τμήματα έχει κάθε τάξη, πώς οργανώνονται και πώς χωρίζονται στα μαθήματα μουσικής κατεύθυνσης.", en: "General information about the classes goes here: how many classes each year has, how they are organised and how they are grouped for the music subjects." },
          ],
        },
        {
          type: "text",
          title: { el: "Μαθητικές κοινότητες", en: "Student communities" },
          paragraphs: [
            { el: "Η ενότητα για τις μαθητικές κοινότητες: πώς εκλέγονται τα μαθητικά συμβούλια, ποιος είναι ο ρόλος τους και πώς συμμετέχουν στη ζωή του σχολείου.", en: "The section on student communities: how student councils are elected, what their role is and how they take part in school life." },
          ],
        },
      ],
    },
    {
      // Οι εξετάσεις και οι λοιπές πληροφορίες φοίτησης. (Κρατάει το παλιό URL.)
      slug: "foitisi",
      title: { el: "Φοίτηση", en: "Studies & Attendance" },
      summary:
        { el: "Οι εξετάσεις του σχολείου και όλες οι πληροφορίες που αφορούν τη φοίτηση.", en: "The school's exams and all the information about studying and attendance." },
      draft: true,
      blocks: [
        {
          type: "text",
          title: { el: "Η φοίτηση", en: "Studying at the school" },
          paragraphs: [
            { el: "Οι μαθητές και οι μαθήτριες παρακολουθούν το πλήρες πρόγραμμα γενικής παιδείας μαζί με τα μαθήματα μουσικής κατεύθυνσης. Εδώ περιγράφεται πώς συνδυάζονται τα δύο μέσα στην εβδομάδα.", en: "Students follow the full general education curriculum alongside the music subjects. This section describes how the two are combined during the week." },
          ],
        },
        {
          type: "list",
          title: { el: "Εξετάσεις", en: "Exams" },
          items: [
            { el: "Εισαγωγικές εξετάσεις στην Α΄ Γυμνασίου", en: "Entrance exams for the first year of lower secondary" },
            { el: "Κατατακτήριες εξετάσεις", en: "Placement exams" },
            { el: "Ενδοσχολικές εξετάσεις", en: "In-school exams" },
            { el: "Πανελλαδικές εξετάσεις", en: "Panhellenic national exams" },
          ],
        },
        {
          type: "list",
          title: { el: "Μαθήματα μουσικής παιδείας", en: "Music subjects" },
          items: [
            { el: "Ατομικό όργανο", en: "Individual instrument" },
            { el: "Θεωρία και αρμονία", en: "Theory and harmony" },
            { el: "Ιστορία της μουσικής", en: "History of music" },
            { el: "Ευρωπαϊκή και παραδοσιακή μουσική", en: "European and traditional music" },
            { el: "Μουσικά σύνολα", en: "Music ensembles" },
            { el: "Χορωδία", en: "Choir" },
          ],
        },
        {
          type: "list",
          title: { el: "Άλλες πληροφορίες φοίτησης", en: "Other attendance information" },
          items: [{ el: "Απουσίες και δικαιολόγησή τους", en: "Absences and how to justify them" }, { el: "Μετεγγραφές", en: "Transfers" }, { el: "Βεβαιώσεις φοίτησης", en: "Certificates of attendance" }],
        },
      ],
    },
    {
      slug: "ekpaideftikoi",
      title: { el: "Εκπαιδευτικοί", en: "Teachers" },
      summary:
        { el: "Ο Σύλλογος Διδασκόντων: οι καθηγητές και οι καθηγήτριες γενικής και μουσικής παιδείας του σχολείου.", en: "The teaching staff: the school's general education and music teachers." },
      draft: true,
      blocks: [
        {
          type: "text",
          title: { el: "Ο Σύλλογος Διδασκόντων", en: "The teaching staff" },
          paragraphs: [
            { el: "Μια σύντομη παρουσίαση του εκπαιδευτικού προσωπικού και της φιλοσοφίας διδασκαλίας του σχολείου.", en: "A short introduction to the teaching staff and the school's approach to teaching." },
          ],
        },
        {
          type: "list",
          title: { el: "Ειδικότητες", en: "Subjects" },
          items: [
            { el: "Φιλόλογοι", en: "Greek language, literature & history" },
            { el: "Μαθηματικοί", en: "Mathematics" },
            { el: "Φυσικοί επιστήμονες", en: "Sciences" },
            { el: "Ξένες γλώσσες", en: "Foreign languages" },
            { el: "Μουσικοί — θεωρητικά μαθήματα", en: "Musicians — theory subjects" },
            { el: "Μουσικοί — διδασκαλία οργάνων", en: "Musicians — instrument teaching" },
          ],
        },
      ],
    },
    {
      slug: "goneis",
      title: { el: "Σύλλογος Γονέων & Κηδεμόνων", en: "Parents' Association" },
      shortTitle: { el: "Σύλλογος Γονέων", en: "Parents' Association" },
      summary:
        { el: "Ο Σύλλογος Γονέων και Κηδεμόνων στηρίζει τη σχολική κοινότητα και συνεργάζεται με τη διεύθυνση του σχολείου.", en: "The Parents' Association supports the school community and works closely with the school's leadership." },
      draft: true,
      blocks: [
        {
          type: "text",
          title: { el: "Ο ρόλος του Συλλόγου", en: "The Association's role" },
          paragraphs: [
            { el: "Πώς λειτουργεί ο Σύλλογος, πώς μπορεί ένας γονέας να συμμετάσχει και με ποιους τρόπους στηρίζει τις δράσεις του σχολείου.", en: "How the Association works, how parents can get involved and the ways it supports school activities." },
          ],
        },
        {
          type: "contact",
          title: { el: "Επικοινωνία με τον Σύλλογο", en: "Contacting the Association" },
          items: [
            { label: "Email", value: { el: "Θα ανακοινωθεί", en: "To be announced" } },
            { label: { el: "Διοικητικό Συμβούλιο", en: "Board" }, value: { el: "Θα ανακοινωθεί", en: "To be announced" } },
          ],
        },
        {
          type: "documents",
          title: { el: "Έγγραφα", en: "Documents" },
          items: [{ title: { el: "Καταστατικό του Συλλόγου", en: "Association statutes" } }],
        },
      ],
    },
    {
      slug: "orologio",
      title: { el: "Ωρολόγιο Πρόγραμμα", en: "Timetable" },
      summary:
        { el: "Οι ώρες διδασκαλίας ανά τάξη για τα μαθήματα γενικής και μουσικής παιδείας.", en: "Weekly teaching hours per year for general education and music subjects." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Το ωρολόγιο πρόγραμμα κάθε τάξης, όπως ισχύει για το τρέχον σχολικό έτος. Μπορεί να δοθεί ως αρχείο για λήψη ή, αργότερα, ως πίνακας απευθείας στη σελίδα.", en: "The timetable for each year, as it applies to the current school year. It can be provided as a download or, later, as a table directly on the page." },
          ],
        },
        {
          type: "documents",
          title: { el: "Προγράμματα", en: "Timetables" },
          items: [
            { title: { el: "Ωρολόγιο πρόγραμμα Γυμνασίου", en: "Lower secondary timetable" } },
            { title: { el: "Ωρολόγιο πρόγραμμα Λυκείου", en: "Upper secondary timetable" } },
          ],
        },
      ],
    },
    {
      slug: "scholika-leoforeia",
      title: { el: "Σχολικά Λεωφορεία", en: "School Buses" },
      summary:
        { el: "Τα δρομολόγια των σχολικών λεωφορείων: στάσεις, ώρες και πληροφορίες για τη μεταφορά των μαθητών.", en: "School bus routes: stops, times and information about student transport." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Εδώ μπαίνουν οι πληροφορίες για τη μεταφορά των μαθητών: ποια δρομολόγια εξυπηρετούν το σχολείο, ποιοι μαθητές δικαιούνται μεταφορά και πώς γίνεται η δήλωση.", en: "Information about student transport goes here: which routes serve the school, which students are eligible and how to register." },
          ],
        },
        {
          type: "list",
          title: { el: "Περιλαμβάνει", en: "Includes" },
          items: [
            { el: "Δρομολόγια και στάσεις", en: "Routes and stops" },
            { el: "Ώρες παραλαβής και επιστροφής", en: "Pick-up and drop-off times" },
            { el: "Δικαιούχοι μεταφοράς", en: "Eligible students" },
            { el: "Αλλαγές λόγω απογευματινών προβών και εκδηλώσεων", en: "Changes for afternoon rehearsals and events" },
          ],
        },
        {
          type: "documents",
          title: { el: "Δρομολόγια", en: "Routes" },
          items: [{ title: { el: "Δρομολόγια σχολικών λεωφορείων", en: "School bus routes" } }],
        },
        {
          type: "contact",
          title: { el: "Επικοινωνία για τη μεταφορά", en: "Transport contact" },
          items: [{ label: { el: "Υπεύθυνος μεταφοράς", en: "Transport coordinator" }, value: { el: "Θα ανακοινωθεί", en: "To be announced" } }],
        },
      ],
    },
    {
      slug: "kanonismos",
      title: { el: "Κανονισμός Λειτουργίας", en: "School Rules" },
      summary:
        { el: "Οι κανόνες που διέπουν την καθημερινή ζωή του σχολείου — για μαθητές, γονείς και εκπαιδευτικούς.", en: "The rules that shape everyday school life — for students, parents and teachers." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Ο Κανονισμός Λειτουργίας περιγράφει τις υποχρεώσεις και τα δικαιώματα όλων των μελών της σχολικής κοινότητας. Εδώ μπαίνει μια σύντομη περίληψη· το πλήρες κείμενο δίνεται για λήψη.", en: "The School Rules set out the rights and responsibilities of everyone in the school community. A short summary goes here; the full text is available to download." },
          ],
        },
        {
          type: "list",
          title: { el: "Βασικά σημεία", en: "Key points" },
          items: [
            { el: "Ωράριο προσέλευσης και αποχώρησης", en: "Arrival and departure times" },
            { el: "Φοίτηση και απουσίες", en: "Attendance and absences" },
            { el: "Χρήση χώρων και μουσικών οργάνων", en: "Use of rooms and musical instruments" },
            { el: "Επικοινωνία σχολείου – οικογένειας", en: "School–family communication" },
          ],
        },
        {
          type: "documents",
          title: { el: "Έγγραφα", en: "Documents" },
          items: [{ title: { el: "Κανονισμός Λειτουργίας — πλήρες κείμενο", en: "School Rules — full text" } }],
        },
      ],
    },
    {
      slug: "aftoaxiologisi",
      title: { el: "Αυτοαξιολόγηση Σχολικής Μονάδας", en: "School Self-Evaluation" },
      shortTitle: { el: "Αυτοαξιολόγηση", en: "Self-Evaluation" },
      summary:
        { el: "Η συλλογική αποτίμηση του εκπαιδευτικού έργου και τα σχέδια δράσης για τη βελτίωσή του.", en: "The collective review of the school's educational work and the action plans for improving it." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Η αυτοαξιολόγηση είναι η διαδικασία με την οποία η σχολική κοινότητα αποτιμά το έργο της και θέτει στόχους βελτίωσης. Εδώ δημοσιεύονται οι σχετικές εκθέσεις και τα σχέδια δράσης.", en: "Self-evaluation is the process through which the school community reviews its work and sets goals for improvement. The related reports and action plans are published here." },
          ],
        },
        {
          type: "documents",
          title: { el: "Εκθέσεις και σχέδια δράσης", en: "Reports and action plans" },
          items: [{ title: { el: "Ετήσια έκθεση αυτοαξιολόγησης", en: "Annual self-evaluation report" } }, { title: { el: "Σχέδια δράσης", en: "Action plans" } }],
        },
      ],
    },
    {
      slug: "politiki-prostasias",
      title: { el: "Σχέδιο Πολιτικής Προστασίας – Μνημόνιο Ενεργειών", en: "Civil Protection Plan – Action Protocol" },
      shortTitle: { el: "Πολιτική Προστασία", en: "Civil Protection" },
      summary:
        { el: "Οι διαδικασίες ασφάλειας του σχολείου και τι κάνει ο καθένας σε περίπτωση έκτακτης ανάγκης.", en: "The school's safety procedures and what everyone does in an emergency." },
      draft: true,
      blocks: [
        {
          type: "text",
          paragraphs: [
            { el: "Το σχέδιο ορίζει πώς προστατεύονται μαθητές και προσωπικό σε περίπτωση έκτακτης ανάγκης και πώς ενημερώνονται οι οικογένειες.", en: "The plan sets out how students and staff are protected in an emergency and how families are kept informed." },
          ],
        },
        {
          type: "list",
          title: { el: "Περιλαμβάνει", en: "Includes" },
          items: [
            { el: "Σχέδιο διαφυγής και σημεία συγκέντρωσης", en: "Evacuation plan and assembly points" },
            { el: "Ρόλους και αρμοδιότητες", en: "Roles and responsibilities" },
            { el: "Ασκήσεις ετοιμότητας", en: "Emergency drills" },
            { el: "Επικοινωνία με τις οικογένειες", en: "Communication with families" },
          ],
        },
        {
          type: "documents",
          title: { el: "Έγγραφα", en: "Documents" },
          items: [{ title: { el: "Σχέδιο Πολιτικής Προστασίας", en: "Civil Protection Plan" } }, { title: { el: "Μνημόνιο Ενεργειών", en: "Action Protocol" } }],
        },
      ],
    },
  ],
};
