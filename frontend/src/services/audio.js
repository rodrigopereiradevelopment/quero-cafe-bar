const BASE = import.meta.env.BASE_URL || '/';

class AudioService {
  constructor() {
    this._musicAudio = null;
    this._playlist = [];
    this._currentIndex = -1;
    this._isPlaying = false;
    this._sfxCtx = null;
    this._listeners = [];
    this._volume = 0.7;
  }

  // ─── SFX (Web Audio API — synth, no files) ───

  _getCtx() {
    if (!this._sfxCtx) {
      this._sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._sfxCtx;
  }

  _playTone(freq, duration, type = 'sine', volume = 0.3) {
    const ctx = this._getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  _playSequence(notes, volume = 0.25) {
    const ctx = this._getCtx();
    let time = ctx.currentTime;
    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
      time += dur;
    });
  }

  playClick() {
    this._playTone(800, 0.06, 'sine', 0.2);
  }

  playSuccess() {
    this._playSequence([[523, 0.1], [659, 0.1], [784, 0.15]], 0.25);
  }

  playError() {
    this._playSequence([[400, 0.12], [300, 0.2]], 0.25);
  }

  playNotification() {
    this._playSequence([[880, 0.08], [1100, 0.12]], 0.2);
  }

  playReserve() {
    this._playSequence([[440, 0.1], [554, 0.1], [660, 0.15]], 0.25);
  }

  playLiberate() {
    this._playSequence([[660, 0.1], [554, 0.1], [440, 0.15]], 0.25);
  }

  // ─── MUSIC (HTML5 Audio — singleton) ───

  // (playlist loaded via api.getMusicas() — see MusicPage)

  getPlaylist() {
    return this._playlist;
  }

  setPlaylist(list) {
    this._playlist = Array.isArray(list) ? list : [];
    if (this._currentIndex >= this._playlist.length) {
      this._currentIndex = -1;
      if (this._musicAudio) {
        this._musicAudio.pause();
        this._isPlaying = false;
      }
    }
    this._notify();
  }

  getCurrentIndex() {
    return this._currentIndex;
  }

  isPlaying() {
    return this._isPlaying;
  }

  getVolume() {
    return this._volume;
  }

  _getAudio() {
    if (!this._musicAudio) {
      this._musicAudio = new Audio();
      this._musicAudio.volume = this._volume;
      this._musicAudio.addEventListener('ended', () => this.nextTrack());
    }
    return this._musicAudio;
  }

  playTrack(index) {
    if (index < 0 || index >= this._playlist.length) return;
    const audio = this._getAudio();
    const track = this._playlist[index];
    this._currentIndex = index;
    audio.src = `${BASE}assets/audio/music/${track.filename}`;
    audio.play().catch(() => {});
    this._isPlaying = true;
    this._notify();
  }

  pause() {
    if (this._musicAudio) {
      this._musicAudio.pause();
      this._isPlaying = false;
      this._notify();
    }
  }

  resume() {
    if (this._musicAudio && this._currentIndex >= 0) {
      this._musicAudio.play().catch(() => {});
      this._isPlaying = true;
      this._notify();
    }
  }

  togglePlay() {
    if (this._isPlaying) this.pause();
    else if (this._currentIndex >= 0) this.resume();
    else if (this._playlist.length > 0) this.playTrack(0);
  }

  nextTrack() {
    if (this._playlist.length === 0) return;
    const next = (this._currentIndex + 1) % this._playlist.length;
    this.playTrack(next);
  }

  prevTrack() {
    if (this._playlist.length === 0) return;
    const prev = this._currentIndex <= 0 ? this._playlist.length - 1 : this._currentIndex - 1;
    this.playTrack(prev);
  }

  setVolume(vol) {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this._musicAudio) this._musicAudio.volume = this._volume;
    this._notify();
  }

  getCurrentTime() {
    return this._musicAudio ? this._musicAudio.currentTime : 0;
  }

  getDuration() {
    return this._musicAudio ? this._musicAudio.duration || 0 : 0;
  }

  seek(time) {
    if (this._musicAudio) this._musicAudio.currentTime = time;
  }

  // ─── STAR WARS THEME (Web Audio API — synth, no files) ───

  playStarWarsTheme() {
    this.stopStarWarsTheme();
    const ctx = this._getCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(ctx.destination);

    // Pad: A minor drone (detuned saws for warmth)
    const padFreqs = [109, 110, 219.5, 220.5];
    const pads = padFreqs.map(f => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.025, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 6);
      o.connect(g);
      g.connect(masterGain);
      o.start();
      return { osc: o, gain: g };
    });

    // Melody notes: [freq, duration, startOffset]
    const melody = [
      [220, 1.8, 0],       // A3
      [262, 1.2, 2.0],     // C4
      [349, 2.5, 3.5],     // F4
      [330, 1.5, 6.0],     // E4
      [262, 0.8, 7.8],     // C4
      [349, 1.0, 8.8],     // F4
      [330, 1.8, 10.0],    // E4
      [392, 0.7, 12.0],    // G4
      [440, 0.7, 12.8],    // A4
      [392, 0.7, 13.6],    // G4
      [349, 1.0, 14.5],    // F4
      [330, 3.0, 15.8],    // E4 (held)
    ];

    melody.forEach(([freq, dur, start]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + start + 0.15);
      g.gain.linearRampToValueAtTime(0.01, ctx.currentTime + start + dur);
      o.connect(g);
      g.connect(masterGain);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.1);
    });

    // Schedule stop after the melody ends
    const totalDur = 19;
    this._swTimeout = setTimeout(() => this.stopStarWarsTheme(), totalDur * 1000);

    this._swNodes = { masterGain, pads };
  }

  stopStarWarsTheme() {
    if (this._swTimeout) {
      clearTimeout(this._swTimeout);
      this._swTimeout = null;
    }
    if (this._swNodes) {
      try { this._swNodes.pads.forEach(p => { try { p.osc.stop(); p.osc.disconnect(); } catch {} }); } catch {}
      try { this._swNodes.masterGain.disconnect(); } catch {}
      this._swNodes = null;
    }
  }

  // ─── Listeners (for MusicPage reactivity) ───

  onChange(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  }

  _notify() {
    this._listeners.forEach(fn => fn());
  }
}

export const audio = new AudioService();
