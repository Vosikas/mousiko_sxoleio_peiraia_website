"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

/** Προσωρινή σελίδα για ενότητες που ετοιμάζονται. */
export default function ComingSoon({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="relative mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-5 py-40 text-center">
      <span className="pointer-events-none absolute top-24 font-display text-[16rem] leading-none text-brass-400/[0.07]">
        𝄞
      </span>
      <p className="relative text-[0.62rem] uppercase tracking-[0.34em] text-brass-400">{t(eyebrow)}</p>
      <h1 className="relative mt-5 font-display text-5xl text-cream sm:text-6xl">{t(title)}</h1>
      <p className="relative mt-6 max-w-lg text-sm leading-relaxed text-muted">{t(text)}</p>
      <p className="relative mt-10 rounded-full border border-cream/12 px-6 py-3 text-[0.62rem] uppercase tracking-[0.25em] text-muted">
        {t("Η ενότητα ετοιμάζεται")}
      </p>
      <Link
        href="/"
        className="relative mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-brass-300 transition hover:text-brass-600"
      >
        {t("← Επιστροφή στην αρχική")}
      </Link>
    </div>
  );
}
