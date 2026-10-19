/**
 * ΛΕΞΙΚΟ INTERFACE — ελληνικό κείμενο → αγγλικό.
 *
 * Εδώ μπαίνουν τα κείμενα της «εφαρμογής»: κουμπιά, ετικέτες, μηνύματα,
 * τίτλοι σελίδων. Το ΠΕΡΙΕΧΟΜΕΝΟ (Σχολείο μας, Δράσεις, Erasmus, «Σαν
 * σήμερα») έχει τα αγγλικά του δίπλα στα ελληνικά, στο src/content/.
 *
 * Το κλειδί πρέπει να είναι ΑΚΡΙΒΩΣ το ελληνικό κείμενο του κώδικα.
 * Τα {όνομα} είναι θέσεις για τιμές (π.χ. ώρα) — κρατήστε τα ίδια.
 * Ό,τι λείπει από εδώ εμφανίζεται απλώς στα ελληνικά.
 */
export const DICTIONARY: Record<string, string> = {
  /* ------------------------------------------------------ γενικά & σχολείο */
  "Μουσικό Σχολείο Πειραιά": "Music School of Piraeus",
  "Μουσικό Σχολείο Πειραιά — Αρχική": "Music School of Piraeus — Home",
  "Μουσικό Σχολείο": "Music School",
  "Πειραιά": "Piraeus",
  "Παιδεία, τέχνη και ήχος από το 1988": "Education, art and sound since 1988",
  "Πειραιάς, Αττική": "Piraeus, Attica",
  "Το Μουσικό Σχολείο Πειραιά συνδυάζει την πλήρη γενική παιδεία με ολοκληρωμένη μουσική εκπαίδευση, ευρωπαϊκή και παραδοσιακή.":
    "The Music School of Piraeus combines a complete general education with comprehensive European and traditional music training.",
  "Γυμνάσιο & Λύκειο · Δημόσια μουσική εκπαίδευση": "Secondary school · Public music education",
  "Εγγραφές": "Admissions",
  "Εκδηλώσεις": "Events",
  "Τμήματα": "Departments",
  "Το σχολείο": "The school",
  "Σχολείο": "School",
  "Γραμματεία": "School office",
  "Μουσική εκπαίδευση": "Music education",

  /* ----------------------------------------------------- μενού & πλοήγηση */
  "Πλοήγηση": "Navigation",
  "Κύρια πλοήγηση": "Main navigation",
  "Κύρια πλοήγηση κινητού": "Mobile navigation",
  "Επιλογή γλώσσας": "Language",
  "Μενού": "Menu",
  "Άνοιγμα μενού": "Open menu",
  "Κλείσιμο μενού": "Close menu",
  "Άνοιγμα {label}": "Open {label}",
  "Επικοινωνία": "Contact",
  "Με μουσική και προσοχή στη λεπτομέρεια": "With music and attention to detail",
  "Η ενότητα ετοιμάζεται": "This section is coming soon",
  "← Επιστροφή στην αρχική": "← Back to home",
  "Επιστροφή στην αρχική": "Back to home",

  /* ------------------------------------------------------------- αρχική */
  "Γνωρίστε το σχολείο": "Discover the school",
  "Δείτε το βίντεο": "Watch the video",
  "μαθητές & μαθήτριες": "students",
  "μουσικά σύνολα": "music ensembles",
  "χρόνια λειτουργίας": "years of excellence",
  "Κύλιση": "Scroll",
  "Το περιεχόμενο ανανεώνεται από το WordPress κάθε {n} λεπτά": "Content is refreshed from WordPress every {n} minutes",
  "Βίντεο παρουσίασης": "Presentation video",
  "Μια μέρα στο Μουσικό Σχολείο Πειραιά": "A day at the Music School of Piraeus",
  "Ορχήστρα, χορωδία, παραδοσιακά σύνολα και καθημερινή δημιουργία.":
    "Orchestra, choir, traditional ensembles and everyday creativity.",
  "Φιλμ": "Film",
  "Αναπαραγωγή: {title}": "Play: {title}",

  /* ------------------------------------------------------------- widgets */
  "Ώρα σχολείου": "School hours",
  "Ανοιχτά τώρα": "Open now",
  "Εκτός ωραρίου": "Outside school hours",
  "Δευτέρα – Παρασκευή": "Monday – Friday",
  "Ημερολόγιο": "Calendar",
  "Προηγούμενος μήνας": "Previous month",
  "Επόμενος μήνας": "Next month",
  "Προσεχώς": "Coming up",
  "Δεν υπάρχουν προγραμματισμένες εκδηλώσεις.": "No events are currently scheduled.",
  "Σαν σήμερα": "On this day",
  "Σήμερα είναι": "Today is",
  "πριν από {n} χρόνια": "{n} years ago",
  "Για σήμερα δεν υπάρχει καταχωρισμένο γεγονός.": "Nothing is recorded for today.",
  "μουσικό γεγονός": "music event",
  "Τραγούδι της ημέρας": "Song of the day",
  "Αφιέρωμα της ημέρας": "Today's special",
  "Ακρόαση": "Listen",
  "Άνοιγμα στο YouTube": "Open on YouTube",
  "Άνοιγμα στο Spotify": "Open on Spotify",

  /* ------------------------------------------------ σύνολα & μαθήματα */
  "Μουσικά σύνολα": "Music ensembles",
  "Συμφωνική Ορχήστρα": "Symphony Orchestra",
  "Χορωδία": "Choir",
  "Παραδοσιακό Σύνολο": "Traditional Ensemble",
  "Μπάντα Πνευστών": "Wind Band",
  "Σύνολο Τζαζ": "Jazz Ensemble",
  "Έγχορδα": "Strings",
  "Πνευστά": "Winds",
  "Κρουστά": "Percussion",
  "Πιάνο": "Piano",
  "Βιολί": "Violin",
  "Κιθάρα": "Guitar",
  "Βυζαντινή Μουσική": "Byzantine Music",
  "Παραδοσιακά Όργανα": "Traditional Instruments",
  "Αρμονία": "Harmony",
  "Τζαζ": "Jazz",
  "Εγγραφές & πληροφορίες": "Admissions & information",
  "Η γραμματεία δέχεται ερωτήματα για εισαγωγικές εξετάσεις, μεταγραφές και μουσικά όργανα.":
    "The office answers questions about entrance exams, transfers and musical instruments.",
  "Φόρμα επικοινωνίας →": "Contact form →",

  /* ---------------------------------------------------------- νέα & άρθρα */
  "Νέα & ανακοινώσεις": "News & announcements",
  "Νέα & Ανακοινώσεις": "News & Announcements",
  "Ενημέρωση": "Updates",
  "Ό,τι συμβαίνει στο σχολείο: συναυλίες, διακρίσεις, προγράμματα και ανακοινώσεις της διεύθυνσης.":
    "Everything happening at the school: concerts, awards, programmes and announcements.",
  "Τελευταία από το σχολείο": "Latest from the school",
  "Όλα τα νέα": "All news",
  "← Όλα τα νέα": "← All news",
  "Διαβάστε περισσότερα": "Read more",
  "Διαβάστε επίσης": "More news",
  "ανάγνωση": "reading",
  "Αναζήτηση": "Search",
  "Αναζήτηση ανακοινώσεων": "Search announcements",
  "Ταξινόμηση": "Sort",
  "Νεότερα πρώτα": "Newest first",
  "Παλαιότερα πρώτα": "Oldest first",
  "Κατηγορία": "Category",
  "Κατηγορίες": "Categories",
  "Όλα": "All",
  "Όλες": "All",
  "ανακοινώσεις": "announcements",
  "Καθαρισμός φίλτρων": "Clear filters",
  "Δεν βρέθηκαν ανακοινώσεις με αυτά τα κριτήρια.": "No announcements match these criteria.",
  "Δεν υπάρχουν ακόμη δημοσιεύσεις σε αυτή την κατηγορία.": "There are no posts in this category yet.",
  "Σελιδοποίηση": "Pagination",
  "Αναρτήσεις": "Posts",
  "Δεν υπάρχουν ακόμη αναρτήσεις σε αυτή την ενότητα.": "There are no posts in this section yet.",
  "Προβάλλεται δείγμα περιεχομένου. Συνδέστε το WordPress ορίζοντας": "Sample content is shown. Connect WordPress by setting",
  "στο": "in",
  "— τα άρθρα θα έρθουν αυτόματα.": "and articles will appear automatically.",
  // Κατηγορίες άρθρων (όπως είναι γραμμένες στο WordPress).
  "Ανακοινώσεις": "Announcements",
  "Εξετάσεις": "Exams",
  "Συναυλίες": "Concerts",
  "Βίντεο": "Videos",

  /* ------------------------------------------------------ σελίδες ενοτήτων */
  "Ενδεικτικό περιεχόμενο — υπό συμπλήρωση": "Sample content — being completed",
  "Από το site του σχολείου": "From the school's website",
  "ενημέρωση": "updated",
  "Το κείμενο αυτής της σελίδας είναι διαθέσιμο μόνο στα ελληνικά.": "The text of this page is available in Greek only.",
  "Δείτε περισσότερα": "See more",
  "Επόμενη →": "Next →",
  "← Προηγούμενη": "← Previous",
  "Περιήγηση ενότητας": "Section navigation",
  "Σελίδες: {section}": "Pages: {section}",
  "Άνοιγμα": "Open",
  "Σύντομα": "Coming soon",
  "Σπουδές": "Studies",
  "Τμήματα & Σύνολα": "Departments & Ensembles",
  "Ατομικά όργανα, θεωρητικά μαθήματα, ορχήστρα, χορωδία και παραδοσιακά σύνολα.":
    "Individual instruments, music theory, orchestra, choir and traditional ensembles.",
  "Παύση": "Rest",
  "Η σελίδα που ζητήσατε δεν βρέθηκε — ίσως μετακινήθηκε ή άλλαξε διεύθυνση.":
    "The page you asked for was not found — it may have moved or changed address.",

  /* ------------------------------------------------------------ επικοινωνία */
  "Η γραμματεία απαντά σε ερωτήματα για εγγραφές, εισαγωγικές εξετάσεις, μεταγραφές και μουσικά όργανα. Τηλεφωνήστε, γράψτε μας ή περάστε από το σχολείο.":
    "The school office answers questions about admissions, entrance exams, transfers and musical instruments. Call us, write to us or drop by the school.",
  "Στοιχεία επικοινωνίας": "Contact details",
  "Άνοιγμα στους Χάρτες Google": "Open in Google Maps",
  "Τηλέφωνο": "Phone",
  "Ταχυδρομείο": "Postal address",
  "Πώς θα έρθετε": "Getting here",
  "Φόρμα επικοινωνίας": "Contact form",
  "Στον χάρτη": "On the map",
  "Οδηγίες πλοήγησης": "Get directions",
  "Ωράριο γραμματείας": "Office hours",
  "Έλεγχος ώρας": "Checking the time",
  "Ανοιχτά τώρα, έως τις {time}": "Open now, until {time}",
  "Κλειστά τώρα": "Closed now",
  "Κλειστά τώρα, ανοίγει {when}": "Closed now, opens {when}",
  "σήμερα στις {time}": "today at {time}",
  "αύριο στις {time}": "tomorrow at {time}",
  "{day} στις {time}": "{day} at {time}",
  "Κλειστά": "Closed",

  /* ---------------------------------------------------- φόρμα επικοινωνίας */
  "Στείλτε μας μήνυμα": "Send us a message",
  "Τα πεδία με αστερίσκο είναι υποχρεωτικά.": "Fields marked with an asterisk are required.",
  "Ονοματεπώνυμο *": "Full name *",
  "Θέμα *": "Subject *",
  "Μήνυμα *": "Message *",
  "Προαιρετικό": "Optional",
  "Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για την απάντηση σε αυτό το μήνυμα. *":
    "I agree that my details will be used solely to reply to this message. *",
  "Αποστολή": "Sending",
  "Αποστολή μηνύματος": "Send message",
  "Απαντάμε συνήθως σε δύο εργάσιμες ημέρες.": "We usually reply within two working days.",
  "Το μήνυμα στάλθηκε": "Message sent",
  "Η γραμματεία απαντά συνήθως μέσα σε δύο εργάσιμες ημέρες. Θα λάβετε απάντηση στο {email}.":
    "The school office usually replies within two working days. You will receive a reply at {email}.",
  "Στείλτε κι άλλο μήνυμα": "Send another message",
  // Θέματα (η τιμή που φτάνει στη γραμματεία μένει στα ελληνικά).
  "Εγγραφές & εισαγωγικές εξετάσεις": "Admissions & entrance exams",
  "Μουσικά σύνολα & όργανα": "Music ensembles & instruments",
  "Εκδηλώσεις & συνεργασίες": "Events & partnerships",
  "Άλλο": "Other",
  // Έλεγχοι πεδίων (src/lib/contact.ts) και απαντήσεις του server.
  "Συμπληρώστε το ονοματεπώνυμό σας.": "Please enter your full name.",
  "Το όνομα είναι πολύ μεγάλο.": "The name is too long.",
  "Χρειαζόμαστε ένα email για να απαντήσουμε.": "We need an email address to reply.",
  "Ελέγξτε τη διεύθυνση email.": "Please check the email address.",
  "Ελέγξτε τον αριθμό τηλεφώνου.": "Please check the phone number.",
  "Επιλέξτε θέμα.": "Please choose a subject.",
  "Γράψτε λίγο περισσότερα, τουλάχιστον 10 χαρακτήρες.": "Please write a little more — at least 10 characters.",
  "Το μήνυμα ξεπερνά τους 4.000 χαρακτήρες.": "The message exceeds 4,000 characters.",
  "Χρειαζόμαστε τη συγκατάθεσή σας για να απαντήσουμε.": "We need your consent in order to reply.",
  "Στάλθηκαν πολλά μηνύματα από αυτή τη σύνδεση. Δοκιμάστε ξανά σε λίγα λεπτά.":
    "Too many messages were sent from this connection. Please try again in a few minutes.",
  "Το μήνυμα δεν στάλθηκε. Δοκιμάστε ξανά ή τηλεφωνήστε στη γραμματεία.":
    "Your message was not sent. Please try again or call the school office.",
  "Δεν υπάρχει σύνδεση με τον διακομιστή. Ελέγξτε το δίκτυο και δοκιμάστε ξανά.":
    "Could not reach the server. Check your connection and try again.",
  "Μη έγκυρο αίτημα.": "Invalid request.",
  "Η αποστολή δεν είναι διαθέσιμη αυτή τη στιγμή.": "Sending is not available at the moment.",
};
