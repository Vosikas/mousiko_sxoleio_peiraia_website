/**
 * Band intro — a 10s stage riff synthesised with the Web Audio API.
 * No audio files: everything is generated, so the intro adds 0 kB to the bundle.
 *
 * Musicians enter one at a time, in sync with the camera move in LoadingScreen:
 *   beat 0  drums     beat 2  bass      beat 4  guitar
 *   beat 6  piano     beat 8  voice     beat 10 full band, landing on Dm
 */

const BPM = 128;

export const BEAT = 60 / BPM; //  0.46875s
export const PANEL_BEATS = 2; //  each musician gets two beats
export const PANEL_COUNT = 6; //  5 musicians + the wide shot
export const INTRO_DURATION = 10;

const SEMITONES: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

/** "F#3" -> frequency in Hz */
function hz(note: string): number {
  const match = /^([A-G]#?)(-?\d+)$/.exec(note);
  if (!match) return 440;
  const midi = 12 * (Number(match[2]) + 1) + SEMITONES[match[1]];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

type Bus = {
  ctx: AudioContext;
  master: GainNode;
  dry: GainNode;
  wet: GainNode;
  noise: AudioBuffer;
};

function makeNoise(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Small hall: gives the synth voices a believable stage ambience. */
function makeReverb(ctx: AudioContext): ConvolverNode {
  const length = Math.floor(ctx.sampleRate * 2.2);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const decay = Math.pow(1 - i / length, 2.6);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

function buildBus(ctx: AudioContext): Bus {
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 22;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.22;

  const master = ctx.createGain();
  master.gain.value = 0.85;

  const dry = ctx.createGain();
  const wet = ctx.createGain();
  wet.gain.value = 0.34;

  const reverb = makeReverb(ctx);
  dry.connect(compressor);
  wet.connect(reverb).connect(compressor);
  compressor.connect(master).connect(ctx.destination);

  return { ctx, master, dry, wet, noise: makeNoise(ctx) };
}

function noiseSource(bus: Bus, at: number, duration: number): AudioBufferSourceNode {
  const source = bus.ctx.createBufferSource();
  source.buffer = bus.noise;
  source.playbackRate.value = 1;
  source.start(at, Math.random(), duration);
  return source;
}

/* --- instruments ------------------------------------------------------- */

function kick(bus: Bus, at: number, level = 1) {
  const osc = bus.ctx.createOscillator();
  const gain = bus.ctx.createGain();
  osc.frequency.setValueAtTime(155, at);
  osc.frequency.exponentialRampToValueAtTime(46, at + 0.11);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.95 * level, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.34);
  osc.connect(gain).connect(bus.dry);
  osc.start(at);
  osc.stop(at + 0.4);
}

function snare(bus: Bus, at: number, level = 1) {
  const filter = bus.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1750;
  filter.Q.value = 0.7;

  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.55 * level, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
  noiseSource(bus, at, 0.25).connect(filter).connect(gain);
  gain.connect(bus.dry);
  gain.connect(bus.wet);

  const body = bus.ctx.createOscillator();
  const bodyGain = bus.ctx.createGain();
  body.type = "triangle";
  body.frequency.setValueAtTime(196, at);
  body.frequency.exponentialRampToValueAtTime(132, at + 0.1);
  bodyGain.gain.setValueAtTime(0.3 * level, at);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.14);
  body.connect(bodyGain).connect(bus.dry);
  body.start(at);
  body.stop(at + 0.2);
}

function hat(bus: Bus, at: number, open = false, level = 1) {
  const filter = bus.ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7600;
  const gain = bus.ctx.createGain();
  const decay = open ? 0.26 : 0.05;
  gain.gain.setValueAtTime(0.24 * level, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  noiseSource(bus, at, decay + 0.05).connect(filter).connect(gain).connect(bus.dry);
}

function crash(bus: Bus, at: number, level = 1) {
  const filter = bus.ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(3200, at);
  filter.frequency.exponentialRampToValueAtTime(1100, at + 1.4);
  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.001, at);
  gain.gain.linearRampToValueAtTime(0.36 * level, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);
  noiseSource(bus, at, 2).connect(filter).connect(gain);
  gain.connect(bus.dry);
  gain.connect(bus.wet);
}

function bassNote(bus: Bus, at: number, note: string, duration: number) {
  const frequency = hz(note);
  const filter = bus.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(900, at);
  filter.frequency.exponentialRampToValueAtTime(240, at + Math.min(0.3, duration));

  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.5, at + 0.012);
  gain.gain.setTargetAtTime(0.0001, at + duration * 0.7, 0.08);

  const saw = bus.ctx.createOscillator();
  saw.type = "sawtooth";
  saw.frequency.value = frequency;
  const sub = bus.ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.value = frequency / 2;
  const subGain = bus.ctx.createGain();
  subGain.gain.value = 0.5;

  saw.connect(filter);
  sub.connect(subGain).connect(filter);
  filter.connect(gain).connect(bus.dry);
  saw.start(at); sub.start(at);
  saw.stop(at + duration + 0.3); sub.stop(at + duration + 0.3);
}

function drive(ctx: AudioContext, amount = 22): WaveShaperNode {
  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(1024);
  for (let i = 0; i < 1024; i += 1) {
    const x = (i / 1023) * 2 - 1;
    curve[i] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
  }
  shaper.curve = curve;
  shaper.oversample = "2x";
  return shaper;
}

function guitarChord(bus: Bus, at: number, notes: string[], duration: number) {
  const shaper = drive(bus.ctx, 16);
  const filter = bus.ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2900;
  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.2, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  shaper.connect(filter).connect(gain);
  gain.connect(bus.dry);
  gain.connect(bus.wet);

  notes.forEach((note, index) => {
    const frequency = hz(note);
    [-5, 5].forEach((cents) => {
      const osc = bus.ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = frequency * Math.pow(2, cents / 1200);
      const pick = bus.ctx.createGain();
      pick.gain.value = 0.5;
      osc.connect(pick).connect(shaper);
      // a strum, not a block chord
      osc.start(at + index * 0.012);
      osc.stop(at + duration + 0.1);
    });
  });
}

function pianoNote(bus: Bus, at: number, note: string, duration: number, level = 1) {
  const frequency = hz(note);
  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.26 * level, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  gain.connect(bus.dry);
  gain.connect(bus.wet);

  const tone = bus.ctx.createOscillator();
  tone.type = "triangle";
  tone.frequency.value = frequency;
  const bell = bus.ctx.createOscillator();
  bell.type = "sine";
  bell.frequency.value = frequency * 2.02;
  const bellGain = bus.ctx.createGain();
  bellGain.gain.setValueAtTime(0.22 * level, at);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, at + duration * 0.4);

  tone.connect(gain);
  bell.connect(bellGain).connect(gain);
  tone.start(at); bell.start(at);
  tone.stop(at + duration + 0.1); bell.stop(at + duration + 0.1);
}

/** Vowel-ish lead: saw through three formants, with a singer's vibrato. */
function voiceNote(bus: Bus, at: number, note: string, duration: number) {
  const frequency = hz(note);
  const osc = bus.ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(frequency * 0.985, at);
  osc.frequency.linearRampToValueAtTime(frequency, at + 0.09);

  const vibrato = bus.ctx.createOscillator();
  vibrato.frequency.value = 5.4;
  const vibratoDepth = bus.ctx.createGain();
  vibratoDepth.gain.setValueAtTime(0, at);
  vibratoDepth.gain.linearRampToValueAtTime(frequency * 0.011, at + duration * 0.45);
  vibrato.connect(vibratoDepth).connect(osc.frequency);

  const gain = bus.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.3, at + 0.07);
  gain.gain.setValueAtTime(0.3, at + duration * 0.72);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  [
    [720, 1.0],
    [1180, 0.6],
    [2640, 0.28],
  ].forEach(([freq, level]) => {
    const formant = bus.ctx.createBiquadFilter();
    formant.type = "bandpass";
    formant.frequency.value = freq;
    formant.Q.value = 7;
    const trim = bus.ctx.createGain();
    trim.gain.value = level;
    osc.connect(formant).connect(trim).connect(gain);
  });

  gain.connect(bus.dry);
  gain.connect(bus.wet);
  osc.start(at); vibrato.start(at);
  osc.stop(at + duration + 0.2); vibrato.stop(at + duration + 0.2);
}

/* --- the score --------------------------------------------------------- */

type Event = { beat: number; play: (bus: Bus, at: number) => void };

function buildScore(): Event[] {
  const events: Event[] = [];
  const add = (beat: number, play: Event["play"]) => events.push({ beat, play });

  // drums — in from the first frame
  for (let b = 0; b < 12; b += 0.5) {
    add(b, (bus, at) => hat(bus, at, false, b % 1 === 0 ? 1 : 0.6));
  }
  [0, 1.5, 2, 3.5, 4, 5.5, 6, 7.5, 8, 9.5, 10].forEach((b) => add(b, (bus, at) => kick(bus, at)));
  [1, 3, 5, 7, 9].forEach((b) => add(b, (bus, at) => snare(bus, at)));
  [9.5, 9.75].forEach((b, i) => add(b, (bus, at) => snare(bus, at, 0.7 + i * 0.2)));
  [0, 4, 8].forEach((b) => add(b, (bus, at) => crash(bus, at, 0.7)));
  add(10, (bus, at) => crash(bus, at, 1));

  // bass — enters on the bass panel
  ([[2, "D2", 0.7], [2.75, "D2", 0.5], [3.5, "D2", 0.4],
    [4, "A#1", 0.7], [4.75, "A#1", 0.5], [5.5, "A#1", 0.4],
    [6, "A#1", 0.7], [6.75, "F2", 0.5], [7.5, "A#1", 0.4],
    [8, "C2", 0.7], [8.75, "C2", 0.5], [9.5, "C2", 0.4],
    [10, "D2", 1.9]] as [number, string, number][])
    .forEach(([b, note, dur]) => add(b, (bus, at) => bassNote(bus, at, note, dur * BEAT)));

  // guitar — enters on the guitar panel
  ([[4, ["A#2", "F3"], 0.55], [5, ["A#2", "F3"], 0.55],
    [6, ["A#2", "F3"], 0.4], [6.5, ["A#2", "F3"], 0.3], [7, ["A#2", "F3"], 0.55],
    [8, ["C3", "G3"], 0.55], [9, ["C3", "G3"], 0.55],
    [10, ["D3", "A3", "D4"], 2.2]] as [number, string[], number][])
    .forEach(([b, notes, dur]) => add(b, (bus, at) => guitarChord(bus, at, notes, dur * BEAT)));

  // piano — enters on the piano panel
  ([[6, "F4", 0.9], [6.5, "A#4", 0.9], [7, "D5", 1.1], [7.5, "A#4", 0.7],
    [8, "G4", 0.9], [8.5, "C5", 0.9], [9, "E5", 1.1], [9.5, "C5", 0.7]] as [number, string, number][])
    .forEach(([b, note, dur]) => add(b, (bus, at) => pianoNote(bus, at, note, dur * BEAT)));
  ["D4", "F4", "A4", "D5"].forEach((note, i) =>
    add(10, (bus, at) => pianoNote(bus, at + i * 0.014, note, 7.2 * BEAT, 1.1)),
  );

  // voice — takes the melody home
  add(8, (bus, at) => voiceNote(bus, at, "A4", 0.95 * BEAT));
  add(9, (bus, at) => voiceNote(bus, at, "C5", 0.95 * BEAT));
  add(10, (bus, at) => voiceNote(bus, at, "F5", 3.5 * BEAT));

  return events.sort((a, b) => a.beat - b.beat);
}

/* --- public api -------------------------------------------------------- */

export type BandIntro = {
  /** true when the browser refused to start audio without a gesture */
  blocked: boolean;
  /** call from a click/tap to start (or resume) the music mid-intro */
  unlock: (elapsed: number) => Promise<boolean>;
  /** fade out and release the audio context */
  stop: () => void;
};

const SILENT: BandIntro = {
  blocked: false,
  unlock: async () => false,
  stop: () => {},
};

export function playBandIntro(): BandIntro {
  if (typeof window === "undefined") return SILENT;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return SILENT;

  let ctx: AudioContext;
  try {
    ctx = new AudioCtor();
  } catch {
    return SILENT;
  }

  const bus = buildBus(ctx);
  const score = buildScore();
  let scheduled = false;
  let stopped = false;

  const schedule = (elapsed: number) => {
    if (scheduled || stopped) return;
    scheduled = true;
    const origin = ctx.currentTime + 0.06 - elapsed;
    score.forEach(({ beat, play }) => {
      const at = origin + beat * BEAT;
      if (at < ctx.currentTime) return; // already gone by; skip rather than pile up
      play(bus, at);
    });
    const fadeFrom = origin + 17.6 * BEAT;
    bus.master.gain.setValueAtTime(0.85, Math.max(ctx.currentTime, fadeFrom));
    bus.master.gain.exponentialRampToValueAtTime(0.0001, fadeFrom + 1.1);
  };

  const intro: BandIntro = {
    blocked: ctx.state !== "running",
    unlock: async (elapsed: number) => {
      if (stopped) return false;
      try {
        await ctx.resume();
      } catch {
        return false;
      }
      if (ctx.state !== "running") return false;
      schedule(elapsed);
      intro.blocked = false;
      return true;
    },
    stop: () => {
      if (stopped) return;
      stopped = true;
      try {
        bus.master.gain.cancelScheduledValues(ctx.currentTime);
        bus.master.gain.setValueAtTime(Math.max(bus.master.gain.value, 0.0001), ctx.currentTime);
        bus.master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      } catch {
        /* context already gone */
      }
      window.setTimeout(() => {
        void ctx.close().catch(() => {});
      }, 320);
    },
  };

  if (!intro.blocked) schedule(0);
  return intro;
}
