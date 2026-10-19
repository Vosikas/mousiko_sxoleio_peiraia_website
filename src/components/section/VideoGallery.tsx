"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { VideoGroup } from "@/lib/wordpress";

/**
 * Τα βίντεο του παλιού site σε ομάδες (π.χ. ανά μουσικό σύνολο): κάθε ομάδα
 * ένα γκρι κουτί με δικό της `id`, ώστε να ανοίγει απευθείας με #.
 * Το YouTube φορτώνει μόνο όταν πατηθεί το ▶ — καμία σύνδεση πριν από αυτό.
 */
export default function VideoGallery({ groups }: { groups: VideoGroup[] }) {
  const { l } = useLanguage();

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id} id={group.id} className="surface-box scroll-mt-28 p-7 sm:p-10">
          <h2 className="mb-6 font-display text-xl font-semibold sm:text-2xl surface-box-accent">{l(group.title)}</h2>
          <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {group.items.map((item) => (
              <li key={item.title + item.videos[0]}>
                <VideoCard title={item.title} videos={item.videos} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function VideoCard({ title, videos }: { title: string; videos: string[] }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const id = videos[current];

  return (
    <article>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-900">
        {playing ? (
          <iframe
            key={id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t("Αναπαραγωγή: {title}", { title })}
            className="group absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-plum-500 text-white shadow-lg transition duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
                <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <h3 className="mt-3 text-[0.95rem] font-semibold leading-snug">{title}</h3>

      {/* Πολλά βίντεο από την ίδια εκδήλωση: 1 · 2 · 3 … */}
      {videos.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={t("Βίντεο")}>
          {videos.map((video, i) => (
            <button
              key={video}
              type="button"
              aria-pressed={i === current}
              aria-label={t("Βίντεο {n} από {total}", { n: i + 1, total: videos.length })}
              onClick={() => {
                setCurrent(i);
                setPlaying(true);
              }}
              className={
                "h-7 min-w-7 rounded-full px-2 text-xs font-semibold tabular-nums transition " +
                (i === current ? "bg-plum-500 text-white" : "bg-white text-plum-600 hover:bg-plum-100")
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
