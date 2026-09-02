"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Πρότυπο (template) για το βίντεο του σχολείου.
 *
 * Δέχεται είτε YouTube ID είτε αρχείο mp4. Όσο δεν έχει οριστεί κανένα,
 * δείχνει καλαίσθητο placeholder με οδηγίες — το layout δεν «σπάει» ποτέ.
 */
export default function VideoFeature() {
  const [playing, setPlaying] = useState(false);
  const { youtubeId, mp4, title, subtitle } = site.video;
  const poster = process.env.NEXT_PUBLIC_SCHOOL_VIDEO_POSTER ?? "";

  const thumb =
    poster || (youtubeId ? "https://i.ytimg.com/vi/" + youtubeId + "/maxresdefault.jpg" : "");

  return (
    <section aria-labelledby="video-title" className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-brass-400">
            Βίντεο παρουσίασης
          </p>
          <h2 id="video-title" className="mt-3 font-display text-3xl text-cream sm:text-4xl">
            {title}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{subtitle}</p>
      </div>

      {/* Κορνίζα */}
      <div className="group relative mt-8">
        <div className="pointer-events-none absolute -inset-px rounded-xl2 bg-gradient-to-br from-brass-400/50 via-transparent to-brass-500/30 opacity-70 blur-[1px] transition group-hover:opacity-100" />

        <div className="relative aspect-video w-full overflow-hidden rounded-xl2 bg-ink-900 ring-1 ring-cream/10">
          {playing && youtubeId ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={
                "https://www.youtube-nocookie.com/embed/" +
                youtubeId +
                "?autoplay=1&rel=0&modestbranding=1&hl=el"
              }
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : playing && mp4 ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={mp4} controls autoPlay playsInline />
          ) : (
            <>
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-85"
                />
              ) : (
                <PlaceholderStage />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />

              {(youtubeId || mp4) && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={"Αναπαραγωγή: " + title}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-brass-300/70 bg-ink-950/55 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-brass-400/20 sm:h-24 sm:w-24">
                    <span className="absolute inset-0 rounded-full border border-brass-300/60 animate-pulse-ring" />
                    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-brass-100">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                    </svg>
                  </span>
                </button>
              )}

              {/* Λεζάντα κάτω αριστερά */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-brass-300">
                    {site.shortName} · Φιλμ
                  </p>
                  <p className="mt-1.5 font-display text-lg text-cream sm:text-xl">{title}</p>
                </div>
                <Equalizer />
              </div>
            </>
          )}

          {/* Γωνίες κορνίζας */}
          {(["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "left-4 bottom-4 border-l border-b", "right-4 bottom-4 border-r border-b"] as const).map(
            (pos) => (
              <span
                key={pos}
                className={"pointer-events-none absolute h-5 w-5 border-brass-300/40 " + pos}
              />
            ),
          )}
        </div>
      </div>

      {!youtubeId && !mp4 && (
        <p className="mt-4 text-center text-[0.68rem] uppercase tracking-[0.2em] text-muted/60">
          Ορίστε <code className="text-brass-300">NEXT_PUBLIC_SCHOOL_VIDEO_ID</code> στο{" "}
          <code className="text-brass-300">.env.local</code> για να μπει το βίντεο του σχολείου
        </p>
      )}
    </section>
  );
}

/** Διακοσμητικό «σκηνικό» όσο λείπει το βίντεο. */
function PlaceholderStage() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(208,169,95,0.14),transparent_65%)]">
      <div className="absolute inset-0 opacity-40">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute inset-x-0 h-px bg-brass-400/30"
            style={{ top: "calc(50% + " + (i - 2) * 14 + "px)" }}
          />
        ))}
      </div>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[7rem] text-brass-400/25 sm:text-[10rem]">
        𝄞
      </span>
      {["♪", "♫", "♩"].map((g, i) => (
        <span
          key={g}
          className="absolute text-3xl text-brass-300/30 animate-float"
          style={{
            left: 18 + i * 28 + "%",
            top: 26 + ((i * 17) % 34) + "%",
            animationDelay: i * 1.3 + "s",
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

function Equalizer() {
  const bars = [0.5, 0.9, 0.35, 0.75, 0.55, 1, 0.4];
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-brass-300/70"
          style={{
            height: h * 100 + "%",
            animation: "float " + (1.1 + i * 0.17) + "s ease-in-out infinite alternate",
            animationDelay: i * 0.11 + "s",
          }}
        />
      ))}
    </div>
  );
}
