import './MusicPage.css';
import { createHeader } from '../../shared/Header.js';
import { audio } from '../../services/audio.js';

const pageName = 'Musica';

class MusicPage extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    this.classList.add('ion-page');
    this._interval = null;
    this._unsub = null;

    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content>
        <div class="music-container">
          <div class="music-header">
            <h2>Musica</h2>
            <p>Ouca enquanto navega pelo estabelecimento</p>
          </div>

          <div id="music-player-area"></div>
          <div id="music-playlist-area"></div>
        </div>
      </ion-content>
    `;

    this._init();
  }

  async _init() {
    await audio.loadPlaylist();
    this._render();
    this._startProgressLoop();

    this._unsub = audio.onChange(() => this._render());

    const refresher = document.createElement('ion-refresher');
    refresher.setAttribute('slot', 'fixed');
    refresher.id = 'refresher';
    refresher.innerHTML = `
      <ion-refresher-content pulling-icon="chevron-down-circle-outline" refreshing-spinner="crescent">
      </ion-refresher-content>
    `;
    this.querySelector('ion-content').appendChild(refresher);
    refresher.addEventListener('ionrefresh', async () => {
      await audio.loadPlaylist();
      this._render();
      refresher.complete();
    });
  }

  disconnectedCallback() {
    if (this._interval) clearInterval(this._interval);
    if (this._unsub) this._unsub();
  }

  _startProgressLoop() {
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(() => this._updateProgress(), 500);
  }

  _updateProgress() {
    const fill = this.querySelector('#progress-fill');
    const cur = this.querySelector('#time-current');
    if (!fill || !cur) return;

    const ct = audio.getCurrentTime();
    const dur = audio.getDuration();
    fill.style.width = dur ? `${(ct / dur) * 100}%` : '0%';
    cur.textContent = this._fmt(ct);
  }

  _fmt(sec) {
    if (!sec || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  _render() {
    this._renderPlayer();
    this._renderPlaylist();
    this._updateProgress();
  }

  _renderPlayer() {
    const area = this.querySelector('#music-player-area');
    const idx = audio.getCurrentIndex();
    const playing = audio.isPlaying();
    const playlist = audio.getPlaylist();
    const vol = audio.getVolume();

    const track = idx >= 0 ? playlist[idx] : null;
    const title = track ? track.title : 'Nenhuma musica selecionada';
    const artist = track ? (track.artist || 'Desconhecido') : '';
    const dur = audio.getDuration();

    const playIcon = playing ? 'pause' : 'play';

    area.innerHTML = `
      <div class="music-player-card">
        <div class="music-now-label">Tocando agora</div>
        <div class="music-now-title">${title}</div>
        <div class="music-now-artist">${artist}</div>

        <div class="music-progress-container">
          <span class="music-time" id="time-current">${this._fmt(audio.getCurrentTime())}</span>
          <div class="music-progress-bar" id="progress-bar">
            <div class="music-progress-fill" id="progress-fill"></div>
          </div>
          <span class="music-time" id="time-duration">${this._fmt(dur)}</span>
        </div>

        <div class="music-controls">
          <ion-button fill="clear" class="music-ctrl-btn" id="btn-prev">
            <ion-icon name="play-skip-back" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button fill="clear" class="music-ctrl-btn play-btn" id="btn-play">
            <ion-icon name="${playIcon}" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button fill="clear" class="music-ctrl-btn" id="btn-next">
            <ion-icon name="play-skip-forward" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <div class="music-volume-row">
          <ion-icon name="volume-low"></ion-icon>
          <ion-range class="music-volume-slider" id="volume-slider" min="0" max="100" value="${Math.round(vol * 100)}" />
          <ion-icon name="volume-high"></ion-icon>
        </div>
      </div>
    `;

    // Bind events
    this.querySelector('#btn-play').addEventListener('click', (e) => {
      e.stopPropagation();
      audio.togglePlay();
    });
    this.querySelector('#btn-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      audio.prevTrack();
    });
    this.querySelector('#btn-next').addEventListener('click', (e) => {
      e.stopPropagation();
      audio.nextTrack();
    });

    // Progress bar seek
    const bar = this.querySelector('#progress-bar');
    bar.addEventListener('click', (e) => {
      const rect = bar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audio.seek(pct * audio.getDuration());
    });

    // Volume
    this.querySelector('#volume-slider').addEventListener('ionInput', (e) => {
      audio.setVolume(parseInt(e.detail.value, 10) / 100);
    });
  }

  _renderPlaylist() {
    const area = this.querySelector('#music-playlist-area');
    const playlist = audio.getPlaylist();
    const currentIdx = audio.getCurrentIndex();
    const playing = audio.isPlaying();

    if (playlist.length === 0) {
      area.innerHTML = `
        <div class="music-empty">
          <ion-icon name="musical-notes-outline"></ion-icon>
          <p>Nenhuma musica na playlist</p>
          <p style="font-size:0.78rem;color:#30363d;margin-top:8px;">Adicione arquivos MP3 em<br><code>public/assets/audio/music/</code><br>e edite <code>playlist.json</code></p>
        </div>
      `;
      return;
    }

    const tracksHtml = playlist.map((t, i) => {
      const isActive = i === currentIdx;
      const showEq = isActive && playing;
      return `
        <div class="music-track ${isActive ? 'active' : ''}" data-index="${i}">
          <span class="music-track-num">
            ${showEq
              ? `<span class="music-eq"><span></span><span></span><span></span></span>`
              : (i + 1)}
          </span>
          <div class="music-track-info">
            <p class="music-track-name">${t.title}</p>
            ${t.artist ? `<p class="music-track-artist">${t.artist}</p>` : ''}
          </div>
          <span class="music-track-dur">${t.duration || ''}</span>
        </div>
      `;
    }).join('');

    area.innerHTML = `
      <div class="music-playlist-section">
        <p class="music-playlist-title">Playlist</p>
        ${tracksHtml}
      </div>
    `;

    area.querySelectorAll('.music-track').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        audio.playTrack(idx);
      });
    });
  }
}

customElements.define('music-page', MusicPage);
