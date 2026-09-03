"use client";

import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { Post } from "@/lib/wordpress";

const PAGE_SIZE = 9;

type SortOrder = "newest" | "oldest";

export default function NewsBrowser({ posts }: { posts: Post[] }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean) as string[]))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === "EN" ? "en-US" : "el-GR");
    return [...posts]
      .filter((post) => {
        const searchable = [post.title, post.excerpt, post.category ?? "", post.author ?? ""]
          .join(" ")
          .toLocaleLowerCase(language === "EN" ? "en-US" : "el-GR");
        return (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (category === "all" || post.category === category);
      })
      .sort((a, b) => {
        const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sort === "newest" ? -difference : difference;
      });
  }, [category, language, posts, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const visiblePosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [category, query, sort]);

  return (
    <>
      <div className="mt-12 rounded-2xl border border-cream/12 bg-ink-850/70 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">{t("Αναζήτηση")}</span>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Αναζήτηση ανακοινώσεων")}
              className="w-full rounded-xl border border-cream/15 bg-white px-11 py-3 text-sm text-cream outline-none transition placeholder:text-muted/70 focus:border-brass-500 focus:ring-2 focus:ring-brass-400/20"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOrder)}
            aria-label={t("Ταξινόμηση")}
            className="rounded-xl border border-cream/15 bg-white px-4 py-3 text-sm text-cream outline-none focus:border-brass-500"
          >
            <option value="newest">{t("Νεότερα πρώτα")}</option>
            <option value="oldest">{t("Παλαιότερα πρώτα")}</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.62rem] uppercase tracking-[0.2em] text-muted">{t("Κατηγορία")}</span>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                "rounded-full border px-3.5 py-2 text-[0.65rem] font-medium transition " +
                (category === item
                  ? "border-brass-600 bg-brass-600 text-white"
                  : "border-cream/15 bg-white text-cream/75 hover:border-brass-500 hover:text-brass-600")
              }
            >
              {item === "all" ? t("Όλα") : item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
        <span>{filteredPosts.length} {t("ανακοινώσεις")}</span>
        {query || category !== "all" ? (
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }} className="text-brass-600 transition hover:text-brass-500">
            {t("Καθαρισμός φίλτρων")}
          </button>
        ) : null}
      </div>

      {visiblePosts.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-cream/20 px-6 py-16 text-center text-sm text-muted">
          {t("Δεν βρέθηκαν ανακοινώσεις με αυτά τα κριτήρια.")}
        </div>
      )}

      {pageCount > 1 && (
        <nav aria-label={t("Σελιδοποίηση")} className="mt-10 flex items-center justify-center gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-cream/15 bg-white px-4 py-2 text-sm text-cream transition hover:border-brass-500 disabled:cursor-not-allowed disabled:opacity-35">←</button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={"h-9 w-9 rounded-full text-sm transition " + (page === number ? "bg-brass-600 text-white" : "border border-cream/15 bg-white text-cream hover:border-brass-500")}>{number}</button>
          ))}
          <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-cream/15 bg-white px-4 py-2 text-sm text-cream transition hover:border-brass-500 disabled:cursor-not-allowed disabled:opacity-35">→</button>
        </nav>
      )}
    </>
  );
}
