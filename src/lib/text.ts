/**
 * Βοηθητικά κειμένου χωρίς εξαρτήσεις server — ασφαλή και για τον browser.
 */

/**
 * Κλειδί σύγκρισης ονομάτων κατηγοριών: χωρίς τόνους, πεζά, «ς»→«σ».
 * Έτσι «ΕΞΕΤΑΣΕΙΣ», «Εξετάσεις» και το slug «εξετασεισ» ταιριάζουν όλα.
 */
export function categoryKey(value: string): string {
  let text = value.replace(/&amp;/g, "&");
  try {
    text = decodeURIComponent(text); // τα ελληνικά slugs του WordPress έρχονται ως %ce%b1…
  } catch {
    /* όνομα με «%» που δεν είναι κωδικοποίηση — μένει ως έχει */
  }
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ").trim();
}
