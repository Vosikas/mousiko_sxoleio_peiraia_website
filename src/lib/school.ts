import type { L } from "@/i18n/l10n";

/**
 * Every piece of contact information the site shows lives here.
 * Πηγή: η σελίδα «Επικοινωνία» του παλιού site (gym-mous-peiraia.att.sch.gr).
 */

export const SCHOOL = {
  name: "Μουσικό Σχολείο Πειραιά",
  street: "Κ. Μαυρομιχάλη 27",
  area: "Αγία Σοφία, Πειραιάς",
  postcode: "185 45",
  phone: "210 4204426",
  phone2: "210 4204432",
  fax: "",
  email: "msp@sch.gr",
  /** how people actually get here */
  transit: [
    {
      mode: { el: "Μετρό", en: "Metro" },
      detail: { el: "Γραμμή 1, στάση Πειραιάς — 10 λεπτά με τα πόδια", en: "Line 1, Piraeus station — a 10-minute walk" },
    },
    {
      mode: { el: "Λεωφορείο", en: "Bus" },
      detail: { el: "Γραμμές 826, 843, 909 — στάση επί της κεντρικής οδού", en: "Lines 826, 843, 909 — stop on the main road" },
    },
    {
      mode: { el: "Αυτοκίνητο", en: "Car" },
      detail: { el: "Ελεύθερη στάθμευση στον περιβάλλοντα χώρο", en: "Free parking nearby" },
    },
  ] as { mode: L; detail: L }[],
} as const;

export const ADDRESS_LINE = `${SCHOOL.street}, ${SCHOOL.postcode} ${SCHOOL.area}`;

export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  `${SCHOOL.name}, ${ADDRESS_LINE}`,
)}&hl=el&z=16&output=embed`;

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SCHOOL.name}, ${ADDRESS_LINE}`,
)}`;

/** Γραμματεία — minutes from midnight, so the schedule can be drawn to scale. */
export type Day = { label: L; short: L; open: number | null; close: number | null; note?: L };

export const OFFICE_HOURS: Day[] = [
  { label: { el: "Δευτέρα", en: "Monday" }, short: { el: "Δε", en: "Mon" }, open: 8 * 60, close: 15 * 60 },
  { label: { el: "Τρίτη", en: "Tuesday" }, short: { el: "Τρ", en: "Tue" }, open: 8 * 60, close: 15 * 60 },
  {
    label: { el: "Τετάρτη", en: "Wednesday" },
    short: { el: "Τε", en: "Wed" },
    open: 8 * 60,
    close: 17 * 60,
    note: { el: "Απογευματινή βάρδια για ραντεβού γονέων", en: "Afternoon shift for parent appointments" },
  },
  { label: { el: "Πέμπτη", en: "Thursday" }, short: { el: "Πε", en: "Thu" }, open: 8 * 60, close: 15 * 60 },
  { label: { el: "Παρασκευή", en: "Friday" }, short: { el: "Πα", en: "Fri" }, open: 8 * 60, close: 14 * 60 },
  { label: { el: "Σάββατο", en: "Saturday" }, short: { el: "Σα", en: "Sat" }, open: null, close: null },
  { label: { el: "Κυριακή", en: "Sunday" }, short: { el: "Κυ", en: "Sun" }, open: null, close: null },
];

/** window drawn on the schedule strip */
export const DAY_START = 7 * 60;
export const DAY_END = 18 * 60;

export const clockLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
