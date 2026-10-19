import { Suspense } from "react";

import Hero from "@/components/Hero";
import VideoFeature from "@/components/VideoFeature";
import PostsPool, { PostsPoolSkeleton } from "@/components/PostsPool";
import ClockWidget from "@/components/ClockWidget";
import CalendarWidget from "@/components/CalendarWidget";
import TodayWidget from "@/components/TodayWidget";
import SongOfTheDay from "@/components/SongOfTheDay";
import StickyRail from "@/components/StickyRail";
import { ContactCard, EnsemblesCard, Marquee } from "@/components/RailCards";
import Reveal from "@/components/Reveal";
import T from "@/components/i18n/T";
import { REVALIDATE_SECONDS } from "@/lib/wordpress";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee />

      {/* Τρίστηλη διάταξη: ρολόι αριστερά, περιεχόμενο στο κέντρο, ημερολόγιο δεξιά. */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,18rem)] lg:gap-10 xl:gap-14">
          {/* Αριστερή στήλη */}
          {/* Οι στήλες «κολλάνε» στο scroll μόνο όταν χωράνε στην οθόνη. */}
          <StickyRail className="order-2 space-y-6 lg:order-1 lg:h-fit">
            <Reveal>
              <ClockWidget />
            </Reveal>
            <Reveal delay={80}>
              <TodayWidget />
            </Reveal>
            <Reveal delay={160}>
              <EnsemblesCard />
            </Reveal>
          </StickyRail>

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
          <StickyRail className="order-3 space-y-6 lg:h-fit">
            <Reveal delay={80}>
              <CalendarWidget />
            </Reveal>
            {/* Από τη σελίδα «tragoudia» του WordPress — βλ. src/content/songs.ts */}
            <Suspense fallback={null}>
              <SongOfTheDay delay={130} />
            </Suspense>
            <Reveal delay={180}>
              <ContactCard />
            </Reveal>
          </StickyRail>
        </div>

        <p className="mt-20 text-center text-[0.6rem] uppercase tracking-[0.25em] text-muted/40">
          <T v="Το περιεχόμενο ανανεώνεται από το WordPress κάθε {n} λεπτά" vars={{ n: REVALIDATE_SECONDS / 60 }} />
        </p>
      </div>
    </>
  );
}
