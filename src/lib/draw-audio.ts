/** Draw music + SFX, all synthesized. Unlock from a click, then the overlay can play. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let muted = false;
let music: { stop: () => void; setStage: (n: number) => void; hit: (reel: number) => void } | null =
  null;
let fanfareOut: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let lastTickAt = 0;

const MUTE_KEY = "lodd-sound-muted";

export function getDrawMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setDrawMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(next ? 0 : 0.7, ctx.currentTime, 0.05);
  }
}

function ensureGraph() {
  if (ctx) return;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  master = ctx.createGain();
  musicBus = ctx.createGain();
  sfxBus = ctx.createGain();
  musicBus.gain.value = 0.8;
  sfxBus.gain.value = 0.9;
  muted = getDrawMuted();
  master.gain.value = muted ? 0 : 0.7;
  // Glue + safety: many voices stack up during the fanfare.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  comp.attack.value = 0.004;
  comp.release.value = 0.2;
  musicBus.connect(master);
  sfxBus.connect(master);
  master.connect(comp);
  comp.connect(ctx.destination);
  noiseBuf = makeNoise(ctx, 3);
}

function makeNoise(ac: AudioContext, seconds: number) {
  const n = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.93 + white * 0.07;
    data[i] = last * 1.35;
  }
  return buf;
}

export function unlockDrawAudio() {
  if (typeof window === "undefined") return;
  ensureGraph();
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && ctx?.state === "suspended") {
      void ctx.resume();
    }
  });
}

// ---------- instruments ----------

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

function cleanup(...nodes: AudioNode[]) {
  return () => nodes.forEach((n) => n.disconnect());
}

function noiseHit(
  out: AudioNode,
  t: number,
  type: BiquadFilterType,
  freq: number,
  vol: number,
  decay: number,
  q = 0.7,
) {
  const ac = out.context as AudioContext;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  src.connect(f);
  f.connect(g);
  g.connect(out);
  src.onended = cleanup(src, f, g);
  src.start(t, Math.random() * 0.5);
  src.stop(t + decay + 0.02);
}

function tone(
  out: AudioNode,
  t: number,
  freq: number,
  type: OscillatorType,
  vol: number,
  decay: number,
  opts: { attack?: number; cutoff?: number; glideTo?: number; detune?: number } = {},
) {
  const ac = out.context as AudioContext;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, t + decay * 0.6);
  if (opts.detune) osc.detune.value = opts.detune;
  const f = ac.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = opts.cutoff ?? 12000;
  const g = ac.createGain();
  const attack = opts.attack ?? 0.004;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  osc.connect(f);
  f.connect(g);
  g.connect(out);
  osc.onended = cleanup(osc, f, g);
  osc.start(t);
  osc.stop(t + attack + decay + 0.02);
}

const hat = (out: AudioNode, t: number, vol = 0.05, open = false) =>
  noiseHit(out, t, "highpass", 7500, vol, open ? 0.16 : 0.035);
function snare(out: AudioNode, t: number, vol = 0.22) {
  noiseHit(out, t, "bandpass", 1900, vol, 0.13, 0.6);
  tone(out, t, 196, "triangle", vol * 0.5, 0.06);
}
const crash = (out: AudioNode, t: number, vol = 0.3) =>
  noiseHit(out, t, "highpass", 3200, vol, 1.9, 0.5);

/** Two detuned saws through an opening filter: a cheap brass section. */
function brass(out: AudioNode, t: number, freq: number, dur: number, vol = 0.09) {
  const ac = out.context as AudioContext;
  const f = ac.createBiquadFilter();
  f.type = "lowpass";
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(500, t);
  f.frequency.exponentialRampToValueAtTime(3200, t + 0.06);
  f.frequency.exponentialRampToValueAtTime(1500, t + Math.max(0.1, dur));
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
  g.gain.setTargetAtTime(vol * 0.75, t + 0.05, 0.1);
  g.gain.setTargetAtTime(0.0001, t + dur, 0.09);
  f.connect(g);
  g.connect(out);
  const oscs = [-7, 7].map((cents) => {
    const o = ac.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = freq;
    o.detune.value = cents;
    o.connect(f);
    o.start(t);
    o.stop(t + dur + 0.5);
    return o;
  });
  oscs[0]!.onended = cleanup(...oscs, f, g);
}

function chime(out: AudioNode, t: number, freq: number, vol = 0.05) {
  tone(out, t, freq, "sine", vol, 1.1);
  tone(out, t, freq * 2.01, "sine", vol * 0.35, 0.6);
}

function applause(out: AudioNode, t: number, seconds: number) {
  const claps = Math.round(seconds * 70);
  for (let i = 0; i < claps; i++) {
    const at = t + Math.random() * seconds;
    const fade = 1 - (at - t) / seconds;
    noiseHit(out, at, "bandpass", 900 + Math.random() * 1800, 0.05 * fade + 0.005, 0.03, 1.4);
  }
}

const timpani = (out: AudioNode, t: number, freq: number, vol = 0.45) => {
  tone(out, t, freq * 1.4, "sine", vol, 0.55, { glideTo: freq });
  noiseHit(out, t, "lowpass", 260, vol * 0.4, 0.09);
};
const pizz = (out: AudioNode, t: number, freq: number, vol = 0.05) =>
  tone(out, t, freq, "triangle", vol, 0.14, { cutoff: 2600 });
/** Tick-tock of a clock: a short, tuned woodblock. */
const clock = (out: AudioNode, t: number, high: boolean, vol = 0.07) =>
  noiseHit(out, t, "bandpass", high ? 2600 : 1900, vol, 0.025, 8);

/** Detuned saws with a slowly opening filter: a string section swell. */
function strings(out: AudioNode, t: number, notes: number[], dur: number, vol = 0.03) {
  const ac = out.context as AudioContext;
  const f = ac.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(400, t);
  f.frequency.exponentialRampToValueAtTime(2400, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.8);
  g.gain.setTargetAtTime(0.0001, t + dur, 0.05);
  f.connect(g);
  g.connect(out);
  const oscs = notes.flatMap((n) =>
    [-9, 9].map((cents) => {
      const o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = midi(n);
      o.detune.value = cents;
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.4);
      return o;
    }),
  );
  oscs[0]!.onended = cleanup(...oscs, f, g);
}

// ---------- spin music: a countdown in D minor ----------

const BPM = 125;
/** One beat in ms. Reel landings are placed on this grid so they hit with the music. */
export const BEAT_MS = 60000 / BPM;
/** Music starts this long after the draw begins. */
export const MUSIC_LEAD_MS = 30;
const STEP = 60 / BPM / 4; // one 16th note
/** Dm – B♭ – Gm – A, one bar each. Bass root and a triad around middle C (MIDI). */
const BARS = [
  { root: 38, chord: [62, 65, 69] },
  { root: 34, chord: [62, 65, 70] },
  { root: 31, chord: [62, 67, 70] },
  { root: 33, chord: [61, 64, 69] },
];
const MOTIF = [0, 2, 1, 2, 0, 2, 1, 2];
/** Spin music gets louder as each reel locks. */
const STAGE_LEVEL = [1, 1.1, 1.25, 1.4];

export function stopDrawAmbience() {
  music?.stop();
  music = null;
}

/** Fade out everything: spin music and any fanfare tail. */
export function stopDrawSound() {
  stopDrawAmbience();
  if (ctx && fanfareOut) {
    const out = fanfareOut;
    out.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    window.setTimeout(() => out.disconnect(), 600);
  }
  fanfareOut = null;
}

/** 0 = all reels spinning … 3 = all locked (roll into the reveal). */
export function setSpinStage(stage: number) {
  music?.setStage(stage);
}

/** A reel just landed: timpani + a bell in the chord that is playing right now. */
export function playLock(reel: number) {
  if (music) {
    music.hit(reel);
    return;
  }
  if (!ctx || !sfxBus) return;
  timpani(sfxBus, ctx.currentTime, midi(38));
  chime(sfxBus, ctx.currentTime, midi(74 + reel * 4), 0.08);
}

export function startDrawAmbience() {
  stopDrawSound();
  ensureGraph();
  if (!ctx || !musicBus || !noiseBuf) return;
  if (ctx.state === "suspended") void ctx.resume();
  const ac = ctx;
  const out = ac.createGain();
  out.gain.value = STAGE_LEVEL[0]!;
  out.connect(musicBus);

  const start = ac.currentTime + MUSIC_LEAD_MS / 1000;
  let stage = 0;
  let step = 0;
  let nextAt = start;
  let rollFrom = 0;
  const barAt = (t: number) => BARS[Math.floor(Math.max(0, t - start) / (STEP * 16)) % BARS.length]!;

  // A rising noise sweep under everything builds tension.
  const riser = ac.createBufferSource();
  riser.buffer = noiseBuf;
  riser.loop = true;
  const riserF = ac.createBiquadFilter();
  riserF.type = "bandpass";
  riserF.Q.value = 2.5;
  riserF.frequency.setValueAtTime(250, start);
  riserF.frequency.exponentialRampToValueAtTime(4500, start + 6);
  const riserG = ac.createGain();
  riserG.gain.setValueAtTime(0.0001, start);
  riserG.gain.exponentialRampToValueAtTime(0.05, start + 5.5);
  riser.connect(riserF);
  riserF.connect(riserG);
  riserG.connect(out);
  riser.start(start);

  const playStep = (n: number, t: number) => {
    const bar = BARS[Math.floor(n / 16) % BARS.length]!;
    const inBar = n % 16;
    if (stage >= 3) {
      // Timpani + snare roll on the dominant (A), swelling into the D major reveal.
      const k = Math.min(1, (t - rollFrom) / 0.9);
      const dominant = BARS[3]!;
      timpani(out, t, midi(dominant.root), 0.12 + k * 0.25);
      snare(out, t, 0.06 + k * 0.2);
      snare(out, t + STEP / 2, 0.06 + k * 0.2);
      if (inBar % 4 === 0) {
        strings(out, t, dominant.chord.map((c) => c + 12), STEP * 4, 0.035 + k * 0.03);
      }
      return;
    }
    // Clock: tick-tock on every beat, 8ths once the first reel is in.
    if (inBar % 4 === 0) clock(out, t, inBar % 8 === 0, 0.11);
    else if (stage >= 1 && inBar % 2 === 0) clock(out, t, false, 0.035);
    // Timpani on beats 1 and 3, every beat later.
    if (inBar % 8 === 0 || (stage >= 1 && inBar % 4 === 0)) timpani(out, t, midi(bar.root), 0.45);
    // Galloping low strings: da-da-DUM on every beat.
    if (inBar % 4 !== 1) {
      const accent = inBar % 4 === 0;
      tone(out, t, midi(bar.root + 12), "sawtooth", accent ? 0.16 : 0.1, STEP * 0.9, {
        cutoff: 900 + stage * 250,
      });
    }
    // Pizzicato melody from the chord once a reel has landed.
    if (stage >= 1 && n % 2 === 0) {
      pizz(out, t, midi(bar.chord[MOTIF[(n / 2) % MOTIF.length]!]! + 12), 0.045 + stage * 0.01);
    }
    if (stage >= 2) {
      if (inBar === 0) strings(out, t, bar.chord, STEP * 16, 0.03);
      if (inBar % 2 === 1) hat(out, t, 0.03);
      if (inBar === 4 || inBar === 12) snare(out, t, 0.16);
    }
  };

  const timer = window.setInterval(() => {
    while (nextAt < ac.currentTime + 0.12) {
      playStep(step, nextAt);
      step += 1;
      nextAt += STEP;
    }
  }, 25);

  music = {
    setStage: (n: number) => {
      if (n >= 3 && stage < 3) rollFrom = ac.currentTime;
      stage = n;
      out.gain.setTargetAtTime(STAGE_LEVEL[Math.min(n, 3)]!, ac.currentTime, 0.15);
    },
    hit: (reel: number) => {
      // Straight to the sfx bus, so the stage swell doesn't mask it.
      const t = ac.currentTime;
      const chord = barAt(t).chord;
      const bus = sfxBus ?? out;
      timpani(bus, t, midi(barAt(t).root), 0.55);
      crash(bus, t, 0.08 + reel * 0.04);
      chime(bus, t, midi(chord[reel % 3]! + 24), 0.09);
      chime(bus, t + 0.04, midi(chord[(reel + 1) % 3]! + 24), 0.06);
    },
    stop: () => {
      window.clearInterval(timer);
      const t = ac.currentTime;
      out.gain.setTargetAtTime(0.0001, t, 0.04);
      window.setTimeout(() => {
        try {
          riser.stop();
        } catch {
          /* already stopped */
        }
        out.disconnect();
        riserG.disconnect();
        riserF.disconnect();
      }, 400);
    },
  };
}

export function playTick() {
  if (!ctx || !sfxBus || !noiseBuf) return;
  const t = ctx.currentTime;
  if (t - lastTickAt < 0.07) return;
  lastTickAt = t;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1200 + Math.random() * 500;
  bp.Q.value = 0.7;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.055, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  src.connect(bp);
  bp.connect(g);
  g.connect(sfxBus);
  src.onended = () => {
    src.disconnect();
    bp.disconnect();
    g.disconnect();
  };
  src.start(t);
  src.stop(t + 0.045);
}

/** Winner reveal: crash and timpani, a brass call resolving to D major, sparkles and applause. */
export function playFanfare() {
  stopDrawAmbience();
  ensureGraph();
  if (!ctx || !musicBus || !noiseBuf) return;
  const ac = ctx;
  const out = ac.createGain();
  out.gain.value = 1;
  out.connect(musicBus);
  fanfareOut = out;
  const t = ac.currentTime + 0.02;
  const beat = BEAT_MS / 1000;

  // Hit: crash + timpani + D major stab.
  crash(out, t, 0.32);
  timpani(out, t, midi(38), 0.7);
  [62, 66, 69, 74].forEach((n) => brass(out, t, midi(n), 0.3, 0.07));
  tone(out, t, midi(26), "sawtooth", 0.18, 0.5, { cutoff: 400 });

  // Da-da-da DAAA, da-da-da DAAAAA.
  const melody: [number, number, number][] = [
    [1, 69, 0.1],
    [1.33, 69, 0.1],
    [1.67, 69, 0.1],
    [2, 74, 0.42],
    [3, 78, 0.1],
    [3.33, 76, 0.1],
    [3.67, 78, 0.1],
  ];
  melody.forEach(([at, n, dur]) => {
    brass(out, t + at * beat, midi(n), dur, 0.1);
    snare(out, t + at * beat, 0.09);
  });
  timpani(out, t + 2 * beat, midi(33), 0.5);

  // Final chord on the next downbeat, with a timpani roll under it.
  const end = t + 4 * beat;
  crash(out, end, 0.34);
  timpani(out, end, midi(38), 0.75);
  [50, 62, 69, 74, 78, 81].forEach((n) => brass(out, end, midi(n), 1.6, n > 75 ? 0.08 : 0.06));
  strings(out, end, [74, 78, 81, 86], 1.6, 0.04);
  tone(out, end, midi(26), "sawtooth", 0.2, 1.7, { cutoff: 380, attack: 0.02 });
  for (let i = 1; i <= 8; i++) timpani(out, end + 0.9 + i * 0.07, midi(38), 0.1 + i * 0.03);
  timpani(out, end + 1.55, midi(38), 0.7);

  // Sparkles in D major pentatonic.
  const sparkle = [86, 88, 90, 93, 95, 98];
  for (let i = 0; i < 12; i++) {
    chime(out, end + 0.05 + i * 0.11 + Math.random() * 0.05, midi(sparkle[i % sparkle.length]!), 0.04);
  }

  applause(out, t + 0.25, 4.5);
}
