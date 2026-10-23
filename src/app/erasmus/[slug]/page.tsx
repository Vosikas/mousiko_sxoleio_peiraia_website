import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/erasmus/ErasmusPage";
import DateText from "@/components/i18n/DateText";
import T from "@/components/i18n/T";
import { getErasmusPost, getErasmusPosts } from "@/lib/erasmus-blog";

// Άρθρα του blog Erasmus+: όσα υπάρχουν στο build χτίζονται τότε, τα νεότερα
// την πρώτη φορά που θα ζητηθούν.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getErasmusPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getErasmusPost((await params).slug);
  if (!post) return { title: "Το άρθρο δεν βρέθηκε" };
  return { title: `${post.title} · Erasmus+`, description: post.excerpt };
}

export default async function ErasmusArticle({ params }: Props) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getErasmusPost(slug), getErasmusPosts()]);
  if (!post) notFound();
  const more = all.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-5xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <Link
        href="/erasmus"
        className="text-[0.65rem] uppercase tracking-[0.25em] text-muted transition hover:text-plum-600"
      >
        ← Erasmus+
      </Link>

      <p className="mt-8 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-plum-500">
        <span>Erasmus+</span>
        {post.date && (
          <>
            <span className="h-1 w-1 rounded-full bg-plum-400/60" />
            <span className="text-muted">
              <DateText iso={post.date} />
            </span>
          </>
        )}
      </p>
      <h1 className="mt-4 max-w-4xl font-display text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-[1.12]">
        {post.title}
      </h1>

      {post.html && (
        <div className="surface-box mt-10 p-7 sm:p-10">
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      )}

      {more.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            <T v="Περισσότερα από το Erasmus+" />
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug} className="h-full">
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
