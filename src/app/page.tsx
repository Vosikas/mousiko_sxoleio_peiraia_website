import { Suspense } from "react";

import Hero from "@/components/Hero";
import VideoFeature from "@/components/VideoFeature";
import PostsPool, { PostsPoolSkeleton } from "@/components/PostsPool";
import ClockWidget from "@/components/ClockWidget";
import CalendarWidget from "@/components/CalendarWidget";
import { ContactCard, EnsemblesCard, Marquee } from "@/components/RailCards";
import Reveal from "@/components/Reveal";
import { REVALIDATE_SECONDS } from "@/lib/wordpress";

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="watermark-host">
      {/* 🎨 ΥΔΑΤΟΓΡΑΦΗΜΑ — το λογότυπο του σχολείου πίσω από όλη τη σελίδα.
          Μένει «κολλημένο» στο κέντρο της οθόνης καθώς κυλάει η σελίδα.
          ΔΙΑΦΑΝΕΙΑ / ΜΕΓΕΘΟΣ / ΘΕΣΗ: src/app/globals.css → --watermark-*
          (--watermark-opacity είναι το 40% που ζητήθηκε). */}
      <div aria-hidden className="watermark-layer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/LOGO%20AXNO%202.svg" alt="" className="watermark-mark" />
      </div>

      <Hero />

      <Marquee />

      {/* Τρίστηλη διάταξη: ρολόι αριστερά, περιεχόμενο στο κέντρο, ημερολόγιο δεξιά. */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,18rem)] lg:gap-10 xl:gap-14">
          {/* Αριστερή στήλη */}
          <aside className="order-2 space-y-6 lg:order-1 lg:sticky lg:top-28 lg:h-fit">
            <Reveal>
              <ClockWidget />
            </Reveal>
            <Reveal delay={120}>
              <EnsemblesCard />
            </Reveal>
          </aside>

          {/* Κέντρο */}
          <div className="order-1 space-y-24 lg:order-2 lg:space-y-32">
            <section id="video" className="scroll-mt-28">
              <Reveal>
                <VideoFeature />
              </Reveal>
            </section>

            <Suspense fallback={<PostsPoolSkeleton />}>
              <PostsPool />
            </Suspense>
          </div>

          {/* Δεξιά στήλη */}
          <aside className="order-3 space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <Reveal delay={80}>
              <CalendarWidget />
            </Reveal>
            <Reveal delay={180}>
              <ContactCard />
            </Reveal>
          </aside>
        </div>

        <p className="mt-20 text-center text-[0.6rem] uppercase tracking-[0.25em] text-muted/40">
          Το περιεχόμενο ανανεώνεται από το WordPress κάθε {REVALIDATE_SECONDS / 60} λεπτά
        </p>
      </div>
    </div>
  );
}
