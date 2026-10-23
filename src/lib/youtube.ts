/**
 * Κατάσταση ενός βίντεο YouTube, μέσω του δημόσιου oEmbed — ελέγχεται μία
 * φορά τη μέρα (cache του Next.js). Μόνο για τον server.
 *   "ok"       → υπάρχει και παίζει μέσα στο site
 *   "no-embed" → υπάρχει, αλλά ο κάτοχος δεν επιτρέπει να παίζει σε άλλα sites (401/403)
 *   "gone"     → σβήστηκε ή δεν υπάρχει (400/404)
 * Αν το YouTube δεν απαντά, θεωρούμε ότι όλα είναι εντάξει.
 */
export async function youtubeStatus(id: string): Promise<"ok" | "no-embed" | "gone"> {
  try {
    const res = await fetch(
      "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(`https://www.youtube.com/watch?v=${id}`),
      { next: { revalidate: 86_400 } },
    );
    if (res.status === 401 || res.status === 403) return "no-embed";
    if (res.status === 400 || res.status === 404) return "gone";
    return "ok";
  } catch {
    return "ok";
  }
}
