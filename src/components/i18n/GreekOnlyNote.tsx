"use client";

import { useLanguage } from "@/hooks/useLanguage";

/** Μόνο στα αγγλικά: το κείμενο που ακολουθεί (από το WordPress) υπάρχει μόνο στα ελληνικά. */
export default function GreekOnlyNote() {
  const { language, t } = useLanguage();
  if (language !== "EN") return null;

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-plum-100 px-4 py-2 text-sm text-plum-600">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-plum-500" />
      {t("Το κείμενο αυτής της σελίδας είναι διαθέσιμο μόνο στα ελληνικά.")}
    </p>
  );
}
