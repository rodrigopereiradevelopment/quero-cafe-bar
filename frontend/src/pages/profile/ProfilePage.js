import './ProfilePage.css'
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { getUser, isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Meu Perfil';

class ProfilePage extends HTMLElement {
  async connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root');
      return;
    }

    this.classList.add('ion-page');
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content>
        <div class="profile-container">
          <div class="profile-avatar-section">
            <div class="profile-avatar" id="avatar-container">
              <ion-icon name="person"></ion-icon>
              <label class="profile-avatar-edit" for="photo-input">
                <ion-icon name="camera"></ion-icon>
              </label>
              <input type="file" id="photo-input" class="photo-input" accept="image/*">
            </div>
            <h2 class="profile-name" id="profile-name">Carregando...</h2>
            <p class="profile-username" id="profile-username"></p>
            <span class="profile-role-badge" id="profile-role"></span>
          </div>

          <!-- Dados Pessoais -->
          <div class="profile-section">
            <p class="profile-section-title">Dados Pessoais</p>
            <ion-card>
              <ion-card-content>
                <ion-list lines="none">
                  <ion-item>
                    <ion-icon name="person-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="text" name="nome" id="input-nome" label="Nome Completo" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="at-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="text" name="usuario" id="input-usuario" label="Nome de Usuario" label-placement="floating" readonly style="--color: #8b949e;"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="call-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="tel" name="telefone" id="input-telefone" label="Telefone" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="card-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="text" name="cpf" id="input-cpf" label="CPF" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="calendar-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="date" name="data_nascimento" id="input-data-nascimento" label="Data de Nascimento" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="location-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="text" name="endereco" id="input-endereco" label="Endereco" label-placement="floating"></ion-input>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Trocar Senha -->
          <div class="profile-section password-section">
            <p class="profile-section-title">Seguranca</p>
            <ion-card>
              <ion-card-content>
                <ion-list lines="none">
                  <ion-item>
                    <ion-icon name="lock-closed-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="password" id="input-senha-atual" label="Senha Atual" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="lock-open-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="password" id="input-nova-senha" label="Nova Senha" label-placement="floating"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="shield-checkmark-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-input type="password" id="input-confirmar-senha" label="Confirmar Nova Senha" label-placement="floating"></ion-input>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Acoes -->
          <div class="profile-actions">
            <ion-button expand="block" color="primary" id="btn-save-profile">
              <ion-icon name="checkmark-circle" slot="start"></ion-icon>
              Salvar Dados
            </ion-button>
            <ion-button expand="block" color="secondary" id="btn-change-password">
              <ion-icon name="key" slot="start"></ion-icon>
              Trocar Senha
            </ion-button>
          </div>
        </div>
      </ion-content>
    `;

    this.querySelector('#btn-save-profile').addEventListener('click', () => this.saveProfile());
    this.querySelector('#btn-change-password').addEventListener('click', () => this.changePassword());
    this.querySelector('#photo-input').addEventListener('change', (e) => this.handlePhotoUpload(e));

    await this.loadProfile();
  }

  async loadProfile() {
    const loading = showLoading('Carregando perfil...');
    try {
      const user = getUser();
      if (!user || !user.id) {
        await showAlert({ header: 'Erro', message: 'Usuario nao encontrado. Faca login novamente.' });
        return;
      }

      const usuario = await api.getUsuarioById(user.id);
      this.renderProfile(usuario);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      await showAlert({ header: 'Erro', message: 'Nao foi possivel carregar o perfil.' });
    } finally {
      await loading.dismiss();
    }
  }

  renderProfile(usuario) {
    this.querySelector('#profile-name').textContent = usuario.nome;
    this.querySelector('#profile-username').textContent = `@${usuario.usuario}`;

    const roleBadge = this.querySelector('#profile-role');
    const roles = { 0: 'Administrador', 1: 'Atendente', 2: 'Cliente', 3: 'Barista', 4: 'Cozinheiro' };
    const colors = { 0: 'primary', 1: 'secondary', 2: 'success', 3: 'warning', 4: 'danger' };
    roleBadge.textContent = roles[usuario.perfil] || 'Usuario';
    roleBadge.color = colors[usuario.perfil] || 'medium';

    this.querySelector('#input-nome').value = usuario.nome || '';
    this.querySelector('#input-usuario').value = usuario.usuario || '';
    this.querySelector('#input-telefone').value = usuario.telefone || '';
    this.querySelector('#input-cpf').value = usuario.cpf || '';
    this.querySelector('#input-endereco').value = usuario.endereco || '';
    this.querySelector('#input-data-nascimento').value = usuario.data_nascimento || '';

    if (usuario.foto) {
      const avatarContainer = this.querySelector('#avatar-container');
      avatarContainer.innerHTML = `<img src="${usuario.foto}" alt="Foto de perfil">
        <label class="profile-avatar-edit" for="photo-input">
          <ion-icon name="camera"></ion-icon>
        </label>`;
    }
  }

  async saveProfile() {
    const user = getUser();
    if (!user || !user.id) return;

    const loading = showLoading('Salvando...');
    try {
      const profileData = {
        nome: this.querySelector('#input-nome').value,
        telefone: this.querySelector('#input-telefone').value,
        cpf: this.querySelector('#input-cpf').value,
        endereco: this.querySelector('#input-endereco').value,
        data_nascimento: this.querySelector('#input-data-nascimento').value,
      };

      await api.updateUsuario(user.id, profileData);

      // Update localStorage user data
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      showToast({ message: 'Perfil atualizado com sucesso!', color: 'success' });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      await showAlert({ header: 'Erro', message: 'Nao foi possivel salvar o perfil.' });
    } finally {
      await loading.dismiss();
    }
  }

  async changePassword() {
    const user = getUser();
    if (!user || !user.id) return;

    const senhaAtual = this.querySelector('#input-senha-atual').value;
    const novaSenha = this.querySelector('#input-nova-senha').value;
    const confirmarSenha = this.querySelector('#input-confirmar-senha').value;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      await showAlert({ header: 'Atencao', message: 'Preencha todos os campos de senha.' });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      await showAlert({ header: 'Atencao', message: 'As senhas nao conferem.' });
      return;
    }

    if (novaSenha.length < 4) {
      await showAlert({ header: 'Atencao', message: 'A nova senha deve ter pelo menos 4 caracteres.' });
      return;
    }

    const loading = showLoading('Alterando senha...');
    try {
      await api.changePassword(user.id, senhaAtual, novaSenha);
      showToast({ message: 'Senha alterada com sucesso!', color: 'success' });

      // Clear password fields
      this.querySelector('#input-senha-atual').value = '';
      this.querySelector('#input-nova-senha').value = '';
      this.querySelector('#input-confirmar-senha').value = '';
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
      const msg = error.message || 'Nao foi possivel alterar a senha.';
      await showAlert({ header: 'Erro', message: msg });
    } finally {
      await loading.dismiss();
    }
  }

  async handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      await showAlert({ header: 'Atencao', message: 'A imagem deve ter no maximo 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      const avatarContainer = this.querySelector('#avatar-container');
      avatarContainer.innerHTML = `<img src="${base64}" alt="Foto de perfil">
        <label class="profile-avatar-edit" for="photo-input">
          <ion-icon name="camera"></ion-icon>
        </label>`;

      const user = getUser();
      if (user && user.id) {
        try {
          await api.updateUsuario(user.id, { foto: base64 });
          const updatedUser = { ...user, foto: base64 };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          showToast({ message: 'Foto atualizada!', color: 'success' });
        } catch (error) {
          console.error('Erro ao salvar foto:', error);
        }
      }
    };
    reader.readAsDataURL(file);
  }
}

customElements.define('profile-page', ProfilePage);
