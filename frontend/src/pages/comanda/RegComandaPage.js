import './RegComandaPage.css';
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showAlert, showToast, showLoading } from '../../shared/overlay.js';

const pageName = 'Abrir Comanda';

class RegComandaPage extends HTMLElement {
  async connectedCallback() {
    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root');
      return;
    }
    this.classList.add('ion-page');
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content class="ion-padding">
        <form id="form-comanda">
          <ion-list>
            <ion-item>
              <ion-select name="id_mesa" id="id_mesa" label="Selecionar Mesa" label-placement="floating" required>
                <div slot="label">Selecionar Mesa</div>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-input type="text" name="obs_comanda" id="obs_comanda" label="Observação" label-placement="floating"></ion-input>
            </ion-item>
          </ion-list>

          <div class="ion-padding">
            <ion-button expand="block" type="submit" class="ion-margin-top">
              <ion-icon name="checkmark-circle" style="margin-right: 8px;"></ion-icon>
              Abrir Comanda
            </ion-button>
            <ion-button expand="block" color="danger" id="btn-cancelar">
              <ion-icon name="close-circle" style="margin-right: 8px;"></ion-icon>
              Cancelar
            </ion-button>
          </div>
        </form>
      </ion-content>
    `;

    this.querySelector('#form-comanda').addEventListener('submit', (e) => this.handleSubmit(e));
    this.querySelector('#btn-cancelar').addEventListener('click', () => this.navigateBack());

    await this.loadMesas();
  }

  async loadMesas() {
    try {
      const mesas = await api.getMesas();
      const select = this.querySelector('#id_mesa');
      mesas.forEach(mesa => {
        if (mesa.status) {
          const option = document.createElement('ion-select-option');
          option.value = mesa.id;
          option.textContent = `Mesa #${mesa.id} (${mesa.qtd_cadeiras} cadeiras)`;
          select.appendChild(option);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
      showToast({ message: 'Erro ao carregar lista de mesas.', color: 'danger' });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const comandaData = {
      id_mesa: parseInt(formData.get('id_mesa')),
      obs_comanda: formData.get('obs_comanda') || undefined,
    };

    try {
      await api.addComanda(comandaData);
      this.navigateBack();
    } catch (error) {
      console.error('Erro ao abrir comanda:', error);
      await showAlert({ header: 'Erro', message: 'Não foi possível abrir a comanda. Tente novamente mais tarde.' });
    }
  }

  navigateBack() {
    const router = document.querySelector('ion-router');
    router.push('/comandas', 'root');
  }
}

customElements.define('reg-comanda-page', RegComandaPage);