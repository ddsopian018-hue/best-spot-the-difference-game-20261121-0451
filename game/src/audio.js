// Twin Canvas — all sound is synthesized with WebAudio at run time: no audio
// files, no network. A soft chime for a find, a low buzz for a miss, a little
// arpeggio when a level is cleared.
let audioContext = null;
let muted = false;

/** Lazily create the shared AudioContext (browsers require a user gesture). */
export function ensureAudio() {
  if (audioContext === null) {
    try {
      const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
      audioContext = AudioCtor ? new AudioCtor() : null;
    } catch {
      audioContext = null;
    }
  }
  if (audioContext !== null && audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
}

export function isMuted() {
  return muted;
}

export function toggleMuted() {
  muted = !muted;
  return muted;
}

/** Play one short sine tone. */
function tone(frequency, startAt, duration, volume, type = 'sine') {
  const ctx = ensureAudio();
  if (ctx === null || muted) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
}

/** Two rising notes: a found difference. Pitch climbs with the combo. */
export function playFind(combo) {
  const base = 620 + Math.min(combo, 8) * 40;
  tone(base, 0, 0.16, 0.22);
  tone(base * 1.5, 0.07, 0.22, 0.2);
}

/** A dull low buzz: a wrong click. */
export function playWrong() {
  tone(160, 0, 0.18, 0.18, 'sawtooth');
}

/** A soft ping: a hint is spent. */
export function playHint() {
  tone(880, 0, 0.12, 0.14);
  tone(1174, 0.09, 0.18, 0.12);
}

/** A rising arpeggio: a level is cleared. */
export function playLevelClear() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((frequency, index) => tone(frequency, index * 0.09, 0.24, 0.2));
}

/** A longer fanfare: the whole game is complete. */
export function playGameComplete() {
  const notes = [523, 659, 784, 1046, 1318, 1568];
  notes.forEach((frequency, index) => tone(frequency, index * 0.11, 0.3, 0.2));
}
