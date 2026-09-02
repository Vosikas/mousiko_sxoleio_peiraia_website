"use client";

/**
 * Πολύ ελαφρύς συνθέτης πιάνου με Web Audio API.
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

/** Μικρό αρπέζ — παίζεται όταν ολοκληρώνεται η φόρτωση. */
export function playFlourish() {
  const chord = [261.63, 329.63, 392.0, 523.25, 659.25];
  chord.forEach((f, i) => {
    setTimeout(() => playNote(f, 2.2), i * 90);
  });
}
