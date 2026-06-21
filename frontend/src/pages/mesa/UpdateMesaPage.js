import './UpdateMesaPage.css'
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showAlert, showToast, showLoading } from '../../shared/overlay.js';

const pageName = 'Editar Mesa';

class UpdateMesaPage extends HTMLElement {
  async connectedCallback() {
    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root');
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.mesaId = urlParams.get('id');
    this.classList.add('ion-page');
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content class="ion-padding">
        <form id="form-mesa">
          <ion-list>
            <ion-item>
              <ion-input type="number" name="qtd_cadeiras" id="qtd_cadeiras" label="Quantidade de Cadeiras" label-placement="floating" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>Ativa</ion-label>
              <ion-toggle slot="end" name="status" id="status"></ion-toggle>
            </ion-item>
          </ion-list>
          <div class="ion-padding">
            <ion-button expand="block" type="submit" class="ion-margin-top">Salvar Alterações</ion-button>
            <ion-button expand="block" color="danger" id="btn-cancelar">Cancelar</ion-button>
          </div>
        </form>
      </ion-content>
    `;
    this.querySelector('#form-mesa').addEventListener('submit', (e) => this.handleSubmit(e));
    this.querySelector('#btn-cancelar').addEventListener('click', () => this.navigateBack());
    if (this.mesaId) await this.loadMesaData();
  }

  async loadMesaData() {
    try {
      const mesa = await api.getMesaById(this.mesaId);
      this.querySelector('#qtd_cadeiras').value = mesa.qtd_cadeiras;
      this.querySelector('#status').checked = mesa.status;
    } catch (error) {
      await showAlert({ header: 'Erro', message: 'Não foi possível carregar os dados da mesa.' });
      this.navigateBack();
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mesaData = {
      qtd_cadeiras: parseInt(formData.get('qtd_cadeiras')),
      status: formData.get('status') === 'on'
    };

    try {
      await api.updateMesa(this.mesaId, mesaData);
      this.navigateBack();
    } catch (error) {
      await showAlert({ header: 'Erro', message: 'Não foi possível salvar as alterações.' });
    }
  }

  navigateBack() {
    const router = document.querySelector('ion-router');
    router.push('/mesas', 'root');
  }
}

customElements.define('update-mesa-page', UpdateMesaPage);
