"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "GR" | "EN";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (greek: string) => string;
};

const translations: Record<string, string> = {
  "ΑΡΧΙΚΗ": "HOME",
  "ΤΟ ΣΧΟΛΕΙΟ": "THE SCHOOL",
  "ΤΜΗΜΑΤΑ": "DEPARTMENTS",
  "ΝΕΑ": "NEWS",
  "ΕΚΔΗΛΩΣΕΙΣ": "EVENTS",
  "ΕΠΙΚΟΙΝΩΝΙΑ": "CONTACT",
  "Εκδηλώσεις": "Events",
  "Τμήματα": "Departments",
  "Το σχολείο": "The school",
  "Εγγραφές": "Admissions",
  "Μουσικό Σχολείο Πειραιά": "Music School of Piraeus",
  "Μουσικό Σχολείο": "Music School",
  "Πειραιά": "Piraeus",
  "Παιδεία, τέχνη και ήχος από το 1988": "Education, art and sound since 1988",
  "Πειραιάς, Αττική": "Piraeus, Attica",
  "Το Μουσικό Σχολείο Πειραιά συνδυάζει την πλήρη γενική παιδεία με ολοκληρωμένη μουσική εκπαίδευση, ευρωπαϊκή και παραδοσιακή.": "The Music School of Piraeus combines a complete general education with comprehensive European and traditional music training.",
  "Γυμνάσιο & Λύκειο · Δημόσια μουσική εκπαίδευση": "Secondary school · Public music education",
  "Γνωρίστε το σχολείο": "Discover the school",
  "Δείτε το βίντεο": "Watch the video",
  "μαθητές & μαθήτριες": "students",
  "μουσικά σύνολα": "music ensembles",
  "χρόνια λειτουργίας": "years of excellence",
  "Κύλιση": "Scroll",
  "Όλα τα νέα": "All news",
  "Τελευταία από το σχολείο": "Latest from the school",
  "Νέα & ανακοινώσεις": "News & announcements",
  "Πλοήγηση": "Navigation",
  "Επικοινωνία": "Contact",
  "Με μουσική και προσοχή στη λεπτομέρεια": "With music and attention to detail",
  "Η ενότητα ετοιμάζεται": "This section is coming soon",
  "← Επιστροφή στην αρχική": "← Back to home",
  "Παράλειψη intro": "Skip intro",
  "Μια ορχήστρα ξεκινά": "An orchestra begins",
  "Τώρα παίζουν όλοι": "Now playing together",
  "Η σελίδα ετοιμάζεται": "Preparing the page",
  "Μουσική παιδεία · Πειραιάς": "Music education · Piraeus",
  "Ένα σύντομο μουσικό καλωσόρισμα από τις ομάδες του σχολείου.": "A short musical welcome from the school's ensembles.",
  "Η κάμερα κινείται μέσα σε μια μπάντα καθώς το σχολείο βρίσκει τον ρυθμό του.": "The camera moves through a band as the school finds its rhythm.",
  "Έγχορδα": "Strings",
  "Πνευστά": "Winds",
  "Κρουστά": "Percussion",
  "Πιάνο": "Piano",
  "χρώμα": "colour",
  "ανάσα": "breath",
  "ρυθμός": "rhythm",
  "αρμονία": "harmony",
  "Ώρα σχολείου": "School hours",
  "Ανοιχτά τώρα": "Open now",
  "Εκτός ωραρίου": "Outside school hours",
  "Ημερολόγιο": "Calendar",
  "Προσεχώς": "Coming up",
  "Δεν υπάρχουν προγραμματισμένες εκδηλώσεις.": "No events are currently scheduled.",
  "Διαβάστε περισσότερα": "Read more",
  "ανάγνωση": "reading",
  "Προβάλλεται δείγμα περιεχομένου. Συνδέστε το WordPress ορίζοντας": "Sample content is shown. Connect WordPress by setting",
  "στο": "in",
  "— τα άρθρα θα έρθουν αυτόματα.": "and articles will appear automatically.",
  "Συναυλίες, ρεσιτάλ, φεστιβάλ και ανοιχτές πρόβες για το κοινό του Πειραιά.": "Concerts, recitals, festivals and open rehearsals for the Piraeus community.",
  "Γραμματεία": "Secretariat",
  "Στοιχεία επικοινωνίας, ωράριο γραμματείας, χάρτης πρόσβασης και φόρμα επικοινωνίας.": "Contact details, office hours, directions and a contact form.",
  "Μουσική εκπαίδευση": "Music education",
  "Οργανωμένα μουσικά τμήματα, όργανα, χορωδίες και σύνολα για κάθε μαθητή.": "Organised music departments, instruments, choirs and ensembles for every student.",
  "Σχολείο": "School",
  "Η ιστορία, η φιλοσοφία και οι άνθρωποι του Μουσικού Σχολείου Πειραιά.": "The history, philosophy and people of the Music School of Piraeus.",
  "Μουσικά σύνολα": "Music ensembles",
  "Συμφωνική Ορχήστρα": "Symphony Orchestra",
  "Χορωδία": "Choir",
  "Παραδοσιακό Σύνολο": "Traditional Ensemble",
  "Μπάντα Πνευστών": "Wind Band",
  "Σύνολο Τζαζ": "Jazz Ensemble",
  "Εγγραφές & πληροφορίες": "Admissions & information",
  "Η γραμματεία δέχεται ερωτήματα για εισαγωγικές εξετάσεις, μεταγραφές και μουσικά όργανα.": "The office answers questions about entrance exams, transfers and musical instruments.",
  "Φόρμα επικοινωνίας →": "Contact form →",
  "Βίντεο παρουσίασης": "Presentation video",
  "Μια μέρα στο Μουσικό Σχολείο Πειραιά": "A day at the Music School of Piraeus",
  "Ορχήστρα, χορωδία, παραδοσιακά σύνολα και καθημερινή δημιουργία.": "Orchestra, choir, traditional ensembles and everyday creativity.",
  "Φιλμ": "Film",
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("GR");

  useEffect(() => {
    const stored = window.localStorage.getItem("msp:language");
    if (stored === "EN" || stored === "GR") setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "EN" ? "en" : "el";
    window.localStorage.setItem("msp:language", language);
  }, [language]);

  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const t = (greek: string) => (language === "EN" ? translations[greek] ?? greek : greek);

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
