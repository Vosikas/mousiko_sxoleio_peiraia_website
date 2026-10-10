"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { intlLocale } from "@/i18n/l10n";
import { formatGreekDate } from "@/lib/wordpress";

/** Ημερομηνία άρθρου στη γλώσσα του επισκέπτη: «18 Δεκεμβρίου 2025» / «18 December 2025». */
export default function DateText({ iso }: { iso: string }) {
  const { language } = useLanguage();
  const text =
    language === "EN"
      ? new Intl.DateTimeFormat(intlLocale(language), { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso))
      : formatGreekDate(iso);
  return <time dateTime={iso}>{text}</time>;
}
