import PostCard from "@/components/PostCard";
import { getPostsByCategories } from "@/lib/wordpress";
import T from "@/components/i18n/T";

/**
 * Τα άρθρα του WordPress για μια υποσελίδα, με βάση τις κατηγορίες της
 * (πεδίο `wpCategories` στο src/content). Κάθε κάρτα ανοίγει το πλήρες
 * άρθρο στη σελίδα ανάγνωσης /nea/<slug>.
 * Server component: τα άρθρα έρχονται στο build και ανανεώνονται με ISR.
 */
export default async function CategoryFeed({ categories }: { categories: string[] }) {
  const posts = await getPostsByCategories(categories);
  // Χωρίς άρθρα η ενότητα απλώς δεν εμφανίζεται.
  if (!posts.length) return null;

  return (
    <section aria-labelledby="category-feed" className="mt-12">
      <h2 id="category-feed" className="font-display text-2xl font-semibold sm:text-3xl">
        <T v="Αναρτήσεις" />
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((post, i) => (
          <li key={post.id} className="h-full">
            <PostCard post={post} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
