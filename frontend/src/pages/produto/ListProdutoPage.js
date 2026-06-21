import './ListProdutoPage.css'
import { createHeader } from '../../shared/Header.js';
import { logout } from '../../shared/util.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';
import { showLoading, showAlert, showToast } from '../../shared/overlay.js';

const pageName = 'Produtos';

class ListProdutoPage extends HTMLElement {
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
      this.fetchProdutos();
    }
  }

  async fetchProdutos() {
    const container = this.querySelector('.list-produto-container');
    const loading = showLoading('Buscando produtos...');

    try {
      const produtos = await api.getProdutos();
      this.renderProdutos(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      await showAlert({ header: 'Erro', message: 'Não foi possível carregar os produtos. Tente novamente mais tarde.' });
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


  renderProdutos(produtos) {
    const container = this.querySelector('.list-produto-container');
    if (produtos.length === 0) {
      container.innerHTML = `<p class="ion-text-center">Nenhum produto encontrado.</p>`;
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
          <p>${formatCurrency(produto.valor_unit)}</p>
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

    // Adiciona eventos para os botões de edição
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const router = document.querySelector('ion-router');
        router.push(`/produto/edit?id=${id}`);
      });
    });

    // Adiciona eventos para os botões de exclusão
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
                    showToast({ message: 'Produto excluído com sucesso!', color: 'success' });
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
}

customElements.define('list-produto-page', ListProdutoPage);