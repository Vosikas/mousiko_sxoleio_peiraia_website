import Link from "next/link";
import DateText from "@/components/i18n/DateText";
import T from "@/components/i18n/T";
import CategoryFeed from "@/components/section/CategoryFeed";
import PageIntro from "@/components/section/PageIntro";
import {
  ERASMUS,
  ERASMUS_BLOG,
  ERASMUS_PADLET,
  ERASMUS_PROGRAMME,
  ERASMUS_TIMELINE,
  ERASMUS_VALUES,
} from "@/content/erasmus";
import { getErasmusPosts, type ErasmusPost } from "@/lib/erasmus-blog";

/**
 * Η σελίδα Erasmus+:
 *   πρόγραμμα (κείμενο + στάδια) → γιατί Erasmus+ → η χρονιά με μια ματιά →
 *   τα άρθρα του blog (ανοίγουν στο /erasmus/<άρθρο>) → ο Padlet → το blog.
 * Κείμενα: src/content/erasmus.ts · άρθρα: src/lib/erasmus-blog.ts (RSS).
 */
export default async function ErasmusPage() {
  const posts = await getErasmusPosts();
  const available = new Set(posts.map((post) => post.slug));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <PageIntro eyebrow={ERASMUS.eyebrow} title={ERASMUS.title} lead={ERASMUS.summary} />

      {/* ------------------------------------------------ το πρόγραμμα */}
      <section className="surface-box mt-14 grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
        <div>
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] surface-box-accent">
            <T v="Το πρόγραμμά μας" />
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            <T v={ERASMUS_PROGRAMME.name} />
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-[1.02rem] leading-[1.8] text-cream/85">
            {ERASMUS_PROGRAMME.paragraphs.map((p, i) => (
              <p key={i}>
                <T v={p} />
              </p>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
                <T v="Δράση" />
              </dt>
              <dd className="mt-1 font-semibold">{ERASMUS_PROGRAMME.action}</dd>
            </div>
            <div>
              <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
                <T v="Κωδικός" />
              </dt>
              <dd className="mt-1 break-all font-mono text-[0.78rem]">{ERASMUS_PROGRAMME.code}</dd>
            </div>
          </dl>
          <h3 className="mt-6 border-t border-cream/10 pt-5 text-[0.6rem] uppercase tracking-[0.22em] text-muted">
            <T v="Τα τρία στάδια" />
          </h3>
          <ol className="mt-4 space-y-4">
            {ERASMUS_PROGRAMME.stages.map((stage, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-500 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-snug">
                  <span className="block font-semibold">
                    <T v={stage.title} />
                  </span>
                  <span className="text-muted">
                    <T v={stage.where} />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* ------------------------------------------------ γιατί Erasmus+ */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          <T v="Γιατί Erasmus+" />
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {ERASMUS_VALUES.map((value, i) => (
            <li key={i} className="surface-box p-7">
              <span className="font-display text-3xl font-semibold text-plum-300">0{i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug surface-box-accent">
                <T v={value.title} />
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/80">
                <T v={value.text} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ η χρονιά με μια ματιά */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          <T v="Η χρονιά 2025–2026 με μια ματιά" />
        </h2>
        <ol className="mt-8 space-y-8 border-l-2 border-plum-200 pl-7 sm:pl-9">
          {ERASMUS_TIMELINE.map((step) => (
            <li key={step.post} className="relative">
              <span aria-hidden className="absolute -left-[2.15rem] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-plum-500 shadow sm:-left-[2.65rem]" />
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-plum-500">
                <T v={step.when} /> · <T v={step.place} />
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">
                <T v={step.title} />
              </h3>
              <p className="mt-1 max-w-2xl leading-relaxed text-cream/80">
                <T v={step.text} />
              </p>
              {available.has(step.post) && (
                <Link
                  href={`/erasmus/${step.post}`}
                  className="mt-2 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-plum-500 transition hover:text-plum-700"
                >
                  <T v="Διαβάστε το άρθρο →" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------ τα άρθρα του blog */}
      {posts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            <T v="Από το blog μας" />
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="h-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------ Padlet */}
      <section className="surface-box mt-16 p-7 sm:p-10">
        <h2 className="font-display text-xl font-semibold sm:text-2xl surface-box-accent">
          <T v={ERASMUS_PADLET.title} />
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-cream/80">
          <T v={ERASMUS_PADLET.text} />
        </p>
        <div className="mt-6 h-[34rem] overflow-hidden rounded-2xl bg-white">
          <iframe src={ERASMUS_PADLET.embed} title="Padlet — Erasmus+" loading="lazy" className="h-full w-full border-0" />
        </div>
        <a
          href={ERASMUS_PADLET.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-plum-500 transition hover:text-plum-700"
        >
          <T v="Άνοιγμα στο Padlet" /> ↗
        </a>
      </section>

      <div className="mt-12 flex justify-center">
        <a
          href={`${ERASMUS_BLOG}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-solid rounded-full px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
        >
          <T v="Το blog του Erasmus+" /> ↗
        </a>
      </div>

      {/* Και όσα άρθρα του WordPress του σχολείου αφορούν το Erasmus. */}
      {ERASMUS.wpCategories?.length ? <CategoryFeed categories={ERASMUS.wpCategories} /> : null}
    </div>
  );
}

/** Κάρτα άρθρου του blog — ανοίγει μέσα στο site. */
export function PostCard({ post }: { post: ErasmusPost }) {
  return (
    <Link
      href={`/erasmus/${post.slug}`}
      className="surface-box group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-plum-500 to-plum-700">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold text-white/90">
            Erasmus+
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.date && (
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
            <DateText iso={post.date} />
          </p>
        )}
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug transition-colors group-hover:text-plum-500">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/75">{post.excerpt}</p>}
        <span className="mt-auto pt-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-plum-500">
          <T v="Διαβάστε το άρθρο →" />
        </span>
      </div>
    </Link>
  );
}
