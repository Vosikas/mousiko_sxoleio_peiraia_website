import { PAGES, type PageSlug } from "@/content";
import Blocks from "./Blocks";
import CategoryFeed from "./CategoryFeed";
import PageIntro from "./PageIntro";

/**
 * Template αυτόνομης σελίδας (π.χ. /erasmus): ίδια κεφαλίδα, ίδια γκρι
 * κουτιά και ίδια ροή άρθρων με τις υποσελίδες — χωρίς πλαϊνό μενού,
 * αφού δεν έχει αδελφές σελίδες.
 */
export default function StandalonePageTemplate({ page: slug }: { page: PageSlug }) {
  const page = PAGES[slug];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <PageIntro eyebrow={page.eyebrow} title={page.title} lead={page.summary} />

      <div className="mt-14">
        <Blocks blocks={page.blocks} />
        {page.wpCategories?.length ? <CategoryFeed categories={page.wpCategories} /> : null}
      </div>
    </div>
  );
}
