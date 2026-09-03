import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGreekDate, getPostBySlug, getRecentPosts, type WPRawPost, WP_API_URL } from "@/lib/wordpress";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Το άρθρο δεν βρέθηκε" };
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = WP_API_URL
    ? await fetchContent(slug)
    : "<p>" + post.excerpt + "</p><p>Το πλήρες κείμενο θα εμφανιστεί μόλις συνδεθεί το WordPress.</p>";
  const featuredImage = post.image?.src ? post.image : null;

  const more = (await getRecentPosts(4)).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-40 lg:px-0">
      <Link
        href="/nea"
        className="text-[0.65rem] uppercase tracking-[0.25em] text-muted transition hover:text-brass-600"
      >
        ← Όλα τα νέα
      </Link>

      <div className="mt-8 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-brass-400">
        {post.category && <span>{post.category}</span>}
        <span className="h-1 w-1 rounded-full bg-brass-400/60" />
        <time dateTime={post.date} className="text-muted">
          {formatGreekDate(post.date)}
        </time>
      </div>

      <h1 className="mt-5 font-display text-4xl leading-tight text-cream sm:text-5xl">
        {post.title}
      </h1>

      {featuredImage && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl2 ring-1 ring-cream/10">
          <Image src={featuredImage.src} alt={featuredImage.alt} fill sizes="800px" className="object-cover" />
        </div>
      )}

      <div
        className="prose-article mt-10 space-y-5 text-[0.95rem] leading-[1.85] text-cream/80"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {more.length > 0 && (
        <section className="mt-20 border-t border-cream/8 pt-10">
          <h2 className="text-[0.62rem] uppercase tracking-[0.3em] text-brass-400">Διαβάστε επίσης</h2>
          <ul className="mt-6 space-y-4">
            {more.map((p) => (
              <li key={p.id}>
                <Link
                  href={p.href}
                  className="group flex items-baseline justify-between gap-6 border-b border-cream/6 pb-4 transition"
                >
                  <span className="font-display text-lg text-cream/85 transition group-hover:text-brass-600">
                    {p.title}
                  </span>
                  <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                    {formatGreekDate(p.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

/** Το πλήρες HTML του άρθρου, όπως το παράγει το WordPress. */
async function fetchContent(slug: string): Promise<string> {
  try {
    const res = await fetch(WP_API_URL + "/posts?slug=" + encodeURIComponent(slug) + "&_embed", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return "";
    const data = (await res.json()) as Pick<WPRawPost, "content">[];
    return data[0]?.content?.rendered ?? "";
  } catch {
    return "";
  }
}
