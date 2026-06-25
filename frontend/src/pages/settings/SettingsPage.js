import './SettingsPage.css'
import { createHeader } from '../../shared/Header.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';
import { logout } from '../../shared/util.js';

const pageName = 'Configuracoes';

class SettingsPage extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root');
      return;
    }

    this.classList.add('ion-page');
    this.settings = this.loadSettings();

    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content>
        <div class="settings-container">
          <div class="settings-header">
            <h2>Configuracoes</h2>
            <p>Personalize sua experiencia</p>
          </div>

          <!-- Acessibilidade -->
          <div class="settings-section">
            <p class="settings-section-title">Acessibilidade</p>
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="text-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Tamanho da Fonte</h3>
                      <p>Ajuste o tamanho de tudo (texto, botoes, imagens)</p>
                    </div>
                  </div>
                  <div class="font-size-presets" id="font-size-presets">
                    <ion-button fill="clear" size="small" class="font-preset-btn ${this.settings.fontSize === 85 ? 'active' : ''}" data-size="85">
                      <span class="preset-label">Pequena</span>
                    </ion-button>
                    <ion-button fill="clear" size="small" class="font-preset-btn ${this.settings.fontSize === 100 ? 'active' : ''}" data-size="100">
                      <span class="preset-label">Media</span>
                    </ion-button>
                    <ion-button fill="clear" size="small" class="font-preset-btn ${this.settings.fontSize === 120 ? 'active' : ''}" data-size="120">
                      <span class="preset-label">Grande</span>
                    </ion-button>
                    <ion-button fill="clear" size="small" class="font-preset-btn ${this.settings.fontSize === 140 ? 'active' : ''}" data-size="140">
                      <span class="preset-label">Extra</span>
                    </ion-button>
                  </div>
                </div>

                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="contrast-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Alto Contraste</h3>
                      <p>Aumenta o contraste do texto</p>
                    </div>
                  </div>
                  <ion-toggle id="toggle-high-contrast" checked="${this.settings.highContrast}"></ion-toggle>
                </div>

                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="accessibility-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Reduzir Animacoes</h3>
                      <p>Desativa animacoes de transicao</p>
                    </div>
                  </div>
                  <ion-toggle id="toggle-reduce-motion" checked="${this.settings.reduceMotion}"></ion-toggle>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Aparência -->
          <div class="settings-section">
            <p class="settings-section-title">Aparencia</p>
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="moon-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Modo Escuro</h3>
                      <p>Tema escuro (padrao)</p>
                    </div>
                  </div>
                  <ion-toggle id="toggle-dark-mode" checked="${this.settings.darkMode}"></ion-toggle>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Notificacoes -->
          <div class="settings-section">
            <p class="settings-section-title">Notificacoes</p>
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="notifications-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Notificacoes Push</h3>
                      <p>Receba alertas de novos pedidos</p>
                    </div>
                  </div>
                  <ion-toggle id="toggle-notifications" checked="${this.settings.notifications}"></ion-toggle>
                </div>

                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="volume-high-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Sons</h3>
                      <p>Reproduzir sons ao receber pedido</p>
                    </div>
                  </div>
                  <ion-toggle id="toggle-sounds" checked="${this.settings.sounds}"></ion-toggle>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Idioma -->
          <div class="settings-section">
            <p class="settings-section-title">Idioma</p>
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="language-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Idioma do Sistema</h3>
                      <p>Selecione o idioma</p>
                    </div>
                  </div>
                  <ion-select id="select-language" value="${this.settings.language}" interface="popover" style="max-width: 140px;">
                    <ion-select-option value="pt-BR">Portugues</ion-select-option>
                    <ion-select-option value="en">English</ion-select-option>
                    <ion-select-option value="es">Espanol</ion-select-option>
                  </ion-select>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Conta -->
          <div class="settings-section">
            <p class="settings-section-title">Conta</p>
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item" style="cursor: pointer;" id="btn-profile">
                  <div class="settings-item-left">
                    <ion-icon name="person-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Meu Perfil</h3>
                      <p>Editar dados pessoais e senha</p>
                    </div>
                  </div>
                  <ion-icon name="chevron-forward-outline" style="color: #8b949e;"></ion-icon>
                </div>

                <div class="settings-item" style="cursor: pointer;" id="btn-logout">
                  <div class="settings-item-left">
                    <ion-icon name="log-out-outline" style="color: #f85149;"></ion-icon>
                    <div class="settings-item-text">
                      <h3 style="color: #f85149;">Sair da Conta</h3>
                    </div>
                  </div>
                  <ion-icon name="chevron-forward-outline" style="color: #8b949e;"></ion-icon>
                </div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Sobre -->
          <div class="settings-section" style="padding-bottom: 32px;">
            <ion-card class="settings-card">
              <ion-card-content>
                <div class="settings-item">
                  <div class="settings-item-left">
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <div class="settings-item-text">
                      <h3>Quero Cafe Bar</h3>
                      <p>Versao 1.0.0</p>
                    </div>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </ion-content>
    `;

    this.bindEvents();
    this.applySettings();
  }

  loadSettings() {
    const defaults = {
      fontSize: 100,
      highContrast: false,
      reduceMotion: false,
      darkMode: true,
      notifications: true,
      sounds: true,
      language: 'pt-BR',
    };
    try {
      const saved = localStorage.getItem('app_settings');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  }

  saveSettings() {
    localStorage.setItem('app_settings', JSON.stringify(this.settings));
  }

  bindEvents() {
    // Font size presets
    this.querySelectorAll('.font-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = parseInt(btn.dataset.size, 10);
        this.settings.fontSize = size;
        this.saveSettings();
        this.applySettings();
        this.updateFontPresetButtons();
      });
    });

    // Toggles
    this.querySelector('#toggle-high-contrast').addEventListener('ionChange', (e) => {
      this.settings.highContrast = e.detail.checked;
      this.saveSettings();
      this.applySettings();
    });

    this.querySelector('#toggle-reduce-motion').addEventListener('ionChange', (e) => {
      this.settings.reduceMotion = e.detail.checked;
      this.saveSettings();
      this.applySettings();
    });

    this.querySelector('#toggle-dark-mode').addEventListener('ionChange', (e) => {
      this.settings.darkMode = e.detail.checked;
      this.saveSettings();
      this.applySettings();
    });

    this.querySelector('#toggle-notifications').addEventListener('ionChange', (e) => {
      this.settings.notifications = e.detail.checked;
      this.saveSettings();
    });

    this.querySelector('#toggle-sounds').addEventListener('ionChange', (e) => {
      this.settings.sounds = e.detail.checked;
      this.saveSettings();
    });

    this.querySelector('#select-language').addEventListener('ionChange', (e) => {
      this.settings.language = e.detail.value;
      this.saveSettings();
      showToast({ message: `Idioma alterado para ${e.detail.value}`, color: 'success' });
    });

    this.updateFontPresetButtons();

    // Profile navigation
    this.querySelector('#btn-profile').addEventListener('click', () => {
      document.querySelector('ion-router').push('/profile', 'root');
    });

    // Logout
    this.querySelector('#btn-logout').addEventListener('click', async () => {
      await showAlert({
        header: 'Sair',
        message: 'Deseja realmente sair da conta?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Sair',
            handler: () => logout()
          }
        ]
      });
    });
  }

  applySettings() {
    const root = document.documentElement;

    // Font size - escala global via CSS custom property (afeta rem units)
    const scale = this.settings.fontSize / 100;
    root.style.setProperty('--app-font-scale', scale);
    root.style.fontSize = `${this.settings.fontSize}%`;

    // High contrast
    if (this.settings.highContrast) {
      root.style.setProperty('--ion-text-color', '#ffffff');
      root.style.setProperty('--ion-text-color-secondary', '#b0b8c1');
      root.style.setProperty('--ion-background-color', '#000000');
      root.style.setProperty('--ion-color-dark', '#000000');
      document.body.classList.add('high-contrast');
    } else {
      root.style.setProperty('--ion-text-color', '#e6edf3');
      root.style.setProperty('--ion-text-color-secondary', '#8b949e');
      root.style.setProperty('--ion-background-color', '#0d1117');
      root.style.setProperty('--ion-color-dark', '#0d1117');
      document.body.classList.remove('high-contrast');
    }

    // Reduce motion
    if (this.settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }

  updateFontPresetButtons() {
    this.querySelectorAll('.font-preset-btn').forEach(btn => {
      const size = parseInt(btn.dataset.size, 10);
      if (size === this.settings.fontSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

customElements.define('settings-page', SettingsPage);
