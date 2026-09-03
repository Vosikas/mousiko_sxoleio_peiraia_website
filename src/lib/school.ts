/**
 * Every piece of contact information the site shows lives here.
 * Replace the placeholders with the school's real details.
 */

export const SCHOOL = {
  name: "Μουσικό Σχολείο Πειραιά",
  street: "Οδός και αριθμός",           // TODO
  area: "Πειραιάς, Αττική",
  postcode: "185 00",                    // TODO
  phone: "210 0000000",                  // TODO
  fax: "",
  email: "mail@gym-mous-peiraia.att.sch.gr",
  /** how people actually get here */
  transit: [
    { mode: "Μετρό", detail: "Γραμμή 1, στάση Πειραιάς — 10 λεπτά με τα πόδια" },
    { mode: "Λεωφορείο", detail: "Γραμμές 826, 843, 909 — στάση επί της κεντρικής οδού" },
    { mode: "Αυτοκίνητο", detail: "Ελεύθερη στάθμευση στον περιβάλλοντα χώρο" },
  ],
} as const;

export const ADDRESS_LINE = `${SCHOOL.street}, ${SCHOOL.postcode} ${SCHOOL.area}`;

export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  `${SCHOOL.name}, ${ADDRESS_LINE}`,
)}&hl=el&z=16&output=embed`;

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SCHOOL.name}, ${ADDRESS_LINE}`,
)}`;

/** Γραμματεία — minutes from midnight, so the schedule can be drawn to scale. */
export type Day = { label: string; short: string; open: number | null; close: number | null; note?: string };

export const OFFICE_HOURS: Day[] = [
  { label: "Δευτέρα", short: "Δε", open: 8 * 60, close: 15 * 60 },
  { label: "Τρίτη", short: "Τρ", open: 8 * 60, close: 15 * 60 },
  { label: "Τετάρτη", short: "Τε", open: 8 * 60, close: 17 * 60, note: "Απογευματινή βάρδια για ραντεβού γονέων" },
  { label: "Πέμπτη", short: "Πε", open: 8 * 60, close: 15 * 60 },
  { label: "Παρασκευή", short: "Πα", open: 8 * 60, close: 14 * 60 },
  { label: "Σάββατο", short: "Σα", open: null, close: null },
  { label: "Κυριακή", short: "Κυ", open: null, close: null },
];

/** window drawn on the schedule strip */
export const DAY_START = 7 * 60;
export const DAY_END = 18 * 60;

export const clockLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
