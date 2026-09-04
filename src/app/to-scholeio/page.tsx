import ComingSoon from "@/components/ComingSoon";
import { getPageBySlug } from "@/lib/wordpress";

export const revalidate = 300;
export const metadata = { title: "Το Σχολείο — Μουσικό Σχολείο Πειραιά" };

export default async function Page() {
  const page = await getPageBySlug("το-σχολείο");

  if (page) {
    return (
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-36 lg:px-10">
        <header className="max-w-3xl">
          <p className="text-[0.62rem] uppercase tracking-[0.35em] text-brass-400">Ταυτότητα</p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-cream sm:text-7xl">{page.title}</h1>
        </header>
        <div
          className="prose-article mt-12 max-w-4xl space-y-5 text-[0.98rem] leading-[1.85] text-cream/80"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </main>
    );
  }

  return (
    <ComingSoon
      eyebrow="Ταυτότητα"
      title="Το Σχολείο"
      text="Ιστορία, όραμα, εγκαταστάσεις και ο σύλλογος διδασκόντων του Μουσικού Σχολείου Πειραιά."
    />
  );
}
