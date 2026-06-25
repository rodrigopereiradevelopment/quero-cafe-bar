import './ListMesaPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Mesas';
const PAGE_SIZE = 20;

class ListMesaPage extends HTMLElement {
  constructor() {
    super();
    this.currentPage = 0;
    this.totalItems = 0;
    this.totalPages = 0;
  }

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
      this.currentPage = 0;
      this.fetchMesas();
    }
  }

  async fetchMesas() {
    const container = this.querySelector('.list-mesa-container');
    this.renderSkeleton(container);

    try {
      const { data: mesas, total } = await api.getMesas(this.currentPage * PAGE_SIZE, PAGE_SIZE);
      this.totalItems = total;
      this.totalPages = Math.ceil(total / PAGE_SIZE);
      this.renderMesas(mesas, container);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      container.innerHTML = `<p class="ion-text-center text-danger">Erro ao carregar mesas. Tente novamente.</p>`;
    }
  }

  renderSkeleton(container) {
    container.innerHTML = `
      <ion-list>
        ${Array(5).fill(0).map(() => `
          <ion-item class="skeleton-item">
            <ion-skeleton-text slot="start" style="width: 48px; height: 48px; border-radius: 50%;"></ion-skeleton-text>
            <ion-label>
              <ion-skeleton-text style="width: 60%; height: 1.2rem; margin-bottom: 0.5rem;"></ion-skeleton-text>
              <ion-skeleton-text style="width: 40%; height: 0.9rem;"></ion-skeleton-text>
            </ion-label>
            <ion-skeleton-text slot="end" style="width: 80px; height: 2rem;"></ion-skeleton-text>
          </ion-item>
        `).join('')}
      </ion-list>
    `;
  }

  renderFabButton() {
    const content = this.querySelector('ion-content');
    if (content.querySelector('ion-fab')) return;

    const fab = document.createElement('ion-fab');
    fab.vertical = 'bottom';
    fab.horizontal = 'end';
    fab.slot = 'fixed';
    fab.innerHTML = `<ion-fab-button><ion-icon name="add"></ion-icon></ion-fab-button>`;
    fab.addEventListener('click', () => { document.querySelector('ion-router').push('/mesa/register', 'root'); });
    content.appendChild(fab);
  }

  renderMesas(mesas, container) {
    if (mesas.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhuma mesa encontrada.</p>`;
      this.renderPagination(container);
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
    this.bindEvents(container);
    this.renderPagination(container);
  }

  bindEvents(container) {
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
                  showToast({ message: 'Mesa excluida com sucesso!', color: 'success', duration: 2000 });
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

  renderPagination(container) {
    if (this.totalPages <= 1) return;

    const paginationHtml = `
      <div class="pagination">
        <ion-button fill="clear" class="btn-page" data-page="${this.currentPage - 1}" ${this.currentPage === 0 ? 'disabled' : ''}>
          <ion-icon name="chevron-back-outline" slot="icon-only"></ion-icon>
        </ion-button>
        <span class="page-info">${this.currentPage + 1} / ${this.totalPages} (${this.totalItems} itens)</span>
        <ion-button fill="clear" class="btn-page" data-page="${this.currentPage + 1}" ${this.currentPage >= this.totalPages - 1 ? 'disabled' : ''}>
          <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    `;

    const paginationEl = document.createElement('div');
    paginationEl.innerHTML = paginationHtml;
    container.appendChild(paginationEl);

    paginationEl.querySelectorAll('.btn-page').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page, 10);
        if (page >= 0 && page < this.totalPages) {
          this.currentPage = page;
          this.fetchMesas();
        }
      });
    });
  }
}

customElements.define('list-mesa-page', ListMesaPage);