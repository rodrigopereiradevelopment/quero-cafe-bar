import './MenuPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/auth.js'
import { api } from '../../services/api.js'
import { isAuthenticated } from '../../shared/auth.js'
import { showLoading, showAlert } from '../../shared/overlay.js'

const pageName = 'Cardápio'

const categoriasDef = [
  { id: 'todos', nome: 'Todos', icone: 'grid' },
  { id: 'Cafés Quentes', nome: 'Cafés Quentes', icone: 'cafe' },
  { id: 'Cafés Gelados', nome: 'Cafés Gelados', icone: 'snow' },
  { id: 'Frappés', nome: 'Frappés', icone: 'wine' },
  { id: 'Bebidas', nome: 'Bebidas', icone: 'cafe' },
  { id: 'Sucos', nome: 'Sucos', icone: 'nutrition' },
  { id: 'Lanches', nome: 'Lanches', icone: 'pizza' },
  { id: 'Doces', nome: 'Doces', icone: 'ice-cream' },
  { id: 'Pratos', nome: 'Pratos', icone: 'restaurant' },
]

const categoriaEmoji = {
  'Cafés Quentes': '☕',
  'Cafés Gelados': '🧊',
  'Frappés': '🥤',
  'Bebidas': '🍫',
  'Sucos': '🧃',
  'Lanches': '🥪',
  'Doces': '🍰',
  'Pratos': '🍽️',
}

class MenuPage extends HTMLElement {

  async connectedCallback() {
    if (this._initialized) return
    this._initialized = true

    if (!isAuthenticated()) {
      document.querySelector('ion-router').push('/login', 'root')
      return
    }

    this.classList.add('ion-page')

    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content class="menu-content">
        <div class="menu-hero">
          <h1 class="menu-title font-gothic">Cardápio</h1>
          <p class="menu-subtitle">Conheça nossas especialidades</p>
        </div>

        <div class="menu-categorias" id="menu-categorias"></div>

        <div class="menu-secao" id="menu-todos"></div>

        <div class="menu-footer">
          <p>Prices subject to change without notice</p>
          <p>Service charge not included</p>
        </div>
      </ion-content>
    `

    this.querySelector('#logout-btn')?.addEventListener('click', logout)
    await this.fetchAndRender()
  }

  async fetchAndRender() {
    const loading = showLoading('Carregando cardápio...')

    try {
      const { data: produtos } = await api.getProdutos(0, 200)
      this.renderCategorias(produtos)
      this.renderProdutos(produtos)
      this.setupCategoriaFilters(produtos)
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error)
      await showAlert({ header: 'Erro', message: 'Não foi possível carregar o cardápio.' })
    } finally {
      await loading.dismiss()
    }
  }

  renderCategorias(produtos) {
    const container = this.querySelector('#menu-categorias')
    const categoriasEncontradas = [...new Set(produtos.map(p => p.categoria).filter(Boolean))]

    const catsHtml = categoriasDef
      .filter(cat => cat.id === 'todos' || categoriasEncontradas.includes(cat.id))
      .map(cat => `
        <button class="cat-btn ${cat.id === 'todos' ? 'active' : ''}" data-categoria="${cat.id}">
          <ion-icon name="${cat.icone}"></ion-icon>
          <span>${cat.nome}</span>
        </button>
      `).join('')

    container.innerHTML = catsHtml
  }

  renderProdutos(produtos, filtro = 'todos') {
    const container = this.querySelector('#menu-todos')
    const categoriasEncontradas = [...new Set(produtos.map(p => p.categoria).filter(Boolean))]

    const catsParaMostrar = filtro === 'todos'
      ? categoriasEncontradas
      : [filtro]

    container.innerHTML = catsParaMostrar.map(cat => {
      const itens = produtos.filter(p => p.categoria === cat)
      const emoji = categoriaEmoji[cat] || '📋'
      return `
        <div class="menu-categoria">
          <h2 class="categoria-titulo">${emoji} ${cat}</h2>
          <div class="categoria-items">
            ${itens.map(produto => `
              <div class="menu-item-card">
                ${produto.imagem ? `
                  <div class="item-imagem">
                    <img src="${produto.imagem}" alt="${produto.dsc_produto}" loading="lazy" />
                  </div>
                ` : ''}
                <div class="item-info">
                  <h3 class="item-nome">${produto.dsc_produto}</h3>
                </div>
                <div class="item-preco">
                  <span>R$ ${Number(produto.valor_unit).toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `
    }).join('')
  }

  setupCategoriaFilters(produtos) {
    const buttons = this.querySelectorAll('.cat-btn')

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.categoria

        buttons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        this.renderProdutos(produtos, catId)

        const menuTodos = this.querySelector('#menu-todos')
        menuTodos.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }
}

customElements.define('menu-page', MenuPage)
