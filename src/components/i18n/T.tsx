"use client";

import { useLanguage } from "@/hooks/useLanguage";
import type { L } from "@/i18n/l10n";

/**
 * Μεταφράσιμο κείμενο για SERVER components — τα οποία δεν «βλέπουν» το
 * κουμπί γλώσσας, γιατί αυτό ζει στον browser.
 *
 *   <T v="Νέα & Ανακοινώσεις" />              ← λεξικό interface
 *   <T v={page.title} />                       ← κείμενο περιεχομένου (L)
 *   <T v="πριν από {n} χρόνια" vars={{ n }} />  ← με τιμές
 */
export default function T({ v, vars }: { v: L; vars?: Record<string, string | number> }) {
  const { l } = useLanguage();
  return <>{l(v, vars)}</>;
}
