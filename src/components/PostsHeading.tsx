"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function PostsHeading({ wordpressConfigured }: { wordpressConfigured: boolean }) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-brass-400">{t("Νέα & ανακοινώσεις")}</p>
          <h2 id="posts-title" className="mt-3 font-display text-3xl text-cream sm:text-4xl">{t("Τελευταία από το σχολείο")}</h2>
        </div>
        <Link
          href="/nea"
          className="group inline-flex items-center gap-2 self-start text-[0.68rem] uppercase tracking-[0.22em] text-cream/70 transition hover:text-brass-600 sm:self-auto"
        >
          {t("Όλα τα νέα")}
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
      {!wordpressConfigured && (
        <p className="mt-6 rounded-xl border border-brass-400/25 bg-brass-400/[0.06] px-4 py-3 text-[0.72rem] leading-relaxed text-brass-600">
          {t("Προβάλλεται δείγμα περιεχομένου. Συνδέστε το WordPress ορίζοντας")} {" "}
          <code className="text-brass-600">WORDPRESS_API_URL</code> {t("στο")} {" "}
          <code className="text-brass-600">.env.local</code> {" "}
          {t("— τα άρθρα θα έρθουν αυτόματα.")}
        </p>
      )}
    </>
  );
}
