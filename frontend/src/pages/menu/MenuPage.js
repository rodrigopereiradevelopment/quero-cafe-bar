import './MenuPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/auth.js'
import { api } from '../../services/api.js'
import { isAuthenticated } from '../../shared/auth.js'
import { showLoading, showAlert } from '../../shared/overlay.js'

const pageName = 'Cardápio'

const categorias = [
  { id: 'cafes-quentes', nome: '☕ Cafés Quentes', icone: 'cafe' },
  { id: 'cafes-gelados', nome: '🧊 Cafés Gelados', icone: 'snow' },
  { id: 'frappes', nome: '🥤 Frappés', icone: 'wine' },
  { id: 'nao-cafe', nome: '🍫 Bebidas Não-CAFÉ', icone: 'cafe' },
  { id: 'sucos', nome: '🧃 Sucos e Smoothies', icone: 'nutrition' },
  { id: 'lanches', nome: '🥪 Lanches e Salgados', icone: 'pizza' },
  { id: 'doces', nome: '🍰 Doces', icone: 'ice-cream' },
  { id: 'pratos', nome: '🍽️ Pratos Principais', icone: 'restaurant' },
]

const produtosPorCategoria = {
  'cafes-quentes': [
    { nome: 'Expresso Simples', descricao: 'Café puro e encorpado', preco: 6 },
    { nome: 'Expresso Duplo', descricao: 'Duas doses de café', preco: 9 },
    { nome: 'Cappuccino', descricao: 'Espresso com espuma de leite', preco: 12 },
    { nome: 'Café com Leite', descricao: 'Café coado com leite quente', preco: 8 },
    { nome: 'Latte', descricao: 'Espresso com muito leite vaporizado', preco: 13 },
    { nome: 'Mocha', descricao: 'Espresso, chocolate e leite', preco: 15 },
    { nome: 'Macchiato', descricao: 'Espresso manchado com espuma', preco: 11 },
    { nome: 'Café Especial 3WU', descricao: 'Nosso blend exclusivo', preco: 14 },
    { nome: 'Einspanner', descricao: 'Espresso com chantilly vienense', preco: 16 },
    { nome: 'Salted Caramel Latte', descricao: 'Caramelo salgado com leite', preco: 16 },
    { nome: 'Café Canela', descricao: 'Café com canela e especiarias', preco: 10 },
  ],
  'cafes-gelados': [
    { nome: 'Cold Brew', descricao: 'Extraído a frio por 12h', preco: 14 },
    { nome: 'Cold Brew com Leite', descricao: 'Cold brew com leite gelado', preco: 16 },
    { nome: 'Espresso Gelado', descricao: 'Espresso sobre gelo', preco: 10 },
    { nome: 'Iced Latte', descricao: 'Latte gelado com gelo', preco: 15 },
  ],
  'frappes': [
    { nome: 'Frappé de Café', descricao: 'Café gelado batido com leite', preco: 16 },
    { nome: 'Frappé de Caramelo', descricao: 'Caramelo, café e chantilly', preco: 18 },
    { nome: 'Frappé de Chocolate', descricao: 'Chocolate, café e chantilly', preco: 18 },
    { nome: 'Frappé de Matcha', descricao: 'Matcha com leite gelado', preco: 19 },
    { nome: 'Frappé Cookies & Cream', descricao: 'Bolacha oreo com chantilly', preco: 20 },
  ],
  'nao-cafe': [
    { nome: 'Chocolate Quente', descricao: 'Chocolate cremoso e quente', preco: 12 },
    { nome: 'Matcha Latte', descricao: 'Chá verde com leite', preco: 15 },
    { nome: 'Chá Latte', descricao: 'Chá preto com leite e especiarias', preco: 13 },
    { nome: 'Latte de Baunilha', descricao: 'Leite com essência de baunilha', preco: 14 },
    { nome: 'Hot White Chocolate', descricao: 'Chocolate branco quente', preco: 15 },
  ],
  'sucos': [
    { nome: 'Suco de Laranja Natural', descricao: 'Laranja espremta na hora', preco: 10 },
    { nome: 'Suco de Limão', descricao: 'Limão com açúcar e gelo', preco: 9 },
    { nome: 'Suco de Maracujá', descricao: 'Maracujá fresco', preco: 11 },
    { nome: 'Suco Detox Verde', descricao: 'Couve, gengibre, limão e maçã', preco: 14 },
    { nome: 'Smoothie de Morango', descricao: 'Morango batido com leite e banana', preco: 16 },
    { nome: 'Açaí na Tigela', descricao: 'Açaí com banana, granola e mel', preco: 22 },
  ],
  'lanches': [
    { nome: 'Pão de Queijo', descricao: 'Pão de queijo mineiro crocante', preco: 6 },
    { nome: 'Coxinha de Frango', descricao: 'Coxinha cremosa de frango', preco: 8 },
    { nome: 'Pastel de Carne', descricao: 'Pastel crocante recheado', preco: 9 },
    { nome: 'Pastel de Queijo', descricao: 'Pastel com queijo derretido', preco: 9 },
    { nome: 'Esfiha de Carne', descricao: 'Esfiha assada com carne moída', preco: 7 },
    { nome: 'Quiche de Frango', descricao: 'Quiche cremosa com frango', preco: 12 },
    { nome: 'Sanduíche Natural', descricao: 'Frango, alface, tomate e maionese', preco: 14 },
    { nome: 'Misto Quente', descricao: 'Presunto e queijo na chapa', preco: 12 },
    { nome: 'Croissant c/ Presunto e Queijo', descricao: 'Croissant amanteigado recheado', preco: 15 },
    { nome: 'Wrap de Frango', descricao: 'Tortilha com frango e molho especial', preco: 18 },
    { nome: 'Pão na Chapa', descricao: 'Pão francês na manteiga', preco: 7 },
    { nome: 'Tapioca c/ Queijo', descricao: 'Tapioca com queijo derretido', preco: 10 },
  ],
  'doces': [
    { nome: 'Bolo de Cenoura c/ Cobertura', descricao: 'Bolo fofinho com cobertura de chocolate', preco: 10 },
    { nome: 'Bolo de Chocolate', descricao: 'Bolo cremoso de chocolate', preco: 11 },
    { nome: 'Brownie', descricao: 'Brownie denso com gotas de chocolate', preco: 12 },
    { nome: 'Cookie c/ Gotas de Chocolate', descricao: 'Cookie crocante por fora, macio por dentro', preco: 8 },
    { nome: 'Croissant Doce c/ Nutella', descricao: 'Croissant com Nutella derretida', preco: 16 },
    { nome: 'Torta de Limão', descricao: 'Torta cremosa com merengue', preco: 14 },
    { nome: 'Petit Gateau', descricao: 'Bolinho de chocolate com sorvete', preco: 22 },
    { nome: 'Churros c/ Doce de Leite', descricao: 'Churros crocantes com doce de leite', preco: 14 },
  ],
  'pratos': [
    { nome: 'Arroz c/ Feijão e Frango Grelhado', descricao: 'Prato feito completo', preco: 28 },
    { nome: 'Macarrão à Carbonara', descricao: 'Espaguete com bacon e parmesão', preco: 32 },
    { nome: 'Risoto de Cogumelos', descricao: 'Risoto cremoso com mix de cogumelos', preco: 35 },
    { nome: 'Salada Caesar c/ Frango', descricao: 'Alface, croutons, parmesão e frango', preco: 26 },
    { nome: 'Fish & Chips', descricao: 'Peixe empanado com batata frita', preco: 34 },
  ],
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

        <div class="menu-categorias">
          ${categorias.map(cat => `
            <button class="cat-btn" data-categoria="${cat.id}">
              <ion-icon name="${cat.icone}"></ion-icon>
              <span>${cat.nome.replace(/^[^\s]+\s/, '')}</span>
            </button>
          `).join('')}
        </div>

        <div class="menu-secao" id="menu-todos">
          ${categorias.map(cat => `
            <div class="menu-categoria" id="cat-${cat.id}">
              <h2 class="categoria-titulo">${cat.nome}</h2>
              <div class="categoria-items">
                ${produtosPorCategoria[cat.id].map(produto => `
                  <div class="menu-item-card">
                    <div class="item-info">
                      <h3 class="item-nome">${produto.nome}</h3>
                      <p class="item-descricao">${produto.descricao}</p>
                    </div>
                    <div class="item-preco">
                      <span>R$ ${produto.preco.toFixed(2)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="menu-footer">
          <p>Prices subject to change without notice</p>
          <p>Service charge not included</p>
        </div>
      </ion-content>
    `

    this.querySelector('#logout-btn')?.addEventListener('click', logout)
    this.setupCategoriaFilters()
  }

  setupCategoriaFilters() {
    const buttons = this.querySelectorAll('.cat-btn')
    const sections = this.querySelectorAll('.menu-categoria')

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.categoria

        buttons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        if (catId === 'todos') {
          sections.forEach(s => s.style.display = 'block')
        } else {
          sections.forEach(s => s.style.display = 'none')
          const target = this.querySelector(`#cat-${catId}`)
          if (target) target.style.display = 'block'
        }

        const menuTodos = this.querySelector('#menu-todos')
        menuTodos.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }
}

customElements.define('menu-page', MenuPage)
