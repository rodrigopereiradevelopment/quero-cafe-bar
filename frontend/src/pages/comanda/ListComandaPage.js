import './ListComandaPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Comandas';
const PAGE_SIZE = 20;

class ListComandaPage extends HTMLElement {
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
        <div class="list-comanda-container"></div>
      </ion-content>
    `;

    this.querySelector('#logout-btn').addEventListener('click', logout);
    this.renderFabButton();
    await this.fetchComandas();

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
    if (window.location.pathname === '/comandas') {
      this.currentPage = 0;
      this.fetchComandas();
    }
  }

  async fetchComandas() {
    const container = this.querySelector('.list-comanda-container');
    this.renderSkeleton(container);

    try {
      const { data: comandas, total } = await api.getComandas(this.currentPage * PAGE_SIZE, PAGE_SIZE);
      this.totalItems = total;
      this.totalPages = Math.ceil(total / PAGE_SIZE);

      const comandasWithDetails = await Promise.all(
        comandas.map(async (comanda) => {
          const itens = await api.getItensComanda(comanda.id);
          const qtdItens = itens.length;
          const valorTotal = itens.reduce((sum, item) => sum + (item.qtd_item * item.valor_venda), 0);
          const todosPagos = itens.length > 0 && itens.every(item => item.statusPg);
          const todosEntregues = itens.length > 0 && itens.every(item => item.statusEntrega);
          return { ...comanda, qtdItens, valorTotal, todosPagos, todosEntregues };
        })
      );
      this.renderComandas(comandasWithDetails, container);
    } catch (error) {
      console.error('Erro ao buscar comandas:', error);
      container.innerHTML = `<p class="ion-text-center text-danger">Erro ao carregar comandas. Tente novamente.</p>`;
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
              <ion-skeleton-text style="width: 80%; height: 0.9rem;"></ion-skeleton-text>
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
      document.querySelector('ion-router').push('/comanda/register', 'root');
    });

    content.appendChild(fab);
  }

  renderComandas(comandas, container) {
    if (comandas.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhuma comanda encontrada.</p>`;
      this.renderPagination(container);
      return;
    }

    const formatCurrency = (value) => {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const comandaItems = comandas.map(comanda => `
      <ion-item>
        <ion-label>
          <h2 style="display: flex; align-items: center; gap: 8px;">
            <ion-icon
              name="${comanda.todosPagos ? 'checkmark-circle' : 'cash-outline'}"
              color="${comanda.todosPagos ? 'success' : 'warning'}"
              style="flex-shrink: 0;"
            ></ion-icon>
            <span>Comanda <span class="font-gothic-sm">#${comanda.id}</span></span>
          </h2>
          <p>Mesa: <span class="font-gothic-sm">${comanda.id_mesa}</span></p>
          <p>Itens: ${comanda.qtdItens} | Total: ${formatCurrency(comanda.valorTotal)}</p>
          <p>
            <ion-icon name="${comanda.todosPagos ? 'checkmark-circle' : 'close-circle'}" color="${comanda.todosPagos ? 'success' : 'danger'}"></ion-icon>
            <span style="margin-left: 4px;">${comanda.todosPagos ? 'Pago' : 'Nao Pago'}</span>
            <ion-icon name="${comanda.todosEntregues ? 'checkmark-circle' : 'close-circle'}" color="${comanda.todosEntregues ? 'success' : 'danger'}" style="margin-left: 12px;"></ion-icon>
            <span style="margin-left: 4px;">${comanda.todosEntregues ? 'Entregue' : 'Nao Entregue'}</span>
          </p>
        </ion-label>

        <ion-buttons slot="end">
          <ion-button fill="clear" class="btn-edit" data-id="${comanda.id}">
            <ion-icon slot="icon-only" name="create-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="danger" class="btn-delete" data-id="${comanda.id}">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
    `).join('');

    container.innerHTML = `
      <ion-list>${comandaItems}</ion-list>
    `;

    this.bindEvents(container);
    this.renderPagination(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const router = document.querySelector('ion-router');
        router.push(`/comanda/edit?id=${id}`);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        await showAlert({
          header: 'Confirmar',
          message: 'Deseja realmente excluir esta comanda?',
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
              handler: async () => {
                try {
                  await api.deleteComanda(id);
                  showToast({ message: 'Comanda excluida com sucesso!', color: 'success', duration: 2000 });
                  await this.fetchComandas();
                } catch (error) {
                  console.error('Erro ao excluir:', error);
                  showToast({ message: 'Erro ao excluir comanda. Tente novamente.', color: 'danger', duration: 3000 });
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
          this.fetchComandas();
        }
      });
    });
  }
}

customElements.define('list-comanda-page', ListComandaPage);