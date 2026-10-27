/**
 * Eidolon AI - Procedural Web Audio API Synthesizer
 * 100% In-Browser Real-Time Mathematical Sound Synthesis
 * No external MP3/WAV files required.
 */

class OccultAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;

    // Generators
    this.thereminOsc = null;
    this.thereminLfo = null;
    this.thereminGain = null;

    this.crtOsc = null;
    this.crtGain = null;

    this.crackleNode = null;
    this.crackleGain = null;
  }

  _initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  start() {
    this._initContext();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;

    const t = this.ctx.currentTime;

    // 1. Ethereal Theremin Drone (108 Hz with slow 5 Hz vibrato)
    this.thereminOsc = this.ctx.createOscillator();
    this.thereminOsc.type = 'sine';
    this.thereminOsc.frequency.setValueAtTime(108, t);

    this.thereminLfo = this.ctx.createOscillator();
    this.thereminLfo.frequency.setValueAtTime(4.8, t); // 4.8 Hz vibrato
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(4.5, t);
    this.thereminLfo.connect(lfoGain);
    lfoGain.connect(this.thereminOsc.frequency);

    const thereminFilter = this.ctx.createBiquadFilter();
    thereminFilter.type = 'lowpass';
    thereminFilter.frequency.setValueAtTime(450, t);

    this.thereminGain = this.ctx.createGain();
    this.thereminGain.gain.setValueAtTime(0.08, t);

    this.thereminOsc.connect(thereminFilter);
    thereminFilter.connect(this.thereminGain);
    this.thereminGain.connect(this.masterGain);

    this.thereminLfo.start(t);
    this.thereminOsc.start(t);

    // 2. Vintage CRT Monitor 15.7kHz Flyback Whine
    this.crtOsc = this.ctx.createOscillator();
    this.crtOsc.type = 'sine';
    this.crtOsc.frequency.setValueAtTime(15734, t); // NTSC horizontal flyback frequency

    this.crtGain = this.ctx.createGain();
    this.crtGain.gain.setValueAtTime(0.015, t); // Ultra soft, barely perceptible presence

    this.crtOsc.connect(this.crtGain);
    this.crtGain.connect(this.masterGain);
    this.crtOsc.start(t);

    // 3. Stochastic Candle Flame / Spirit Noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    this.crackleNode = this.ctx.createBufferSource();
    this.crackleNode.buffer = noiseBuffer;
    this.crackleNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    noiseFilter.Q.setValueAtTime(1.5, t);

    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.setValueAtTime(0.04, t);

    this.crackleNode.connect(noiseFilter);
    noiseFilter.connect(this.crackleGain);
    this.crackleGain.connect(this.masterGain);
    this.crackleNode.start(t);

    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.ctx) return;
    const t = this.ctx.currentTime;

    try {
      this.thereminGain?.gain.setTargetAtTime(0, t, 0.2);
      this.crtGain?.gain.setTargetAtTime(0, t, 0.2);
      this.crackleGain?.gain.setTargetAtTime(0, t, 0.2);

      setTimeout(() => {
        this.thereminOsc?.stop();
        this.thereminLfo?.stop();
        this.crtOsc?.stop();
        this.crackleNode?.stop();
        this.isPlaying = false;
      }, 250);
    } catch {
      this.isPlaying = false;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  /**
   * Plays a 432 Hz mystical bell chime for altar rituals and séance messages.
   */
  playChime(frequency = 432) {
    this._initContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, t);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, t + 1.8);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 2.1);
  }

  /**
   * Plays an 8-bit memory glitch sound for terminal execution.
   */
  playGlitch() {
    this._initContext();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.setValueAtTime(880, t + 0.03);
    osc.frequency.setValueAtTime(110, t + 0.06);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }
}

window.OccultAudio = new OccultAudioSynthesizer();
