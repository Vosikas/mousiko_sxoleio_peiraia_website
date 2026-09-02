import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import { getRecentPosts } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Νέα & Ανακοινώσεις",
  description: "Όλες οι ανακοινώσεις, οι εκδηλώσεις και οι διακρίσεις του Μουσικού Σχολείου Πειραιά.",
};

export default async function NewsPage() {
  const posts = await getRecentPosts(12);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-40 lg:px-10">
      <Reveal>
        <p className="text-[0.62rem] uppercase tracking-[0.34em] text-brass-400">Ενημέρωση</p>
        <h1 className="mt-4 font-display text-5xl text-cream sm:text-6xl">Νέα &amp; Ανακοινώσεις</h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
          Ό,τι συμβαίνει στο σχολείο: συναυλίες, διακρίσεις, προγράμματα και ανακοινώσεις της
          διεύθυνσης.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 70} className="h-full">
            <PostCard post={post} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
