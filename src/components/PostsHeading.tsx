"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function PostsHeading() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-plum-400">{t("Νέα & ανακοινώσεις")}</p>
          <h2 id="posts-title" className="mt-3 font-display text-3xl text-cream sm:text-4xl">{t("Τελευταία από το σχολείο")}</h2>
        </div>
        <Link
          href="/nea"
          className="group inline-flex items-center gap-2 self-start text-[0.68rem] uppercase tracking-[0.22em] text-cream/70 transition hover:text-plum-600 sm:self-auto"
        >
          {t("Όλα τα νέα")}
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    </>
  );
}
