import './LoginPage.css'
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { login as authLogin } from '../../shared/auth.js';
import { showToast, showLoading } from '../../shared/overlay.js';
import { audio } from '../../services/audio.js';

const pageName = 'Login';

class LoginPage extends HTMLElement {
  connectedCallback() {
    this.classList.add('ion-page');
    audio.stopStarWarsTheme();
    audio.playStarWarsTheme();
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content>
          <div class="login-container">
              <ion-card>
              <ion-card-header>
                  <ion-card-title style="font-family: 'UnifrakturMaguntia', cursive; font-size: 1.6rem; color: #e2b714; text-align: center;">Acessar</ion-card-title>
              </ion-card-header>

              <ion-card-content>
                  <ion-item counter="true">
                  <ion-icon slot="start" name="person"></ion-icon>
                  <ion-input type="text" id="user-input" placeholder="Usuário"></ion-input>
                  </ion-item>

                  <ion-item>
                  <ion-icon slot="start" name="lock-closed"></ion-icon>
                  <ion-input type="password" id="password-input" placeholder="Senha">
                      <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                  </ion-input>
                  </ion-item>

                  <ion-button expand="block" id="login-btn" class="ion-margin-top">
                  Entrar
                  </ion-button>
              </ion-card-content>
              </ion-card>
          </div>
      </ion-content>
    `;

    // Referências e Lógica (Movido para dentro do componente)
    const userInput = this.querySelector('#user-input');
    const passwordInput = this.querySelector('#password-input');
    const loginBtn = this.querySelector('#login-btn');

    loginBtn.addEventListener('click', async () => {
      const usuario = userInput.value?.trim();
      const senha = passwordInput.value?.trim();

      if (!usuario || !senha) {
        await showToast({ message: 'Informe usuário e senha para acessar.', color: 'warning' });
        return;
      }

      const loading = showLoading('Autenticando...');

      try {
        const response = await api.login(usuario, senha);
        authLogin(response.access_token, response.user);
        api.setToken(response.access_token);

        showToast({ message: 'Login realizado com sucesso!', color: 'success' });
        audio.stopStarWarsTheme();
        document.querySelector('ion-router').push('/home', 'forward', 'replace');
      } catch (error) {
        const mensagem =
          error.message === 'Failed to fetch'
            ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
            : error.message || 'Usuário ou senha inválidos.';
        showToast({ message: mensagem });
        passwordInput.value = '';
      } finally {
        await loading.dismiss();
      }
    });

    // Função para exibir alertas (Toast)
    async function presentToast(message, color = 'danger') {
        const toast = document.createElement('ion-toast');
        toast.message = message;
        toast.duration = 2000;
        toast.color = color;
        toast.position = 'bottom';

        document.body.appendChild(toast);
        return toast.present();
    }
  }
  disconnectedCallback() {
    audio.stopStarWarsTheme();
  }
}

customElements.define('login-page', LoginPage);