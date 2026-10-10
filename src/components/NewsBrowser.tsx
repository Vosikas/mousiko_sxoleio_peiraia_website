"use client";

import { useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import { useLanguage } from "@/hooks/useLanguage";
import type { Post } from "@/lib/wordpress";
import { categoryKey } from "@/lib/text";

const PAGE_SIZE = 10;

type SortOrder = "newest" | "oldest";
type CategoryOption = { key: string; label: string; count: number };

/**
 * Η ροή των Νέων: αναζήτηση και ταξινόμηση πάνω από τα άρθρα, κατηγορίες
 * στη δεξιά στήλη. Οι βασικές κατηγορίες (src/content/news.ts) φαίνονται
 * πάντα· όποια άλλη κατηγορία έχει άρθρα στο WordPress προστίθεται μόνη της.
 */
export default function NewsBrowser({ posts, pinnedCategories }: { posts: Post[]; pinnedCategories: string[] }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  /** Το κλειδί (categoryKey) της επιλεγμένης κατηγορίας· null = όλες. */
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);

  // Κάθε αλλαγή φίλτρου γυρίζει στην 1η σελίδα — εδώ, όχι σε effect.
  const selectCategory = (key: string | null) => {
    setCategory(key);
    setPage(1);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeSort = (value: SortOrder) => {
    setSort(value);
    setPage(1);
  };

  const categories = useMemo<CategoryOption[]>(() => {
    const found = new Map<string, CategoryOption>();
    for (const post of posts) {
      for (const name of post.categories) {
        const key = categoryKey(name);
        const entry = found.get(key) ?? { key, label: name, count: 0 };
        entry.count += 1;
        found.set(key, entry);
      }
    }
    const pinned = pinnedCategories.map((label) => {
      const key = categoryKey(label);
      return { key, label, count: found.get(key)?.count ?? 0 };
    });
    const pinnedKeys = new Set(pinned.map((c) => c.key));
    const extra = [...found.values()]
      .filter((c) => !pinnedKeys.has(c.key))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "el"));
    return [...pinned, ...extra];
  }, [posts, pinnedCategories]);

  const filteredPosts = useMemo(() => {
    const locale = language === "EN" ? "en-US" : "el-GR";
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return [...posts]
      .filter((post) => {
        const inCategory = category === null || post.categories.some((name) => categoryKey(name) === category);
        if (!inCategory) return false;
        if (!normalizedQuery) return true;
        return [post.title, post.excerpt, ...post.categories, post.author ?? ""]
          .join(" ")
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sort === "newest" ? -difference : difference;
      });
  }, [category, language, posts, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const visiblePosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = categories.find((c) => c.key === category);

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-10">
      {/* ΔΕΞΙΑ ΣΤΗΛΗ — κατηγορίες. Στο κινητό έρχεται πρώτη, ως λωρίδα που κυλάει. */}
      <aside className="lg:order-2">
        <nav aria-label={t("Κατηγορίες")} className="lg:sticky lg:top-28 lg:rounded-xl2 lg:bg-box lg:p-3">
          <p className="hidden px-3 pb-3 pt-2 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-plum-500 lg:block">
            {t("Κατηγορίες")}
          </p>
          <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
            <li>
              <CategoryButton
                label={t("Όλες")}
                count={posts.length}
                active={category === null}
                onClick={() => selectCategory(null)}
              />
            </li>
            {categories.map((c) => (
              <li key={c.key}>
                <CategoryButton
                  label={t(c.label)}
                  count={c.count}
                  active={category === c.key}
                  onClick={() => selectCategory(c.key)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ΚΥΡΙΑ ΣΤΗΛΗ — αναζήτηση, ταξινόμηση και άρθρα. */}
      <div className="min-w-0 lg:order-1">
        <div className="surface-box flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
          <label className="relative flex-1">
            <span className="sr-only">{t("Αναζήτηση")}</span>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder={t("Αναζήτηση ανακοινώσεων")}
              className="w-full rounded-xl border border-cream/15 bg-white px-11 py-3 text-sm text-cream outline-none transition placeholder:text-muted/70 focus:border-plum-500 focus:ring-2 focus:ring-plum-400/20"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => changeSort(event.target.value as SortOrder)}
            aria-label={t("Ταξινόμηση")}
            className="rounded-xl border border-cream/15 bg-white px-4 py-3 text-sm text-cream outline-none focus:border-plum-500"
          >
            <option value="newest">{t("Νεότερα πρώτα")}</option>
            <option value="oldest">{t("Παλαιότερα πρώτα")}</option>
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[0.18em] text-muted">
          <span>
            {filteredPosts.length} {t("ανακοινώσεις")}
            {selected ? <span className="text-plum-500"> · {t(selected.label)}</span> : null}
          </span>
          {query || category !== null ? (
            <button type="button" onClick={() => { changeQuery(""); selectCategory(null); }} className="text-plum-600 transition hover:text-plum-500">
              {t("Καθαρισμός φίλτρων")}
            </button>
          ) : null}
        </div>

        {visiblePosts.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {visiblePosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-cream/20 px-6 py-16 text-center text-sm text-muted">
            {selected && selected.count === 0 && !query
              ? t("Δεν υπάρχουν ακόμη δημοσιεύσεις σε αυτή την κατηγορία.")
              : t("Δεν βρέθηκαν ανακοινώσεις με αυτά τα κριτήρια.")}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label={t("Σελιδοποίηση")} className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)} className="rounded-full border border-cream/15 bg-white px-4 py-2 text-sm text-cream transition hover:border-plum-500 disabled:cursor-not-allowed disabled:opacity-35">←</button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" onClick={() => goToPage(number)} aria-current={page === number ? "page" : undefined} className={"h-9 w-9 rounded-full text-sm transition " + (page === number ? "btn-solid" : "border border-cream/15 bg-white text-cream hover:border-plum-400 hover:text-plum-500")}>{number}</button>
            ))}
            <button type="button" disabled={page === pageCount} onClick={() => goToPage(page + 1)} className="rounded-full border border-cream/15 bg-white px-4 py-2 text-sm text-cream transition hover:border-plum-500 disabled:cursor-not-allowed disabled:opacity-35">→</button>
          </nav>
        )}
      </div>
    </div>
  );
}

/** Ένα κουμπί κατηγορίας: «τσιπ» στο κινητό, γραμμή λίστας στη δεξιά στήλη. */
function CategoryButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition lg:w-full lg:justify-between lg:whitespace-normal lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-left " +
        (active
          ? "bg-plum-500 font-semibold text-white lg:bg-white lg:text-plum-500 lg:shadow-sm"
          : (count === 0 ? "text-muted " : "text-cream/80 ") + "bg-box hover:text-plum-500 lg:bg-transparent lg:hover:bg-white/60")
      }
    >
      <span>{label}</span>
      <span className={"text-xs tabular-nums " + (active ? "opacity-80" : "opacity-60")}>{count}</span>
    </button>
  );
}
