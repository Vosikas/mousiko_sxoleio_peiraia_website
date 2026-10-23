"use client";

import { useEffect, useRef, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { useLanguage } from "@/hooks/useLanguage";
import { intlLocale } from "@/i18n/l10n";
import { songForDate, type Song } from "@/lib/song-table";
import { WidgetLabel } from "./ClockWidget";

/**
 * Κάρτα «Τραγούδι της ημέρας». Παίρνει ΟΛΗ τη λίστα και διαλέγει με την
 * ημερομηνία του επισκέπτη, ώστε να αλλάζει ακριβώς τα μεσάνυχτα
 * (κανόνες επιλογής: songForDate στο src/lib/song-table.ts).
 */
export default function SongCard({ songs }: { songs: Song[] }) {
  // Ανά λεπτό: αρκεί για να αλλάξει το τραγούδι τα μεσάνυχτα.
  const now = useNow(60_000);
  const { language, t } = useLanguage();

  if (!now) return <SongSkeleton />;
  const pick = songForDate(songs, now);
  if (!pick) return null;
  const { song, today } = pick;
  // Μέρα χωρίς τραγούδι (Σαββατοκύριακο, διακοπές): λέμε τίνος μέρας είναι.
  const dateLabel =
    !today && song.year
      ? new Intl.DateTimeFormat(intlLocale(language), { weekday: "long", day: "numeric", month: "long" }).format(
          new Date(song.year, song.month! - 1, song.day!),
        )
      : null;

  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Τραγούδι της ημέρας</WidgetLabel>

      {/* key: με νέο τραγούδι ο player ξεκινά από την αρχή. */}
      <Player key={song.url} song={song} />

      <div className="mt-4 text-center">
        {/* Ετήσια επέτειος (π.χ. 25/3 χωρίς χρονιά). */}
        {song.day !== undefined && song.year === undefined && (
          <p className="mb-2 inline-block rounded-full bg-plum-100 px-3 py-1 text-[0.56rem] font-medium uppercase tracking-[0.22em] text-plum-600">
            {t("Αφιέρωμα της ημέρας")}
          </p>
        )}
        <p className="font-display text-lg leading-snug text-cream">{song.title}</p>
        {song.artist && (
          <p className="mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-muted">{song.artist}</p>
        )}
        {dateLabel && <p className="mt-2 text-[0.66rem] text-muted first-letter:uppercase">{dateLabel}</p>}
      </div>

      {song.source !== "link" && (
        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-1.5 text-[0.6rem] uppercase tracking-[0.22em] text-plum-500 transition hover:text-plum-700"
        >
          {t(song.source === "youtube" ? "Άνοιγμα στο YouTube" : "Άνοιγμα στο Spotify")}
          <span aria-hidden>↗</span>
        </a>
      )}
    </article>
  );
}

/**
 * YouTube: παίζει μόλις ανοίξει η σελίδα (YouTubeAutoplay).
 *          Αν ο κάτοχος δεν επιτρέπει να παίζει σε άλλα sites: εικόνα που
 *          ανοίγει το βίντεο στο YouTube.
 * Spotify: ο player του Spotify (δεν επιτρέπει αυτόματη αναπαραγωγή).
 * Άλλο:    κουμπί που ανοίγει τον σύνδεσμο σε νέα καρτέλα.
 */
function Player({ song }: { song: Song }) {
  const { t } = useLanguage();

  if (song.source === "youtube" && !song.noEmbed) return <YouTubeAutoplay song={song} />;

  if (song.source === "youtube") {
    return (
      <div className="relative mt-5 aspect-video overflow-hidden rounded-xl bg-ink-900">
        <a
          href={song.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("Άνοιγμα στο YouTube")}: ${song.title}`}
          className="group absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${song.embedId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <PlayBadge />
        </a>
      </div>
    );
  }

  if (song.source === "spotify") {
    return (
      <iframe
        className="mt-5 block w-full rounded-xl"
        src={`https://open.spotify.com/embed/${song.embedId}?utm_source=generator`}
        height={152}
        title={song.title}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    );
  }

  return (
    <a
      href={song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-5 flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-plum-100 text-plum-600 transition hover:bg-plum-200"
    >
      <PlayBadge static />
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
        {t("Ακρόαση")} <span aria-hidden>↗</span>
      </span>
      <span className="text-[0.62rem] opacity-70">{hostOf(song.url)}</span>
    </a>
  );
}

const YOUTUBE = "https://www.youtube-nocookie.com";
type PlayerInfo = { playerState?: number; muted?: boolean; currentTime?: number };

/**
 * Το τραγούδι ξεκινά μόλις ανοίξει η σελίδα. Οι browsers επιτρέπουν ΗΧΟ
 * μόνο αν ο επισκέπτης έχει ήδη πατήσει κάτι στο site (π.χ. ήρθε στην αρχική
 * από το μενού)· αλλιώς ξεκινά χωρίς ήχο, με κουμπί «Ενεργοποίηση ήχου».
 * Με τον player μιλάμε με postMessage (enablejsapi), χωρίς το API script.
 */
function YouTubeAutoplay({ song }: { song: Song }) {
  const { t } = useLanguage();
  const frame = useRef<HTMLIFrameElement>(null);
  const time = useRef(0);
  const [withSound, setWithSound] = useState(
    () => (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive ?? false,
  );
  const [startAt, setStartAt] = useState(0);
  const [muted, setMuted] = useState(!withSound);

  useEffect(() => {
    const target = () => frame.current?.contentWindow;
    let heard = false;
    let state = -1;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YOUTUBE || event.source !== target()) return;
      let data: { info?: PlayerInfo };
      try {
        data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      heard = true;
      if (typeof data.info?.playerState === "number") state = data.info.playerState;
      if (typeof data.info?.muted === "boolean") setMuted(data.info.muted);
      if (typeof data.info?.currentTime === "number") time.current = data.info.currentTime;
    };
    window.addEventListener("message", onMessage);
    // «Ακούω»: ο player στέλνει από εκεί και πέρα την κατάστασή του.
    let tries = 0;
    const listen = window.setInterval(() => {
      if (heard || ++tries > 25) return window.clearInterval(listen);
      target()?.postMessage(JSON.stringify({ event: "listening", id: song.embedId, channel: "widget" }), YOUTUBE);
    }, 400);
    // Ο browser δεν άφησε να ξεκινήσει με ήχο → ξεκινά χωρίς ήχο. Μετράει
    // μόνο αν ο player «δεν ξεκίνησε καν» (-1) ή περιμένει πάτημα (5)· όσο
    // φορτώνει (3) περιμένουμε, για να μη σβήσουμε τον ήχο σε αργή σύνδεση.
    let waited = 0;
    const fallback = withSound
      ? window.setInterval(() => {
          waited += 1000;
          if (state === 1 || state === 2 || waited > 10_000) return window.clearInterval(fallback);
          if (waited >= 3000 && heard && (state === -1 || state === 5)) {
            window.clearInterval(fallback);
            youtubeCommand(target(), "mute");
            youtubeCommand(target(), "playVideo");
            setMuted(true);
          }
        }, 1000)
      : undefined;
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(listen);
      window.clearInterval(fallback);
    };
  }, [song.embedId, withSound]);

  // Το YouTube αγνοεί το «unMute» όταν το κλικ έγινε έξω από τον player. Μετά
  // από αυτό το κλικ όμως ο browser επιτρέπει ήχο: ξαναφορτώνουμε τον player
  // με ήχο, από το σημείο όπου είχε φτάσει.
  const unmute = () => {
    setStartAt(Math.floor(time.current));
    setWithSound(true);
    setMuted(false);
  };

  return (
    <div className="relative mt-5 aspect-video overflow-hidden rounded-xl bg-ink-900">
      <iframe
        // Νέο iframe (όχι απλή αλλαγή src) όταν ανοίγει ο ήχος: μόνο ένα
        // καινούργιο παίρνει από τον browser την άδεια για ήχο μετά το κλικ.
        key={String(withSound)}
        ref={frame}
        className="absolute inset-0 h-full w-full"
        src={
          `${YOUTUBE}/embed/${song.embedId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1` +
          `&origin=${encodeURIComponent(window.location.origin)}` +
          (withSound ? "" : "&mute=1") +
          (startAt ? `&start=${startAt}` : "")
        }
        title={song.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      {muted && (
        <button
          type="button"
          onClick={unmute}
          className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-plum-500 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-plum-600"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
            <path d="M3 9v6h4l5 4V5L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z" />
          </svg>
          {t("Ενεργοποίηση ήχου")}
        </button>
      )}
    </div>
  );
}

function youtubeCommand(player: Window | null | undefined, func: string, args: unknown[] = []) {
  player?.postMessage(JSON.stringify({ event: "command", func, args }), YOUTUBE);
}

function PlayBadge({ static: inFlow = false }: { static?: boolean }) {
  return (
    <span
      className={`${inFlow ? "" : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "}flex h-12 w-12 items-center justify-center rounded-full bg-plum-500 text-white shadow-lg transition duration-300 group-hover:scale-110`}
    >
      <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
        <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
      </svg>
    </span>
  );
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function SongSkeleton() {
  return (
    <article className="glass rounded-xl2 p-6">
      <WidgetLabel>Τραγούδι της ημέρας</WidgetLabel>
      <div className="mt-5 aspect-video animate-pulse rounded-xl bg-ink-850" />
      <div className="mx-auto mt-4 h-5 w-40 animate-pulse rounded bg-ink-850" />
      <div className="mx-auto mt-2 h-3 w-24 animate-pulse rounded bg-ink-850" />
    </article>
  );
}
