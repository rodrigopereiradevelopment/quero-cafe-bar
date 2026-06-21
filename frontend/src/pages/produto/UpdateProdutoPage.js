import './UpdateProdutoPage.css';
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { isAuthenticated } from '../../shared/auth.js';

const pageName = 'Editar Produto';

class UpdateProdutoPage extends HTMLElement {
  async connectedCallback() {
    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root');
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.produtoId = urlParams.get('id');

    this.classList.add('ion-page');
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content class="ion-padding">
        <form id="form-produto">
          <ion-list>
            <ion-item>
              <ion-input type="text" name="dsc_produto" id="dsc_produto" label="Descrição do Produto" label-placement="floating" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-input type="number" step="0.01" name="valor_unit" id="valor_unit" label="Valor Unitário (R$)" label-placement="floating" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-input type="url" name="imagem" id="imagem" label="URL da Imagem" label-placement="floating"></ion-input>
              <ion-button slot="end" fill="clear" id="btn-buscar-imagem">
                <ion-icon name="search" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item id="preview-item" style="display:none">
              <ion-thumbnail slot="start">
                <img id="preview-img" alt="Prévia do produto" />
              </ion-thumbnail>
              <ion-label>
                <p>Prévia da imagem</p>
              </ion-label>
              <ion-button slot="end" fill="clear" color="danger" id="btn-remover-imagem">
                <ion-icon name="close" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item>
              <ion-label>Ativo</ion-label>
              <ion-toggle slot="end" name="status" id="status"></ion-toggle>
            </ion-item>
          </ion-list>

          <div class="ion-padding">
            <ion-button expand="block" type="submit" class="ion-margin-top">
              <ion-icon name="checkmark-circle" style="margin-right: 8px;"></ion-icon>
              Salvar Produto
            </ion-button>
            <ion-button expand="block" color="danger" id="btn-cancelar">
              <ion-icon name="close-circle" style="margin-right: 8px;"></ion-icon>
              Cancelar
            </ion-button>
          </div>
        </form>

        <ion-modal id="modal-busca-imagem">
          <ion-header>
            <ion-toolbar>
              <ion-title>Buscar Imagens</ion-title>
              <ion-buttons slot="end">
                <ion-button id="btn-fechar-modal">Fechar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-searchbar id="searchbar-imagem" placeholder="Pesquisar..."></ion-searchbar>
            <div id="resultados-imagem" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"></div>
            <ion-text id="sem-resultados" style="display:none">
              <p class="ion-text-center">Nenhuma imagem encontrada.</p>
            </ion-text>
          </ion-content>
        </ion-modal>
      </ion-content>
    `;

    this.querySelector('#form-produto').addEventListener('submit', (e) => this.handleSubmit(e));
    this.querySelector('#btn-cancelar').addEventListener('click', () => this.navigateBack());
    this.querySelector('#btn-buscar-imagem').addEventListener('click', () => this.abrirBusca());
    this.querySelector('#btn-remover-imagem').addEventListener('click', () => this.removerImagem());
    this.querySelector('#imagem').addEventListener('input', () => this.atualizarPreview());

    if (this.produtoId) {
      await this.loadProdutoData();
    }
  }

  async loadProdutoData() {
    try {
      const produto = await api.getProdutoById(this.produtoId);
      this.querySelector('#dsc_produto').value = produto.dsc_produto;
      this.querySelector('#valor_unit').value = produto.valor_unit;
      this.querySelector('#status').checked = produto.status;

      if (produto.imagem) {
        this.querySelector('#imagem').value = produto.imagem;
        this.atualizarPreview();
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      const alert = document.createElement('ion-alert');
      alert.header = 'Erro';
      alert.message = 'Não foi possível carregar os dados do produto.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
      this.navigateBack();
    }
  }

  abrirBusca() {
    const modal = this.querySelector('#modal-busca-imagem');
    const searchbar = this.querySelector('#searchbar-imagem');
    const dsc = this.querySelector('#dsc_produto').value || '';
    const query = dsc || this.querySelector('#imagem').value || '';

    if (this._buscaHandler) {
      searchbar.removeEventListener('ionInput', this._buscaHandler);
    }

    this._buscaHandler = (e) => {
      if (e.detail.value.length >= 2) {
        this.pesquisar(e.detail.value);
      }
    };
    searchbar.addEventListener('ionInput', this._buscaHandler);

    modal.present();

    if (query) {
      searchbar.value = query;
      this.pesquisar(query);
    }
  }

  async pesquisar(query) {
    const resultados = this.querySelector('#resultados-imagem');
    const semResultados = this.querySelector('#sem-resultados');

    try {
      const data = await api.searchProdutoImage(query);
      resultados.innerHTML = '';
      semResultados.style.display = 'none';

      if (!data.images || data.images.length === 0) {
        semResultados.style.display = '';
        return;
      }

      data.images.forEach((img) => {
        const card = document.createElement('div');
        card.style.cssText = 'cursor:pointer;border-radius:8px;overflow:hidden;border:2px solid transparent';
        const cardImg = document.createElement('img');
        cardImg.src = img.url;
        cardImg.alt = img.alt;
        cardImg.style.cssText = 'width:100%;height:120px;object-fit:cover;display:block';
        card.appendChild(cardImg);
        card.addEventListener('click', () => this.selecionarImagem(img.url));
        resultados.appendChild(card);
      });
    } catch {
      resultados.innerHTML = '';
      semResultados.style.display = '';
    }
  }

  selecionarImagem(url) {
    this.querySelector('#imagem').value = url;
    this.atualizarPreview();
    const modal = this.querySelector('#modal-busca-imagem');
    modal.dismiss();
  }

  atualizarPreview() {
    const url = this.querySelector('#imagem').value;
    const preview = this.querySelector('#preview-item');
    const img = this.querySelector('#preview-img');

    if (url) {
      preview.style.display = '';
      img.src = url;
    } else {
      preview.style.display = 'none';
      img.src = '';
    }
  }

  removerImagem() {
    this.querySelector('#imagem').value = '';
    this.atualizarPreview();
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const valor = parseFloat(formData.get('valor_unit'));
    if (isNaN(valor)) {
      const alert = document.createElement('ion-alert');
      alert.header = 'Erro';
      alert.message = 'Valor unitario invalido.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      alert.present();
      return;
    }

    const produtoData = {
      dsc_produto: formData.get('dsc_produto'),
      valor_unit: valor,
      status: formData.get('status') === 'on',
    };

    const imagem = formData.get('imagem');
    if (imagem) {
      produtoData.imagem = imagem;
    }

    try {
      if (this.produtoId) {
        await api.updateProduto(this.produtoId, produtoData);
      } else {
        await api.addProduto(produtoData);
      }
      this.navigateBack();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      const alert = document.createElement('ion-alert');
      alert.header = 'Erro';
      alert.message = 'Não foi possível salvar o produto. Tente novamente mais tarde.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
    }
  }

  navigateBack() {
    const router = document.querySelector('ion-router');
    router.push('/produtos', 'root');
  }
}

customElements.define('update-produto-page', UpdateProdutoPage);
