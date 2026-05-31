// Procedural UI Sound Effects using Web Audio API
// No assets or network requests needed. Fully lightweight & high-fidelity.

let audioCtx = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true

const SOUND_GAIN = 1.45;
const TAIL_GAIN = 0.18;

// Initialize or resume the AudioContext safely within a user gesture
const getAudioContext = () => {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
};

// Check if sound is currently enabled
export const getSoundEnabled = () => soundEnabled;

// Enable/disable sound and persist setting
export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');

  // If enabled, play a subtle confirmation tone
  if (enabled) {
    // Small delay to allow state to settle
    setTimeout(() => {
      playConfirmationSound();
    }, 50);
  }
};

const createSoftChain = (ctx, now, duration) => {
  const output = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const tail = ctx.createDelay(0.25);
  const tailGain = ctx.createGain();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, now);
  filter.Q.setValueAtTime(0.45, now);

  output.gain.setValueAtTime(SOUND_GAIN, now);
  output.gain.setValueAtTime(SOUND_GAIN, now + duration);
  output.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.18);

  tail.delayTime.setValueAtTime(0.055, now);
  tailGain.gain.setValueAtTime(TAIL_GAIN, now);
  tailGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.2);

  filter.connect(output);
  output.connect(ctx.destination);
  filter.connect(tail);
  tail.connect(tailGain);
  tailGain.connect(ctx.destination);

  return filter;
};

const playLayeredTone = ({
  ctx,
  frequency,
  start,
  duration,
  peakGain,
  type = 'sine',
  detune = 0,
  attack = 0.018,
  release = 0.18,
  destination,
}) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  osc.detune.setValueAtTime(detune, start);

  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.linearRampToValueAtTime(peakGain, start + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);

  osc.connect(gainNode);
  gainNode.connect(destination);

  osc.start(start);
  osc.stop(start + duration + release + 0.04);
};

// A soft tactile bell tap, tuned lower than a UI beep so it feels warmer.
export const playClickSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.14);

  playLayeredTone({
    ctx,
    frequency: 523.25,
    start: now,
    duration: 0.06,
    peakGain: 0.032,
    destination,
  });
  playLayeredTone({
    ctx,
    frequency: 659.25,
    start: now + 0.006,
    duration: 0.05,
    peakGain: 0.015,
    type: 'triangle',
    detune: -4,
    destination,
  });
};

// A warm, resolving strum for page transitions (F3 -> C4 -> G4).
export const playTabChangeSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.55);

  [
    [174.61, 0, 0.032],
    [261.63, 0.04, 0.027],
    [392.00, 0.09, 0.021],
  ].forEach(([frequency, delay, peakGain]) => {
    playLayeredTone({
      ctx,
      frequency,
      start: now + delay,
      duration: 0.24,
      peakGain,
      type: 'triangle',
      attack: 0.045,
      release: 0.38,
      destination,
    });
  });
};

// Soft glass chime for theme switching, with less high-frequency edge.
export const playThemeToggleSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.34);

  [
    [587.33, 0, 0.024],
    [783.99, 0.045, 0.02],
    [987.77, 0.09, 0.014],
  ].forEach(([frequency, delay, peakGain]) => {
    playLayeredTone({
      ctx,
      frequency,
      start: now + delay,
      duration: 0.12,
      peakGain,
      attack: 0.02,
      release: 0.24,
      destination,
    });
  });
};

// Upward pentatonic arpeggio for expanding modal panels.
export const playModalOpenSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.5);
  const notes = [261.63, 293.66, 392.00, 523.25]; // C4, D4, G4, C5

  notes.forEach((freq, idx) => {
    const delay = idx * 0.055;
    playLayeredTone({
      ctx,
      frequency: freq,
      start: now + delay,
      duration: 0.15,
      peakGain: 0.024 - idx * 0.002,
      type: idx === 0 ? 'triangle' : 'sine',
      attack: 0.022,
      release: 0.24,
      destination,
    });
  });
};

// Downward resolving arpeggio for collapsing modal panels.
export const playModalCloseSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.42);
  const notes = [523.25, 392.00, 293.66]; // C5, G4, D4

  notes.forEach((freq, idx) => {
    const delay = idx * 0.055;
    playLayeredTone({
      ctx,
      frequency: freq,
      start: now + delay,
      duration: 0.13,
      peakGain: 0.022 - idx * 0.002,
      attack: 0.018,
      release: 0.22,
      destination,
    });
  });
};

// Gentle confirmation chime when user unmutes audio.
const playConfirmationSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const destination = createSoftChain(ctx, now, 0.38);

  [
    [659.25, 0, 0.024],
    [880.00, 0.07, 0.019],
  ].forEach(([frequency, delay, peakGain]) => {
    playLayeredTone({
      ctx,
      frequency,
      start: now + delay,
      duration: 0.14,
      peakGain,
      attack: 0.02,
      release: 0.25,
      destination,
    });
  });
};
