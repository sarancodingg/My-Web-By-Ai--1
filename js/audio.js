/**
 * Romantic Audio Engine using Web Audio API
 * Generates beautiful music box melodies and romantic sound effects
 * without external audio files.
 */
class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.isMuted = false;
    this.musicTimer = null;
    this.currentNoteIndex = 0;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Romantic music box melody (frequencies in Hz)
    // Progression: C - G/B - Am - F (Canon in D / Romantic Ballad style)
    this.melody = [
      { note: 523.25, dur: 0.6 }, // C5
      { note: 659.25, dur: 0.4 }, // E5
      { note: 783.99, dur: 0.6 }, // G5
      { note: 1046.50, dur: 0.8 }, // C6
      
      { note: 493.88, dur: 0.6 }, // B4
      { note: 587.33, dur: 0.4 }, // D5
      { note: 783.99, dur: 0.6 }, // G5
      { note: 987.77, dur: 0.8 }, // B5

      { note: 440.00, dur: 0.6 }, // A4
      { note: 523.25, dur: 0.4 }, // C5
      { note: 659.25, dur: 0.6 }, // E5
      { note: 880.00, dur: 0.8 }, // A5

      { note: 349.23, dur: 0.6 }, // F4
      { note: 440.00, dur: 0.4 }, // A4
      { note: 523.25, dur: 0.6 }, // C5
      { note: 698.46, dur: 0.8 }, // F5

      { note: 392.00, dur: 0.6 }, // G4
      { note: 493.88, dur: 0.4 }, // B4
      { note: 587.33, dur: 0.6 }, // D5
      { note: 783.99, dur: 0.8 }, // G5

      { note: 659.25, dur: 0.5 }, // E5
      { note: 587.33, dur: 0.5 }, // D5
      { note: 523.25, dur: 1.2 }  // C5 (Hold)
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single celestial music box bell note
  playBell(freq, time = 0, duration = 1.2, gainNode = this.musicGain) {
    if (!this.ctx || this.isMuted) return;

    const startTime = this.ctx.currentTime + time;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Warm sine wave with gentle overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Exponential decay like a music box tine / kalimba
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.4, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Subtle harmonic overtone
    const overtone = this.ctx.createOscillator();
    const overGain = this.ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.01, startTime);
    overGain.gain.setValueAtTime(0.001, startTime);
    overGain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.015);
    overGain.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.5));

    osc.connect(noteGain);
    noteGain.connect(gainNode || this.musicGain);

    overtone.connect(overGain);
    overGain.connect(gainNode || this.musicGain);

    osc.start(startTime);
    overtone.start(startTime);

    osc.stop(startTime + duration);
    overtone.stop(startTime + duration);
  }

  toggleMusic() {
    this.init();
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.init();
    this.isPlayingMusic = true;
    this.scheduleNextMelodyNote();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  scheduleNextMelodyNote() {
    if (!this.isPlayingMusic) return;

    const item = this.melody[this.currentNoteIndex];
    this.playBell(item.note, 0, item.dur * 2.2, this.musicGain);

    // Also play soft bass note on certain beats
    if (this.currentNoteIndex % 4 === 0) {
      this.playBell(item.note / 2, 0.01, 1.8, this.musicGain);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    const interval = item.dur * 1000;

    this.musicTimer = setTimeout(() => {
      this.scheduleNextMelodyNote();
    }, interval);
  }

  // SFX: Heart click bubble pop
  playHeartPop() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // SFX: Chime / Magic twinkle
  playChime() {
    this.init();
    if (this.isMuted) return;

    const pitches = [784, 988, 1175, 1568];
    pitches.forEach((freq, idx) => {
      this.playBell(freq, idx * 0.06, 0.8, this.sfxGain);
    });
  }

  // SFX: Envelope Opening (whoosh + warm shimmer)
  playEnvelopeOpen() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    // White noise whoosh
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.25);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + 0.3);

    // Warm chord chime after whoosh
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      this.playBell(freq, 0.1 + i * 0.08, 1.2, this.sfxGain);
    });
  }

  // SFX: Button Dodge / Boing
  playDodge() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // SFX: Celebration fanfare when "Yes" is clicked
  playCelebration() {
    this.init();
    if (this.isMuted) return;

    // Victory romantic arpeggio
    const fanfare = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.50, d: 0.3 },
      { f: 880.00, d: 0.15 },
      { f: 1046.50, d: 0.15 },
      { f: 1318.51, d: 0.8 } // High E6 hold
    ];

    let delay = 0;
    fanfare.forEach(item => {
      this.playBell(item.f, delay, item.d * 2.5, this.sfxGain);
      delay += item.d;
    });

    // Start background music box gently if not already playing
    if (!this.isPlayingMusic) {
      setTimeout(() => {
        this.startMusic();
      }, 1800);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

window.romanticAudio = new RomanticAudioEngine();
