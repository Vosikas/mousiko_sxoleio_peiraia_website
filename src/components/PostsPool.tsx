import PostCard from "./PostCard";
import PostsHeading from "./PostsHeading";
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
      <Reveal>
        <PostsHeading wordpressConfigured={isWordPressConfigured()} />
      </Reveal>

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
