"use client";

/**
 * Πολύ ελαφρύς συνθέτης ορχήστρας με Web Audio API.
 * Δεν φορτώνει δείγματα ήχου — μηδενικό κόστος στο bundle.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Παίζει μία νότα με απαλή «σφυράκι» επίθεση και φυσικό σβήσιμο. */
export function playNote(frequency: number, duration = 1.6) {
  const audio = getContext();
  if (!audio || !master) return;

  const now = audio.currentTime;
  const voice = audio.createGain();
  voice.connect(master);

  // Δύο ταλαντωτές: θεμελιώδης + οκτάβα, για πιο «ξύλινο» χρώμα.
  const partials: Array<[OscillatorType, number, number]> = [
    ["triangle", 1, 0.6],
    ["sine", 2, 0.22],
    ["sine", 3.01, 0.08],
  ];

  for (const [type, ratio, gain] of partials) {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = type;
    osc.frequency.value = frequency * ratio;
    g.gain.value = gain;
    osc.connect(g).connect(voice);
    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(0.9, now + 0.012);
  voice.gain.exponentialRampToValueAtTime(0.25, now + 0.22);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + duration);
}

function playVoice(frequency: number, duration: number, type: OscillatorType, volume: number) {
  const audio = getContext();
  if (!audio || !master) return;

  const now = audio.currentTime;
  const voice = audio.createGain();
  const oscillator = audio.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  oscillator.connect(voice).connect(master);
  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(volume, now + 0.025);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.05);
}

/** Μικρή αυτόματη εισαγωγή με διαφορετικό ηχόχρωμα για κάθε ομάδα. */
export function playBandIntro() {
  const arrangement = [
    { notes: [196, 246.94], type: "sine" as OscillatorType, duration: 1.9, volume: 0.12 },
    { notes: [261.63, 329.63, 392], type: "triangle" as OscillatorType, duration: 1.5, volume: 0.16 },
    { notes: [392, 493.88, 587.33], type: "sawtooth" as OscillatorType, duration: 1.2, volume: 0.07 },
    { notes: [261.63, 329.63, 392, 523.25], type: "square" as OscillatorType, duration: 0.9, volume: 0.045 },
  ];

  arrangement.forEach((part, partIndex) => {
    part.notes.forEach((frequency, noteIndex) => {
      setTimeout(() => playVoice(frequency, part.duration, part.type, part.volume), partIndex * 480 + noteIndex * 55);
    });
  });
}
