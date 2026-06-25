import './ListProdutoPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Produtos';
const PAGE_SIZE = 20;

class ListProdutoPage extends HTMLElement {
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
        <div class="list-produto-container"></div>
      </ion-content>
    `;

    this.querySelector('#logout-btn').addEventListener('click', logout);
    this.renderFabButton();
    await this.fetchProdutos();

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
    if (window.location.pathname === '/produtos') {
      this.currentPage = 0;
      this.fetchProdutos();
    }
  }

  async fetchProdutos() {
    const container = this.querySelector('.list-produto-container');
    this.renderSkeleton(container);

    try {
      const { data: produtos, total } = await api.getProdutos(this.currentPage * PAGE_SIZE, PAGE_SIZE);
      this.totalItems = total;
      this.totalPages = Math.ceil(total / PAGE_SIZE);
      this.renderProdutos(produtos, container);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      container.innerHTML = `<p class="ion-text-center text-danger">Erro ao carregar produtos. Tente novamente.</p>`;
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
      document.querySelector('ion-router').push('/produto/register', 'root');
    });

    content.appendChild(fab);
  }

  renderProdutos(produtos, container) {
    if (produtos.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhum produto encontrado.</p>`;
      this.renderPagination(container);
      return;
    }

    const formatCurrency = (value) => {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const productItems = produtos.map(produto => `
      <ion-item>
        ${produto.imagem ? `
        <ion-thumbnail slot="start">
          <img src="${produto.imagem}" alt="${produto.dsc_produto}" style="object-fit:cover" />
        </ion-thumbnail>
        ` : ''}
        <ion-label>
          <h2 style="display: flex; align-items: center; gap: 8px;">
            <ion-icon
              name="${produto.status ? 'checkmark-circle' : 'close-circle'}"
              color="${produto.status ? 'success' : 'danger'}"
              style="flex-shrink: 0;"
            ></ion-icon>
            <span>${produto.dsc_produto}</span>
          </h2>
          <p>${formatCurrency(produto.valor_unit)}${produto.categoria ? ` · <ion-badge color="medium" style="font-size: 0.7rem; vertical-align: middle;">${produto.categoria}</ion-badge>` : ''}</p>
        </ion-label>

        <ion-buttons slot="end">
          <ion-button fill="clear" class="btn-edit" data-id="${produto.id}">
            <ion-icon slot="icon-only" name="create-outline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" color="danger" class="btn-delete" data-id="${produto.id}">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
    `).join('');

    container.innerHTML = `
      <ion-list>${productItems}</ion-list>
    `;

    this.bindEvents(container);
    this.renderPagination(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const router = document.querySelector('ion-router');
        router.push(`/produto/edit?id=${id}`);
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        await showAlert({
          header: 'Confirmar',
          message: 'Deseja realmente excluir este produto?',
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
              handler: async () => {
                try {
                  await api.deleteProduto(id);
                  showToast({ message: 'Produto excluido com sucesso!', color: 'success' });
                  await this.fetchProdutos();
                } catch (error) {
                  console.error('Erro ao excluir:', error);
                  showToast({ message: 'Erro ao excluir produto. Tente novamente.', color: 'danger', duration: 3000 });
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
          this.fetchProdutos();
        }
      });
    });
  }
}

customElements.define('list-produto-page', ListProdutoPage);