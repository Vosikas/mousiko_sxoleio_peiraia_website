/**
 * Κεντρικές ρυθμίσεις του site.
 * Ό,τι αλλάζει συχνά (τηλέφωνα, διεύθυνση, βίντεο) ζει εδώ ή στο .env.local.
 */

export const site = {
  name: "Μουσικό Σχολείο Πειραιά",
  shortName: "ΜΣΠ",
  tagline: "Παιδεία, τέχνη και ήχος από το 1988",
  description:
    "Το Μουσικό Σχολείο Πειραιά συνδυάζει την πλήρη γενική παιδεία με ολοκληρωμένη μουσική εκπαίδευση, ευρωπαϊκή και παραδοσιακή.",
  locale: "el_GR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mousiko-peiraia.gr",

  contact: {
    address: "Πειραιάς, Αττική",
    phone: "210 0000000",
    email: "mail@gym-mous-peiraia.att.sch.gr",
  },

  hours: {
    // 24ωρη μορφή, τοπική ώρα Ελλάδας
    openHour: 8,
    closeHour: 16,
    openDays: [1, 2, 3, 4, 5], // Δευτέρα–Παρασκευή
  },

  /**
   * Το βίντεο παρουσίασης του σχολείου.
   * Δώστε YouTube ID στο .env.local (NEXT_PUBLIC_SCHOOL_VIDEO_ID)
   * ή αντικαταστήστε με δικό σας αρχείο mp4 στο /public.
   */
  video: {
    youtubeId: process.env.NEXT_PUBLIC_SCHOOL_VIDEO_ID ?? "",
    mp4: process.env.NEXT_PUBLIC_SCHOOL_VIDEO_MP4 ?? "",
    title: "Μια μέρα στο Μουσικό Σχολείο Πειραιά",
    subtitle: "Ορχήστρα, χορωδία, παραδοσιακά σύνολα και καθημερινή δημιουργία.",
  },

  nav: [
    { label: "ΑΡΧΙΚΗ", href: "/" },
    { label: "ΤΟ ΣΧΟΛΕΙΟ", href: "/to-scholeio" },
    { label: "ΤΜΗΜΑΤΑ", href: "/tmimata" },
    { label: "ΝΕΑ", href: "/nea" },
    { label: "ΕΚΔΗΛΩΣΕΙΣ", href: "/ekdiloseis" },
    { label: "ΕΠΙΚΟΙΝΩΝΙΑ", href: "/epikoinonia" },
  ],

  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ],
} as const;

export type Site = typeof site;
