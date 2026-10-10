/**
 * ΔΙΓΛΩΣΣΑ ΚΕΙΜΕΝΑ — χωρίς εξαρτήσεις, ασφαλή για server και browser.
 *
 * Ένα κείμενο περιεχομένου (`L`) γράφεται με έναν από δύο τρόπους:
 *
 *   title: "Ωρολόγιο Πρόγραμμα"                          ← μόνο ελληνικά
 *   title: { el: "Ωρολόγιο Πρόγραμμα", en: "Timetable" }  ← και αγγλικά
 *
 * Στα αγγλικά, ένα σκέτο ελληνικό κείμενο ψάχνεται στο λεξικό
 * (src/i18n/dictionary.ts)· αν δεν βρεθεί, εμφανίζεται στα ελληνικά —
 * ποτέ κενό. Όταν αλλάζετε ένα ελληνικό κείμενο, αλλάξτε και το `en` δίπλα.
 */

export type Lang = "GR" | "EN";

/** Κείμενο σε δύο γλώσσες. */
export type L = string | { el: string; en: string };

/** Τα ελληνικά ενός κειμένου — για SEO, URLs, συγκρίσεις στον server. */
export const el = (value: L): string => (typeof value === "string" ? value : value.el);

/** Αντικαθιστά τα {όνομα} ενός κειμένου με τιμές: «έως τις {time}». */
export function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Locale για Intl (ημερομηνίες, μήνες, ημέρες). */
export const intlLocale = (lang: Lang) => (lang === "EN" ? "en-GB" : "el-GR");
