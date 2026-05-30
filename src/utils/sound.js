// Procedural UI Sound Effects using Web Audio API
// No assets or network requests needed. Fully lightweight & high-fidelity.

let audioCtx = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true

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

// A very short, organic tactile click pop (E5 note - 659.25 Hz)
export const playClickSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sine';
  // E5 note, clean and cheerful
  osc.frequency.setValueAtTime(659.25, now);

  // Clean volume envelope to prevent clicking artifacts
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(0.035, now + 0.002);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
};

// A warm, two-tone strum for page transitions (A3 220Hz -> E4 329Hz)
export const playTabChangeSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playTone = (freq, delay) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0.0001, now + delay);
    gainNode.gain.linearRampToValueAtTime(0.025, now + delay + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.35);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.40);
  };

  playTone(220.00, 0);      // A3 (warm fundamental)
  playTone(329.63, 0.035);  // E4 (perfect fifth, delayed slightly for strum effect)
};

// Sparkly glassy chime for theme switching (A5 880Hz + E6 1318Hz played concurrently)
export const playThemeToggleSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playChime = (freq, delay) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0.0001, now + delay);
    gainNode.gain.linearRampToValueAtTime(0.015, now + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.25);
  };

  playChime(880.00, 0);     // A5
  playChime(1318.51, 0.02); // E6
};

// Upward major arpeggio for expanding modal panels (C4 -> E4 -> G4 -> C5)
export const playModalOpenSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

  notes.forEach((freq, idx) => {
    const delay = idx * 0.045; // Staggered arpeggiator
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0.0001, now + delay);
    gainNode.gain.linearRampToValueAtTime(0.02, now + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.28);
  });
};

// Downward arpeggio for collapsing modal panels (C5 -> G4 -> E4)
export const playModalCloseSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 392.00, 329.63]; // C5, G4, E4

  notes.forEach((freq, idx) => {
    const delay = idx * 0.045; // Staggered arpeggiator descending
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0.0001, now + delay);
    gainNode.gain.linearRampToValueAtTime(0.02, now + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.28);
  });
};

// Subtle confirmation chime when user unmutes audio (G5 -> C6)
const playConfirmationSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const playTone = (freq, delay) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0.0001, now + delay);
    gainNode.gain.linearRampToValueAtTime(0.02, now + delay + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.25);
  };

  playTone(783.99, 0);     // G5
  playTone(1046.50, 0.06); // C6
};
