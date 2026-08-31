import { GenreId } from '../types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private currentGenre: GenreId | null = null;
  private loopInterval: number | null = null;
  private step = 0;
  private volume = 0.8;
  private isMuted = false;
  private listeners: Array<(state: { isPlaying: boolean; genre: GenreId | null; currentTime: number; duration: number }) => void> = [];
  private currentTime = 0;
  private trackDuration = 32; // 32 beat loop (~16-20 seconds)

  constructor() {
    // Lazy AudioContext initialization on first user action
  }

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

          this.analyser = this.ctx.createAnalyser();
          this.analyser.fftSize = 256;
          this.analyser.smoothingTimeConstant = 0.85;

          this.masterGain.connect(this.analyser);
          this.analyser.connect(this.ctx.destination);
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext init non-fatal error:', e);
    }
  }

  public subscribe(callback: (state: { isPlaying: boolean; genre: GenreId | null; currentTime: number; duration: number }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb({
      isPlaying: this.isPlaying,
      genre: this.currentGenre,
      currentTime: this.currentTime,
      duration: this.trackDuration,
    }));
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public isCurrentlyMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentGenre(): GenreId | null {
    return this.currentGenre;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public playGenre(genre: GenreId) {
    this.initContext();

    if (this.isPlaying && this.currentGenre === genre) {
      // already playing this genre
      return;
    }

    this.stop();

    this.isPlaying = true;
    this.currentGenre = genre;
    this.step = 0;
    this.currentTime = 0;

    const bpmMap: Record<GenreId, number> = {
      jazz: 110,
      bossanova: 125,
      pop: 122,
      dangdut: 132,
      gamelan: 95,
      fusion: 128,
    };

    const bpm = bpmMap[genre] || 120;
    const stepTimeMs = (60 / bpm / 4) * 1000; // 16th notes

    this.scheduleStep(genre);

    this.loopInterval = window.setInterval(() => {
      this.step = (this.step + 1) % 64;
      this.currentTime = (this.step / 64) * this.trackDuration;
      this.scheduleStep(genre);
      this.notify();
    }, stepTimeMs);

    this.notify();
  }

  public togglePlay(genre: GenreId) {
    if (this.isPlaying && this.currentGenre === genre) {
      this.pause();
    } else {
      this.playGenre(genre);
    }
  }

  public pause() {
    this.stop();
    this.notify();
  }

  public stop() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  // --- Sound Synthesis Helpers ---

  private playTone(freq: number, type: OscillatorType, duration: number, gainValue = 0.3, detune = 0, filterFreq = 3000) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, now);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // AudioContext safe catch
    }
  }

  private playMetallicBell(freq: number, duration = 1.2, gainVal = 0.25) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual partial harmonics for authentic Gamelan Bonang/Saron resonance
    const partials = [1, 2.76, 4.07, 5.43];
    const amps = [1.0, 0.4, 0.2, 0.1];

    partials.forEach((p, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p, now);

      gain.gain.setValueAtTime(gainVal * amps[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / (i * 0.5 + 1));

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  private playDrumHit(type: 'kick' | 'snare' | 'hihat' | 'dangdut_dut' | 'dangdut_tak') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (type === 'kick') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'dangdut_dut') {
      // Low resonant tuned bass drum of Kendang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'dangdut_tak') {
      // Sharp high membrane slap of Kendang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'snare') {
      // Noise burst + tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'hihat') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(8000, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  // --- Step Sequencer Generator for each Genre ---
  private scheduleStep(genre: GenreId) {
    const s = this.step;
    const beat = Math.floor(s / 4);
    const sub = s % 4;

    switch (genre) {
      case 'jazz': {
        // Jazz Mellow Brass & Piano Harmony (Fm9 -> Bb13 -> Ebmaj9 -> C7)
        const jazzChords = [
          [174.61, 220, 261.63, 329.63, 392.00], // F min9
          [116.54, 233.08, 293.66, 349.23, 440.00], // Bb 13
          [155.56, 233.08, 293.66, 349.23, 392.00], // Eb maj9
          [130.81, 261.63, 329.63, 392.00, 466.16], // C 7#9
        ];
        const chordIndex = Math.floor(beat / 4) % jazzChords.length;

        // Rhodes Chord stabs on syncopated beats (e.g. beat 0, beat 2+, beat 3)
        if ((beat % 4 === 0 && sub === 0) || (beat % 4 === 2 && sub === 2)) {
          jazzChords[chordIndex].forEach(f => this.playTone(f, 'sine', 0.8, 0.07, 0, 1800));
        }

        // Walking Acoustic Bass
        if (sub === 0) {
          const bassNotes = [87.31, 116.54, 130.81, 146.83, 77.78, 98.00, 110.00, 130.81];
          const bassNote = bassNotes[beat % bassNotes.length];
          this.playTone(bassNote, 'triangle', 0.35, 0.35, 0, 600);
        }

        // Brass / Saxophone Melody phrase
        const saxNotes = [349.23, 392.00, 440.00, 523.25, 466.16, 392.00, 349.23, 293.66];
        if (s % 8 === 2 || s % 8 === 5) {
          const saxNote = saxNotes[Math.floor(s / 4) % saxNotes.length];
          this.playTone(saxNote, 'sawtooth', 0.4, 0.09, 3, 2200);
        }

        // Swing Jazz Ride cymbal
        if (sub === 0 || sub === 3) {
          this.playDrumHit('hihat');
        }
        break;
      }

      case 'bossanova': {
        // Smooth Nylon Guitar & Soft Percussion (Dmaj7 -> Bm7 -> Em7 -> A7)
        const bossaChords = [
          [146.83, 220.00, 277.18, 369.99], // Dmaj7
          [123.47, 185.00, 220.00, 293.66], // Bm7
          [164.81, 246.94, 293.66, 392.00], // Em7
          [110.00, 220.00, 277.18, 329.63], // A7
        ];
        const chordIdx = Math.floor(beat / 4) % bossaChords.length;

        // Bossa Nova Syncopated Guitar Strum (1, 1&a, 2&, 3, 4&)
        if ((sub === 0 && beat % 2 === 0) || (sub === 3 && beat % 2 === 0) || (sub === 2 && beat % 2 === 1)) {
          bossaChords[chordIdx].forEach(f => this.playTone(f * 1.5, 'triangle', 0.3, 0.12, 0, 2400));
        }

        // Acoustic Upright Bass (Root on 1, Fifth on 3)
        if (sub === 0) {
          const bassRoots = [73.42, 110.00, 61.74, 92.50, 82.41, 123.47, 55.00, 82.41];
          const bassNote = bassRoots[beat % bassRoots.length];
          this.playTone(bassNote, 'sine', 0.4, 0.4, 0, 500);
        }

        // Breezy flute / melody
        if (s % 16 === 4 || s % 16 === 10 || s % 16 === 14) {
          const fluteNotes = [587.33, 659.25, 739.99, 880.00, 659.25];
          const fn = fluteNotes[Math.floor(s / 8) % fluteNotes.length];
          this.playTone(fn, 'sine', 0.5, 0.1, 0, 3200);
        }

        // Soft shaker
        this.playDrumHit('hihat');
        break;
      }

      case 'pop': {
        // Crisp Vocals & Radio-ready Beat (Am -> F -> C -> G)
        const popChords = [
          [220.00, 261.63, 329.63, 440.00], // Am
          [174.61, 220.00, 261.63, 349.23], // F
          [130.81, 164.81, 196.00, 261.63], // C
          [196.00, 246.94, 293.66, 392.00], // G
        ];
        const chordIdx = Math.floor(beat / 4) % popChords.length;

        // Driving 4-on-the-floor beat
        if (sub === 0) {
          this.playDrumHit('kick');
        }
        if (sub === 0 && (beat % 2 === 1)) {
          this.playDrumHit('snare');
        }
        if (sub === 2) {
          this.playDrumHit('hihat');
        }

        // Modern 808 Synth Bass
        if (sub === 0 || sub === 3) {
          const bassFrequencies = [55.00, 43.65, 65.41, 49.00];
          this.playTone(bassFrequencies[chordIdx], 'sine', 0.3, 0.5, 0, 350);
        }

        // Bright Modern Pop Arp & Synth Chords
        if (sub === 0 || sub === 2) {
          popChords[chordIdx].forEach(f => this.playTone(f * 2, 'sawtooth', 0.25, 0.05, 5, 2800));
        }

        // Vocal Chop simulation melody
        if (s % 4 === 1 || s % 8 === 6) {
          const melody = [523.25, 587.33, 659.25, 783.99, 880.00];
          const note = melody[(s + 2) % melody.length];
          this.playTone(note, 'triangle', 0.2, 0.12, 0, 3500);
        }
        break;
      }

      case 'dangdut': {
        // Groovy Bass & Traditional Percussion Fusion (Kendang rhythm + bounce)
        // Kendang traditional pattern: Tak-tung-tung-tak-dut
        if (sub === 0 && beat % 2 === 0) {
          this.playDrumHit('dangdut_dut');
        }
        if (sub === 2 && beat % 2 === 0) {
          this.playDrumHit('dangdut_tak');
        }
        if (sub === 1 && beat % 2 === 1) {
          this.playDrumHit('dangdut_tak');
        }
        if (sub === 3 && beat % 2 === 1) {
          this.playDrumHit('dangdut_dut');
        }

        // Tambourine / Kecrek on 16th notes
        if (sub % 2 === 0) {
          this.playDrumHit('hihat');
        }

        // Bouncing Dangdut Bassline (Walking energetic groove in A minor)
        if (sub === 0 || sub === 2) {
          const dangdutBass = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 123.47];
          const bassNote = dangdutBass[s % dangdutBass.length];
          this.playTone(bassNote, 'triangle', 0.25, 0.45, 0, 650);
        }

        // Suling / Mandolin melodic fill
        if (s % 16 === 8 || s % 16 === 12 || s % 16 === 14) {
          const sulingNotes = [440, 493.88, 523.25, 659.25, 587.33, 523.25];
          const note = sulingNotes[Math.floor(s / 2) % sulingNotes.length];
          this.playTone(note, 'sine', 0.3, 0.15, 2, 2800);
        }
        break;
      }

      case 'gamelan': {
        // Majestic Orchestral Gamelan (Pelog / Slendro scale: 1=Ji, 2=Ro, 3=Lu, 5=Ma, 6=Nem)
        // Balinese/Javanese Pentatonic tuned frequencies: [293.66, 320.00, 360.00, 440.00, 480.00, 587.33]
        const pelogScale = [293.66, 320.00, 360.00, 440.00, 480.00, 587.33, 640.00, 720.00];

        // Gong Ageng on main cycle points (beat 0 & 16)
        if (s === 0 || s === 32) {
          this.playMetallicBell(110.00, 3.5, 0.5); // Deep resonant Gong
        }

        // Kenong on intermediate beats
        if (s % 16 === 8) {
          this.playMetallicBell(220.00, 2.0, 0.35);
        }

        // Bonang Barung interweaving shimmering arpeggios
        if (sub === 0 || sub === 2) {
          const bonangIdx = (s * 3) % pelogScale.length;
          this.playMetallicBell(pelogScale[bonangIdx], 1.2, 0.22);
        }

        // Saron / Peking high metallic rhythm
        if (sub === 1 || sub === 3) {
          const saronIdx = ((s + 2) * 2) % pelogScale.length;
          this.playMetallicBell(pelogScale[saronIdx] * 1.5, 0.6, 0.15);
        }
        break;
      }

      case 'fusion': {
        // Experimental Cross-Genre Showcase (Gamelan x EDM x Jazz harmony)
        const fusionChords = [
          [220.00, 277.18, 329.63, 415.30], // A maj7
          [174.61, 220.00, 261.63, 329.63], // F maj7#11
          [146.83, 220.00, 261.63, 349.23], // D min9
          [196.00, 246.94, 329.63, 392.00], // E 7sus4
        ];
        const chordIdx = Math.floor(beat / 4) % fusionChords.length;

        // Modern EDM Kick on beats
        if (sub === 0) {
          this.playDrumHit('kick');
        }
        if (sub === 0 && beat % 2 === 1) {
          this.playDrumHit('snare');
        }

        // Cyber Synth Bass Drop
        if (sub === 0 || sub === 3) {
          this.playTone(55, 'sawtooth', 0.28, 0.4, 0, 750);
        }

        // Gamelan chime overlay on top of EDM beat
        if (sub === 1 || sub === 3) {
          const chimeNotes = [587.33, 640.00, 720.00, 880.00, 960.00];
          const note = chimeNotes[(s * 2) % chimeNotes.length];
          this.playMetallicBell(note, 0.9, 0.18);
        }

        // Jazz chord pad sweep
        if (beat % 4 === 0 && sub === 0) {
          fusionChords[chordIdx].forEach(f => this.playTone(f * 1.5, 'sine', 1.2, 0.08, 0, 2200));
        }

        this.playDrumHit('hihat');
        break;
      }
    }
  }
}

// Global Singleton for easy state sharing across components
export const globalAudioEngine = new AudioEngine();
