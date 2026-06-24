import './ListMesaPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Mesas';

class ListMesaPage extends HTMLElement {
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
        <div class="list-mesa-container"></div>
      </ion-content>
    `;

    this.querySelector('#logout-btn').addEventListener('click', logout);
    this.renderFabButton();
    await this.fetchMesas();

    window.addEventListener('popstate', () => this.onRouteChange());
    this._routeListener = () => this.onRouteChange();
    document.querySelector('ion-router').addEventListener('urlChanged', this._routeListener);
  }

  disconnectedCallback() {
    if (this._routeListener) {
      document.querySelector('ion-router').removeEventListener('urlChanged', this._routeListener);
    }
  }

  onRouteChange() {
    if (window.location.pathname === '/mesas') {
      this.fetchMesas();
    }
  }

  async fetchMesas() {
    const loading = showLoading('Buscando mesas...');

    try {
      const { data: mesas } = await api.getMesas();
      this.renderMesas(mesas);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      await showAlert({ header: 'Erro', message: 'Não foi possível carregar as mesas.' });
    } finally {
      await loading.dismiss();
    }
  }

  renderFabButton() {
    const content = this.querySelector('ion-content');
    const fab = document.createElement('ion-fab');
    fab.vertical = 'bottom';
    fab.horizontal = 'end';
    fab.slot = 'fixed';
    fab.innerHTML = `<ion-fab-button><ion-icon name="add"></ion-icon></ion-fab-button>`;
    fab.addEventListener('click', () => { document.querySelector('ion-router').push('/mesa/register', 'root'); });
    content.appendChild(fab);
  }

  renderMesas(mesas) {
    const container = this.querySelector('.list-mesa-container');
    if (mesas.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhuma mesa encontrada.</p>`;
      return;
    }

    const mesaItems = mesas.map(mesa => `
      <ion-item>
        <ion-label>
          <h2 style="display: flex; align-items: center; gap: 8px;">
            <ion-icon
              name="${mesa.status ? 'checkmark-circle' : 'close-circle'}"
              color="${mesa.status ? 'success' : 'danger'}"
            ></ion-icon>
            <span>Mesa <span class="font-gothic-sm">#${mesa.id}</span></span>
          </h2>
          <p>Cadeiras: ${mesa.qtd_cadeiras}</p>
        </ion-label>
        <ion-buttons slot="end">
          <ion-button fill="clear" class="btn-edit" data-id="${mesa.id}">
            <ion-icon slot="icon-only" name="create-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="danger" class="btn-delete" data-id="${mesa.id}">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
    `).join('');

    container.innerHTML = `<ion-list>${mesaItems}</ion-list>`;

    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        document.querySelector('ion-router').push(`/mesa/edit?id=${id}`);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await showAlert({
          header: 'Confirmar',
          message: 'Deseja realmente excluir esta mesa?',
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
                handler: async () => {
                  try {
                    await api.deleteMesa(id);
                    showToast({ message: 'Mesa excluída com sucesso!', color: 'success', duration: 2000 });
                    await this.fetchMesas();
                  } catch (error) {
                    console.error('Erro ao excluir:', error);
                    showToast({ message: 'Erro ao excluir mesa. Tente novamente.', color: 'danger', duration: 3000 });
                  }
              }
            }
          ]
        });
      });
    });
  }
}

customElements.define('list-mesa-page', ListMesaPage);
