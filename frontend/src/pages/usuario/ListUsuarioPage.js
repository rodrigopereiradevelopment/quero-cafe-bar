import './ListUsuarioPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';
import { isAuthenticated } from '../../shared/auth.js';

const pageName = 'Usuários';
const PAGE_SIZE = 20;

class ListUsuarioPage extends HTMLElement {
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
        <div class="list-usuario-container"></div>
      </ion-content>
    `;

    this.querySelector('#logout-btn').addEventListener('click', logout);
    this.renderFabButton();
    await this.fetchUsuarios();

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
    if (window.location.pathname === '/usuarios') {
      this.currentPage = 0;
      this.fetchUsuarios();
    }
  }

  async fetchUsuarios() {
    const container = this.querySelector('.list-usuario-container');
    this.renderSkeleton(container);

    try {
      const { data: usuarios, total } = await api.getUsuarios(this.currentPage * PAGE_SIZE, PAGE_SIZE);
      this.totalItems = total;
      this.totalPages = Math.ceil(total / PAGE_SIZE);
      this.renderUsuarios(usuarios, container);
    } catch (error) {
      console.error('Erro ao buscar usuarios:', error);
      container.innerHTML = `<p class="ion-text-center text-danger">Erro ao carregar usuarios. Tente novamente.</p>`;
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

    fab.innerHTML = `
      <ion-fab-button>
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    `;

    fab.addEventListener('click', () => {
      document.querySelector('ion-router').push('/usuario/register', 'root');
    });

    content.appendChild(fab);
  }

  getPerfilIcon(perfil) {
    const icons = { 0: 'restaurant', 1: 'person', 2: 'person-circle', 3: 'beer', 4: 'flame' };
    return icons[perfil] || 'person';
  }

  getPerfilColor(perfil) {
    const colors = { 0: 'primary', 1: 'secondary', 2: 'success', 3: 'warning', 4: 'danger' };
    return colors[perfil] || 'secondary';
  }

  renderUsuarios(usuarios, container) {
    if (usuarios.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhum usuario encontrado.</p>`;
      this.renderPagination(container);
      return;
    }

    const userItems = usuarios.map(usuario => `
      <ion-item>
        <ion-label>
          <h2 style="display: flex; align-items: center; gap: 8px;">
            <ion-icon
              name="${this.getPerfilIcon(usuario.perfil)}"
              color="${this.getPerfilColor(usuario.perfil)}"
              style="flex-shrink: 0;"
            ></ion-icon>
            <span>${usuario.nome}</span>
          </h2>
          <p>${usuario.usuario}</p>
        </ion-label>

        <ion-buttons slot="end">
          <ion-button fill="clear" class="btn-edit" data-id="${usuario.id}">
            <ion-icon slot="icon-only" name="create-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="danger" class="btn-delete" data-id="${usuario.id}">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
    `).join('');

    container.innerHTML = `
      <ion-list>${userItems}</ion-list>
    `;

    this.bindEvents(container);
    this.renderPagination(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const router = document.querySelector('ion-router');
        router.push(`/usuario/edit?id=${id}`);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        await showAlert({
          header: 'Confirmar',
          message: 'Deseja realmente excluir este usuario?',
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
              handler: async () => {
                try {
                  await api.deleteUsuario(id);
                  showToast({ message: 'Usuario excluido com sucesso!', duration: 2000, color: 'success' });
                  await this.fetchUsuarios();
                } catch (error) {
                  console.error('Erro ao excluir:', error);
                  showToast({ message: 'Erro ao excluir usuario. Tente novamente.', duration: 3000, color: 'danger' });
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
          this.fetchUsuarios();
        }
      });
    });
  }
}

customElements.define('list-usuario-page', ListUsuarioPage);