// Procedural UI Sound Effects using Web Audio API
// No assets or network requests needed. Fully lightweight & high-fidelity.

let audioCtx = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true

// Morning Sea Wave & Bird Synthesizer state
let seaSource = null;
let seaLfo = null;
let seaGain = null;
let isSeaSoundPlaying = false;
let birdTimer = null;

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

// Helper to synthesize a single bird chirp (frequency sweep with bandpass filter)
const playBirdChirp = (ctx, start, baseFreq, duration, gainVal) => {
  if (!isSeaSoundPlaying || !seaGain) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';

  // Pitch sweep: fast upward then downward sweep
  osc.frequency.setValueAtTime(baseFreq, start);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, start + duration * 0.3);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, start + duration);

  // Soft envelope to prevent clicks
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.linearRampToValueAtTime(gainVal, start + duration * 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  // Distant bandpass filter to sound organic
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(baseFreq * 1.15, start);
  filter.Q.setValueAtTime(1.2, start);

  osc.connect(gainNode);
  gainNode.connect(filter);

  // Route through seaGain so it respects global fade/mute
  filter.connect(seaGain);

  osc.start(start);
  osc.stop(start + duration + 0.05);
};

// Triggers a random bird call pattern (single, double, or sequence)
export const triggerBirdSong = () => {
  if (!isSeaSoundPlaying) return;
  const ctx = audioCtx;
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseGain = 0.012; // Distant, ambient volume
  const baseFreq = 1600 + Math.random() * 900; // Pitch range (1600Hz - 2500Hz)

  const style = Math.random();
  if (style < 0.4) {
    // Single chirp
    playBirdChirp(ctx, now, baseFreq, 0.16, baseGain);
  } else if (style < 0.8) {
    // Double chirp (chirp... chirp)
    playBirdChirp(ctx, now, baseFreq, 0.14, baseGain);
    playBirdChirp(ctx, now + 0.22, baseFreq * 1.05, 0.16, baseGain * 0.8);
  } else {
    // Sequence of 3-4 chirps (morning call)
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const delay = i * 0.13;
      const freqMult = 1.0 + Math.sin(i * 1.1) * 0.06;
      playBirdChirp(ctx, now + delay, baseFreq * freqMult, 0.07 + Math.random() * 0.04, baseGain * 0.6);
    }
  }
};

// Periodic bird song scheduler
const scheduleNextBird = () => {
  if (!isSeaSoundPlaying) return;

  // Random delay between 12 and 26 seconds
  const delayMs = 12000 + Math.random() * 14000;
  birdTimer = setTimeout(() => {
    triggerBirdSong();
    scheduleNextBird();
  }, delayMs);
};

export const startMorningSeaSound = (fadeDuration = 2.0) => {
  if (!soundEnabled || isSeaSoundPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isSeaSoundPlaying = true;

  // 1. Create a 2-second looped noise buffer
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  seaSource = ctx.createBufferSource();
  seaSource.buffer = noiseBuffer;
  seaSource.loop = true;

  // 2. Slow LFO to modulate filters and gains (swell cycle every ~12.5 seconds)
  seaLfo = ctx.createOscillator();
  seaLfo.type = 'sine';
  seaLfo.frequency.setValueAtTime(0.08, ctx.currentTime);

  // 3. Channel A: Low-pass rumble (deep water mass)
  const lowFilter = ctx.createBiquadFilter();
  lowFilter.type = 'lowpass';
  lowFilter.frequency.setValueAtTime(320, ctx.currentTime);
  lowFilter.Q.setValueAtTime(0.8, ctx.currentTime);

  const lfoLowGain = ctx.createGain();
  lfoLowGain.gain.setValueAtTime(120, ctx.currentTime);
  seaLfo.connect(lfoLowGain);
  lfoLowGain.connect(lowFilter.frequency);

  const lowVolume = ctx.createGain();
  lowVolume.gain.setValueAtTime(0.045, ctx.currentTime);

  const lfoLowVol = ctx.createGain();
  lfoLowVol.gain.setValueAtTime(0.03, ctx.currentTime);
  seaLfo.connect(lfoLowVol);
  lfoLowVol.connect(lowVolume.gain);

  // 4. Channel B: Band-pass sizzle (sea foam / spray)
  const foamFilter = ctx.createBiquadFilter();
  foamFilter.type = 'bandpass';
  foamFilter.frequency.setValueAtTime(1600, ctx.currentTime);
  foamFilter.Q.setValueAtTime(0.5, ctx.currentTime);

  const lfoFoamGain = ctx.createGain();
  lfoFoamGain.gain.setValueAtTime(500, ctx.currentTime);
  seaLfo.connect(lfoFoamGain);
  lfoFoamGain.connect(foamFilter.frequency);

  const foamVolume = ctx.createGain();
  foamVolume.gain.setValueAtTime(0.006, ctx.currentTime);

  const lfoFoamVol = ctx.createGain();
  lfoFoamVol.gain.setValueAtTime(0.005, ctx.currentTime);
  seaLfo.connect(lfoFoamVol);
  lfoFoamVol.connect(foamVolume.gain);

  // 5. Fade-in gain node for smooth entry/exit
  seaGain = ctx.createGain();
  seaGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  seaGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + fadeDuration);

  // Connect everything
  seaSource.connect(lowFilter);
  lowFilter.connect(lowVolume);
  lowVolume.connect(seaGain);

  seaSource.connect(foamFilter);
  foamFilter.connect(foamVolume);
  foamVolume.connect(seaGain);

  seaGain.connect(ctx.destination);

  // Start nodes
  seaSource.start(0);
  seaLfo.start(0);

  // Schedule periodic birds chirping
  scheduleNextBird();

  // Play an initial welcoming bird song after 2.5s delay (once sea sound has faded in)
  setTimeout(() => {
    triggerBirdSong();
  }, 2500);
};

export const stopMorningSeaSound = (fadeDuration = 1.5) => {
  if (!isSeaSoundPlaying) return;
  isSeaSoundPlaying = false;

  if (birdTimer) {
    clearTimeout(birdTimer);
    birdTimer = null;
  }

  const ctx = audioCtx;
  const currentSource = seaSource;
  const currentLfo = seaLfo;
  const currentGain = seaGain;

  if (ctx && currentGain) {
    try {
      currentGain.gain.setValueAtTime(currentGain.gain.value, ctx.currentTime);
      currentGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fadeDuration);
    } catch {
      // Ignore ramp errors
    }

    setTimeout(() => {
      try {
        currentSource?.stop();
        currentLfo?.stop();
        currentSource?.disconnect();
        currentLfo?.disconnect();
        currentGain?.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }, fadeDuration * 1000 + 100);
  }

  seaSource = null;
  seaLfo = null;
  seaGain = null;
};

// Enable/disable sound and persist setting
export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');

  if (enabled) {
    startMorningSeaSound();
    // Small delay to allow state to settle
    setTimeout(() => {
      playConfirmationSound();
    }, 50);
  } else {
    stopMorningSeaSound();
  }
};

// Auto-start sea sound on first user gesture or immediately if autoplay is allowed
if (typeof window !== 'undefined') {
  const removeInteractionListeners = () => {
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
  };

  const attemptAutoplay = () => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'running') {
        startMorningSeaSound();
        removeInteractionListeners();
      } else {
        ctx.resume().then(() => {
          if (ctx.state === 'running') {
            startMorningSeaSound();
            removeInteractionListeners();
          }
        }).catch(() => {});
      }
    }
  };

  const handleFirstInteraction = () => {
    getAudioContext();
    if (soundEnabled) {
      startMorningSeaSound();
    }
    removeInteractionListeners();
  };

  // Register first interaction listeners
  window.addEventListener('click', handleFirstInteraction);
  window.addEventListener('keydown', handleFirstInteraction);
  window.addEventListener('touchstart', handleFirstInteraction);

  // Attempt autoplay immediately and on window load
  attemptAutoplay();
  window.addEventListener('load', attemptAutoplay, { once: true });

  // Resume audio context on page visibility/focus changes to keep the loops playing continuously
  const handleVisibilityOrFocusChange = () => {
    if (soundEnabled && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityOrFocusChange);
  window.addEventListener('focus', handleVisibilityOrFocusChange);
}

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
