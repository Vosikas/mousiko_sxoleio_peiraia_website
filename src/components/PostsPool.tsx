import Link from "next/link";
import PostCard from "./PostCard";
import Reveal from "./Reveal";
import { getRecentPosts, isWordPressConfigured } from "@/lib/wordpress";

/**
 * «Δεξαμενή» άρθρων: τα 4 πιο πρόσφατα από το WordPress.
 * Server Component — τα δεδομένα έρχονται με ISR, χωρίς JavaScript στον client.
 */
export default async function PostsPool() {
  const posts = await getRecentPosts(4);
  const [featured, ...rest] = posts;

  return (
    <section aria-labelledby="posts-title">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-brass-400">
            Νέα &amp; ανακοινώσεις
          </p>
          <h2 id="posts-title" className="mt-3 font-display text-3xl text-cream sm:text-4xl">
            Τελευταία από το σχολείο
          </h2>
        </div>

        <Link
          href="/nea"
          className="group inline-flex items-center gap-2 self-start text-[0.68rem] uppercase tracking-[0.22em] text-cream/70 transition hover:text-brass-600 sm:self-auto"
        >
          Όλα τα νέα
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </Reveal>

      {!isWordPressConfigured() && (
        <Reveal className="mt-6" delay={60}>
          <p className="rounded-xl border border-brass-400/25 bg-brass-400/[0.06] px-4 py-3 text-[0.72rem] leading-relaxed text-brass-600">
            Προβάλλεται δείγμα περιεχομένου. Συνδέστε το WordPress ορίζοντας{" "}
            <code className="text-brass-600">WORDPRESS_API_URL</code> στο{" "}
            <code className="text-brass-600">.env.local</code> — τα άρθρα θα έρθουν αυτόματα.
          </p>
        </Reveal>
      )}

      <div className="mt-9 space-y-6">
        {featured && (
          <Reveal delay={80}>
            <PostCard post={featured} featured index={0} />
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={140 + i * 90} className="h-full">
                <PostCard post={post} index={i + 1} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Σκελετός φόρτωσης για το Suspense boundary. */
export function PostsPoolSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded bg-ink-850" />
      <div className="h-72 animate-pulse rounded-xl2 bg-ink-850" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl2 bg-ink-850" />
        ))}
      </div>
    </div>
  );
}
