import { SCHOOL } from "./school";

/** Το σχολείο ιδρύθηκε το σχολικό έτος 1995-96 (Λύκειο από το 2000-01). */
const FOUNDED = 1995;

/** Το βίντεο της αρχικής του παλιού site — όσο δεν έχει οριστεί άλλο. */
const OLD_SITE_VIDEO = "https://gym-mous-peiraia.att.sch.gr/wp-content/uploads/2021/11/videoplayback.mp4";

/**
 * Κεντρικές ρυθμίσεις του site.
 * Ό,τι αλλάζει συχνά (τηλέφωνα, διεύθυνση, βίντεο) ζει εδώ ή στο .env.local.
 */

export const site = {
  name: "Μουσικό Σχολείο Πειραιά",
  shortName: "ΜΣΠ",
  tagline: "Παιδεία, τέχνη και ήχος από το 1995",
  founded: FOUNDED,
  description:
    "Το Μουσικό Σχολείο Πειραιά συνδυάζει την πλήρη γενική παιδεία με ολοκληρωμένη μουσική εκπαίδευση, ευρωπαϊκή και παραδοσιακή.",
  locale: "el_GR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mousiko-peiraia.gr",

  // Από το src/lib/school.ts — εκεί αλλάζουν τα στοιχεία επικοινωνίας.
  contact: {
    address: `${SCHOOL.street}, ${SCHOOL.area}`,
    phone: SCHOOL.phone,
    email: SCHOOL.email,
  },

  hours: {
    // 24ωρη μορφή, τοπική ώρα Ελλάδας
    openHour: 8,
    closeHour: 16,
    openDays: [1, 2, 3, 4, 5], // Δευτέρα–Παρασκευή
  },

  /**
   * Το βίντεο παρουσίασης του σχολείου.
   * Δώστε YouTube ID στο .env.local (NEXT_PUBLIC_SCHOOL_VIDEO_ID) ή δικό σας
   * mp4 (NEXT_PUBLIC_SCHOOL_VIDEO_MP4). Χωρίς αυτά: το βίντεο του παλιού site.
   */
  video: {
    youtubeId: process.env.NEXT_PUBLIC_SCHOOL_VIDEO_ID || "",
    mp4: process.env.NEXT_PUBLIC_SCHOOL_VIDEO_ID ? "" : process.env.NEXT_PUBLIC_SCHOOL_VIDEO_MP4 || OLD_SITE_VIDEO,
    title: "Μια μέρα στο Μουσικό Σχολείο Πειραιά",
    subtitle: "Ορχήστρα, χορωδία, παραδοσιακά σύνολα και καθημερινή δημιουργία.",
  },

  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ],
} as const;

export type Site = typeof site;
