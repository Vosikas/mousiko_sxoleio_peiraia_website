"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { markIntroSeen, revealPage, useIntroSeen } from "@/hooks/useIntro";
import {
  BEAT,
  INTRO_DURATION,
  PANEL_BEATS,
  PANEL_COUNT,
  playBandIntro,
  type BandIntro,
} from "@/lib/audio";
import { PANELS, PlayerBack, StageDefs, WideShot } from "./BandStage";

/**
 * A 10s POV walk across the stage: the camera passes drums, bass, guitar,
 * piano and voice, each entering the riff as it comes into frame, then pulls
 * back on the full band. Skippable at any time.
 */

const SEGMENT = BEAT * PANEL_BEATS; // seconds per musician
const TRANSITION_DURATION = 1.6;
const RING = 2 * Math.PI * 13;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** stable pseudo-random, so server and client render the same crowd */
const seeded = (i: number) => {
  const value = Math.sin(i * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

type Props = { schoolName?: string; tagline?: string };

export default function LoadingScreen({
  schoolName = "Μουσικό Σχολείο Πειραιά",
  tagline = "Εδώ αρχίζει η μπάντα σου",
}: Props) {
  const hidden = useIntroSeen();
  const [leaving, setLeaving] = useState(false);
  const [panel, setPanel] = useState(0);
  const [sound, setSound] = useState<"on" | "off" | "blocked">("on");

  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<BandIntro | null>(null);
  const startedRef = useRef(0);
  const leavingRef = useRef(false);
  const endingRef = useRef(false);
  const soundRef = useRef(sound);

  const crowd = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        left: (i / 44) * 900 + seeded(i) * 12,
        size: 34 + seeded(i + 90) * 30,
        lift: seeded(i + 40) * 26,
        delay: seeded(i + 7) * 0.94,
        torch: seeded(i + 300) > 0.86,
      })),
    [],
  );

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    audioRef.current?.stop();
    setLeaving(true);
    revealPage();
    window.setTimeout(markIntroSeen, 620);
  }, []);

  const enableSound = useCallback(() => {
    if (soundRef.current === "on") return;
    const intro = audioRef.current ?? playBandIntro();
    audioRef.current = intro;
    const elapsed = (performance.now() - startedRef.current) / 1000;
    void intro.unlock(elapsed).then((ok) => {
      soundRef.current = ok ? "on" : "off";
      setSound(ok ? "on" : "off");
    });
  }, []);

  useEffect(() => {
    if (hidden) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";

    const intro = playBandIntro();
    audioRef.current = intro;
    soundRef.current = intro.blocked ? "blocked" : "on";
    setSound(intro.blocked ? "blocked" : "on");

    startedRef.current = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = (now - startedRef.current) / 1000;
      const progress = clamp01(t / INTRO_DURATION);
      const transitionProgress = clamp01((t - (INTRO_DURATION - TRANSITION_DURATION)) / TRANSITION_DURATION);

      // camera: settles on a musician, then swings to the next on the beat
      const u = Math.min(PANEL_COUNT - 1, t / SEGMENT);
      const index = Math.floor(u);
      const local = u - index;
      const travel = easeInOut(clamp01((local - 0.3) / 0.7));
      const position = Math.min(PANEL_COUNT - 1, index + travel);

      // kick-driven punch, alternating strong / weak beats
      const beats = t / BEAT;
      const pulse = Math.exp(-(beats - Math.floor(beats)) * 9) * (Math.floor(beats) % 2 ? 0.45 : 1);

      const finale = index >= PANEL_COUNT - 1 ? easeInOut(clamp01(local / 0.8)) : 0;
      const zoom = 1 + 0.035 * Math.sin(local * Math.PI) - 0.12 * finale + pulse * 0.012;
      const shakeX = reduced ? 0 : Math.sin(t * 3.1) * 4 + Math.sin(t * 7.7) * 1.5;
      const shakeY = reduced ? 0 : Math.cos(t * 2.3) * 3 + Math.sin(t * 9.1) * 1.1;
      const roll = reduced ? 0 : Math.sin(t * 1.7) * 0.32;

      if (cameraRef.current) {
        cameraRef.current.style.transform =
          `translate3d(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px, 0) rotate(${roll.toFixed(3)}deg) scale(${zoom.toFixed(4)})`;
      }
      if (bandRef.current) bandRef.current.style.transform = `translate3d(${-position * 100}vw, 0, 0)`;
      if (backRef.current) backRef.current.style.transform = `translate3d(${-position * 34}vw, 0, 0)`;
      if (frontRef.current) frontRef.current.style.transform = `translate3d(${-position * 138}vw, 0, 0)`;
      rootRef.current?.style.setProperty("--pulse", pulse.toFixed(3));
      rootRef.current?.style.setProperty("--transition-progress", transitionProgress.toFixed(3));

      if (transitionProgress > 0 && !endingRef.current) {
        endingRef.current = true;
        revealPage();
      }

      if (meterRef.current) {
        const fills = meterRef.current.children;
        for (let i = 0; i < fills.length; i += 1) {
          const fill = fills[i].firstElementChild as HTMLElement | null;
          if (fill) fill.style.transform = `scaleX(${clamp01(progress * PANEL_COUNT - i)})`;
        }
      }
      if (ringRef.current) ringRef.current.style.strokeDashoffset = `${RING * progress}`;

      setPanel((current) => (current === Math.round(position) ? current : Math.round(position)));
      if (t < INTRO_DURATION) frame = requestAnimationFrame(tick);
      else dismiss();
    });

    const onKey = (event: KeyboardEvent) => {
      if (soundRef.current === "blocked") enableSound();
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      intro.stop();
      document.body.style.overflow = "";
    };
  }, [hidden, dismiss, enableSound]);

  if (hidden) return null;

  const active = PANELS[Math.min(panel, PANELS.length - 1)];
  const onFinale = panel >= PANELS.length;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Εισαγωγή: μια μπάντα στη σκηνή"
      onPointerDown={(event) => {
        if (sound === "blocked") enableSound();
      }}
      className={"intro-stage fixed inset-0 z-[100] overflow-hidden bg-[#04080f] transition-[opacity,transform,filter] duration-[620ms] ease-[cubic-bezier(0.7,0,0.2,1)] " + (leaving ? "is-leaving pointer-events-none scale-[1.06] opacity-0 blur-[2px]" : "")}
    >
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />
      <StageDefs />

      <div ref={cameraRef} className="absolute inset-0 will-change-transform">
        {/* --- lights and back wall, panning slowly --- */}
        <div ref={backRef} className="absolute inset-0 flex w-[600vw] will-change-transform">
          {Array.from({ length: PANEL_COUNT }, (_, i) => (
            <div key={i} className="relative h-full w-screen shrink-0">
              <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#0b1826,#16324f,#0b1826)]" />
              {[22, 58, 84].map((x, j) => (
                <div
                  key={x}
                  className="beam"
                  style={{
                    left: `${x}%`,
                    animationDelay: `${(i + j) * 0.62}s`,
                    background:
                      (i + j) % 2
                        ? "linear-gradient(to bottom, rgba(53,183,174,0.5), rgba(53,183,174,0))"
                        : "linear-gradient(to bottom, rgba(244,185,66,0.42), rgba(244,185,66,0))",
                  }}
                />
              ))}
              <div
                className="absolute left-1/2 top-[8%] h-[52vh] w-[70vw] -translate-x-1/2 rounded-full opacity-[calc(0.35+var(--pulse,0)*0.5)] blur-3xl"
                style={{ background: i % 2 ? "radial-gradient(circle,rgba(53,183,174,0.34),transparent 68%)" : "radial-gradient(circle,rgba(244,185,66,0.26),transparent 68%)" }}
              />
            </div>
          ))}
        </div>

        {/* --- the band --- */}
        <div ref={bandRef} className="absolute inset-0 flex w-[600vw] will-change-transform">
          {PANELS.map((item) => (
            <section key={item.id} className="relative flex h-full w-screen shrink-0 items-end justify-center">
              <div
                className="absolute bottom-[16vh] left-1/2 h-[46vh] w-[46vh] -translate-x-1/2 rounded-full blur-[70px]"
                style={{
                  background:
                    item.accent === "teal"
                      ? "radial-gradient(circle,rgba(53,183,174,0.42),transparent 70%)"
                      : "radial-gradient(circle,rgba(244,185,66,0.34),transparent 70%)",
                  opacity: "calc(0.6 + var(--pulse,0) * 0.4)",
                }}
              />
              {item.player ? (
                <div
                  className={
                    "absolute bottom-0 h-[52vh] max-h-[520px] opacity-90 blur-[1px] " +
                    (item.player === "left" ? "left-[6vw]" : "right-[6vw]")
                  }
                >
                  <PlayerBack flip={item.player === "right"} />
                </div>
              ) : null}

              <div className="relative bottom-[14vh] h-[42vh] max-h-[440px] sm:h-[50vh]">
                <div className="h-full">{item.art}</div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-full h-full origin-top -scale-y-100 opacity-25 blur-[3px] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent_62%)] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent_62%)]"
                >
                  {item.art}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-[linear-gradient(to_top,#04080f_28%,rgba(4,8,15,0))]" />
            </section>
          ))}
          <section className="relative flex h-full w-screen shrink-0 items-end justify-center">
            <WideShot />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] bg-[linear-gradient(to_top,#04080f_30%,rgba(4,8,15,0))]" />
          </section>
        </div>

        {/* --- crowd, passing fast in the foreground --- */}
        <div ref={frontRef} className="absolute inset-0 w-[900vw] will-change-transform">
          {crowd.map((person, i) => (
            <div
              key={i}
              className="crowd-head absolute bottom-0"
              style={{
                left: `${person.left}vw`,
                width: `${person.size}px`,
                height: `${person.size * 1.5 + person.lift}px`,
                animationDelay: `${person.delay}s`,
              }}
            >
              <div className="h-full w-full rounded-t-[999px] bg-[#02060c]" />
              {person.torch ? <span className="torch" /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* --- atmosphere --- */}
      <div aria-hidden className="haze pointer-events-none absolute inset-0" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 mix-blend-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(2,5,10,0.86))]" />
      {/* --- lower third --- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[9vh] px-6 sm:px-12">
        {onFinale ? (
          <div key="finale" className="caption text-center">
            <h1 className="font-display text-[clamp(1.9rem,7vw,3.6rem)] font-semibold leading-tight text-[#f7f3e9]">
              {schoolName}
            </h1>
            <p className="mt-2 text-sm text-[#9fb6c9]">{tagline}</p>
          </div>
        ) : (
          <div key={active.id} className="caption max-w-md">
            <div className="flex items-baseline gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: active.accent === "teal" ? "#35b7ae" : "#f4b942" }}
              />
              <h2 className="font-display text-[clamp(1.6rem,5.5vw,2.6rem)] font-semibold leading-none text-[#f7f3e9]">
                {active.name}
              </h2>
            </div>
            <p className="mt-2 pl-6 text-sm text-[#9fb6c9]">{active.line}</p>
          </div>
        )}
      </div>

      {/* --- controls --- */}
      <div className="absolute inset-x-0 bottom-[3.4vh] flex items-center justify-between gap-4 px-6 sm:px-12">
        <div ref={meterRef} className="flex flex-1 gap-1.5" aria-hidden>
          {Array.from({ length: PANEL_COUNT }, (_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,#0e938c,#35b7ae,#f4b942)]" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="group flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-2 pl-2 pr-4 text-sm text-[#f7f3e9] backdrop-blur-sm transition hover:border-[#35b7ae] hover:bg-[#35b7ae]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#35b7ae]"
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7 -rotate-90" aria-hidden>
            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="#35b7ae"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={0}
            />
          </svg>
          Παράλειψη
        </button>
      </div>

      <button
        type="button"
        onClick={
          sound === "on"
            ? () => {
                audioRef.current?.stop();
                audioRef.current = null;
                soundRef.current = "off";
                setSound("off");
              }
            : enableSound
        }
        aria-label={sound === "on" ? "Σίγαση ήχου" : "Ενεργοποίηση ήχου"}
        className={
          "absolute right-6 top-6 flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs text-[#f7f3e9] backdrop-blur-sm transition sm:right-12 " +
          (sound === "on"
            ? "border-white/15 bg-white/[0.06] hover:border-white/35"
            : "border-[#f4b942]/45 bg-[#f4b942]/10 hover:bg-[#f4b942]/18")
        }
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          {sound === "on" ? <path d="M17 8.5a5 5 0 0 1 0 7" /> : <path d="M17 9l4 6M21 9l-4 6" />}
        </svg>
        {sound === "on" ? "Ήχος" : "Άκου την μπάντα"}
      </button>
    </div>
  );
}

const STAGE_CSS = `
.intro-stage { --pulse: 0; }
.intro-stage:not(.is-leaving)[style] { opacity: calc(1 - var(--transition-progress, 0) * 0.92); transform: scale(calc(1 + var(--transition-progress, 0) * 0.035)); }
.intro-stage .beam {
  position: absolute; top: 0; width: 16vw; height: 78vh; filter: blur(28px);
  clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
  mix-blend-mode: screen; transform-origin: 50% 0;
  opacity: calc(0.5 + var(--pulse) * 0.5);
  animation: beam-swing 3.75s ease-in-out infinite alternate;
}
.intro-stage .haze {
  background:
    radial-gradient(60% 40% at 30% 62%, rgba(120,190,220,0.10), transparent 70%),
    radial-gradient(50% 36% at 72% 55%, rgba(244,185,66,0.07), transparent 70%);
  animation: haze-drift 13s ease-in-out infinite alternate;
}
.intro-stage .grain {
  opacity: 0.16;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.55'/></svg>");
  animation: grain-jitter 0.55s steps(3) infinite;
}
.intro-stage .crowd-head { animation: crowd-bob 0.9375s ease-in-out infinite; }
.intro-stage .torch {
  position: absolute; top: -10px; left: 50%; width: 7px; height: 7px; border-radius: 999px;
  background: #ffe9bd; box-shadow: 0 0 14px 5px rgba(255,233,189,0.55);
}
.intro-stage .caption { animation: caption-in 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
.intro-stage .cymbal { animation: cymbal-sway 0.9375s ease-out infinite; }
.intro-stage .cymbal-late { animation-delay: 0.46875s; }
.intro-stage .kick { animation: kick-thump 0.9375s ease-out infinite; }
.intro-stage .sticks { animation: stick-hit 0.46875s ease-in-out infinite; }
.intro-stage .strings { animation: string-buzz 0.09s linear infinite; }
.intro-stage .key-press { animation: key-press 0.9375s ease-out infinite; }
.intro-stage .singer { animation: singer-lift 1.875s ease-in-out infinite; }

@keyframes beam-swing { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
@keyframes haze-drift { from { transform: translate3d(0,0,0); } to { transform: translate3d(-7%, 2%, 0); } }
@keyframes grain-jitter {
  0% { transform: translate3d(0,0,0); } 33% { transform: translate3d(-6px,4px,0); }
  66% { transform: translate3d(5px,-5px,0); } 100% { transform: translate3d(0,0,0); }
}
@keyframes crowd-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes caption-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes cymbal-sway { 0% { transform: rotate(0deg); } 18% { transform: rotate(-2.6deg); } 100% { transform: rotate(0deg); } }
@keyframes kick-thump { 0% { transform: scale(1); } 12% { transform: scale(1.035); } 100% { transform: scale(1); } }
@keyframes stick-hit { 0% { transform: translateY(0) rotate(0deg); } 30% { transform: translateY(12px) rotate(7deg); } 100% { transform: translateY(0) rotate(0deg); } }
@keyframes string-buzz { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(0.9px); } }
@keyframes key-press { 0% { transform: translateY(0); } 14% { transform: translateY(4px); } 100% { transform: translateY(0); } }
@keyframes singer-lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

@media (prefers-reduced-motion: reduce) {
  .intro-stage .beam, .intro-stage .haze, .intro-stage .grain,
  .intro-stage .crowd-head, .intro-stage .cymbal, .intro-stage .kick, .intro-stage .sticks,
  .intro-stage .strings, .intro-stage .key-press, .intro-stage .singer { animation: none !important; }
  .intro-stage .caption { animation-duration: 1ms; }
}
`;
