import Image from "next/image";
import Link from "next/link";
import { formatGreekDate, type Post } from "@/lib/wordpress";

const GLYPHS = ["♪", "♫", "♩", "♬"];

export default function PostCard({
  post,
  featured = false,
  index = 0,
}: {
  post: Post;
  featured?: boolean;
  index?: number;
}) {
  return (
    <article
      className={
        "group relative overflow-hidden rounded-xl2 border border-cream/8 bg-ink-850/60 transition-all duration-500 hover:border-brass-400/35 hover:bg-ink-800/70 " +
        (featured ? "sm:grid sm:grid-cols-2" : "flex flex-col")
      }
    >
      <Link href={post.href} className="absolute inset-0 z-10" aria-label={post.title} />

      {/* Εικόνα */}
      <div
        className={
          "relative overflow-hidden bg-ink-900 " + (featured ? "aspect-[4/3] sm:aspect-auto" : "aspect-[16/10]")
        }
      >
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes={featured ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 1024px) 100vw, 22vw"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(208,169,95,0.16),transparent_60%)]">
            <span className="font-display text-6xl text-brass-400/30 transition-transform duration-700 group-hover:scale-110">
              {GLYPHS[index % GLYPHS.length]}
            </span>
            <span className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-brass-400/25 to-transparent" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-70" />

        {post.category && (
          <span className="absolute left-4 top-4 rounded-full border border-brass-300/40 bg-ink-950/70 px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-brass-200 backdrop-blur-sm">
            {post.category}
          </span>
        )}
      </div>

      {/* Κείμενο */}
      <div className={"flex flex-1 flex-col p-6 " + (featured ? "sm:p-8" : "")}>
        <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
          <time dateTime={post.date}>{formatGreekDate(post.date)}</time>
          <span className="h-1 w-1 rounded-full bg-brass-400/60" />
          <span>{post.readingMinutes}΄ ανάγνωση</span>
        </div>

        <h3
          className={
            "mt-3 font-display leading-snug text-cream transition-colors duration-300 group-hover:text-brass-100 " +
            (featured ? "text-2xl sm:text-3xl" : "text-lg")
          }
        >
          {post.title}
        </h3>

        <p
          className={
            "mt-3 flex-1 text-sm leading-relaxed text-muted " + (featured ? "" : "line-clamp-3")
          }
        >
          {post.excerpt}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] text-brass-300">
          Διαβάστε περισσότερα
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </article>
  );
}
