import './MapaPage.css';
import { createHeader } from '../../shared/Header.js';
import { api } from '../../services/api.js';
import { showToast, showLoading, showAlert } from '../../shared/overlay.js';
import { audio } from '../../services/audio.js';

const pageName = 'Mapa';

class MapaPage extends HTMLElement {
  connectedCallback() {
    this.classList.add('ion-page');
    this.innerHTML = `
      ${createHeader(pageName)}
      <ion-content>
        <div class="mapa-container">
          <div class="mapa-header">
            <h2>Mapa do Estabelecimento</h2>
            <div class="mapa-legend">
              <span class="legend-item"><span class="legend-dot disponivel"></span> Disponivel</span>
              <span class="legend-item"><span class="legend-dot reservada"></span> Reservada</span>
              <span class="legend-item"><span class="legend-dot ocupada"></span> Ocupada</span>
            </div>
          </div>
          <div class="mapa-svg-container" id="mapa-svg">
            <ion-refresher slot="fixed" id="refresher">
              <ion-refresher-content pulling-icon="chevron-down-circle-outline" refreshing-spinner="crescent">
              </ion-refresher-content>
            </ion-refresher>
          </div>
        </div>
      </ion-content>
    `;

    this.carregarMapa();

    const refresher = this.querySelector('#refresher');
    refresher.addEventListener('ionrefresh', async () => {
      await this.carregarMapa();
      refresher.complete();
    });
  }

  async carregarMapa() {
    const loading = showLoading('Carregando mapa...');
    try {
      const mesas = await api.getMesasMapa();
      this.renderizarMapa(mesas);
    } catch (error) {
      await showAlert({ header: 'Erro', message: 'Nao foi possivel carregar o mapa.' });
    } finally {
      await loading.dismiss();
    }
  }

  renderizarMapa(mesas) {
    const container = this.querySelector('#mapa-svg');

    const bar = mesas.filter(m => m.localizacao === 'bar');
    const salao = mesas.filter(m => m.localizacao === 'salao');
    const externa = mesas.filter(m => m.localizacao === 'externa');

    const svgWidth = 580;
    const svgHeight = 580;

    const mesasHtml = mesas.map(mesa => {
      const isReservada = !!mesa.reservado_por;
      const isOcupada = !mesa.status && !isReservada;
      const cor = isReservada ? '#f59e0b' : isOcupada ? '#ef4444' : '#22c55e';
      const stroke = isReservada ? '#d97706' : isOcupada ? '#dc2626' : '#16a34a';
      const tamanho = mesa.qtd_cadeiras <= 1 ? 36 : mesa.qtd_cadeiras <= 2 ? 44 : 52;

      return `
        <g class="mesa-group" data-id="${mesa.id}" data-reservada="${isReservada}" data-ocupada="${isOcupada}"
           transform="translate(${mesa.posicao_x}, ${mesa.posicao_y})" style="cursor: pointer;">
          <rect x="${-tamanho/2}" y="${-tamanho/2}" width="${tamanho}" height="${tamanho}"
                rx="8" fill="${cor}" stroke="${stroke}" stroke-width="2" class="mesa-rect"/>
          <text x="0" y="2" text-anchor="middle" dominant-baseline="middle"
                fill="white" font-size="13" font-weight="bold">${mesa.numero}</text>
          <text x="0" y="${tamanho/2 + 14}" text-anchor="middle"
                fill="#94a3b8" font-size="10">${mesa.qtd_cadeiras} ${mesa.qtd_cadeiras === 1 ? 'lugar' : 'lugares'}</text>
          ${isReservada ? `<text x="0" y="${-tamanho/2 - 8}" text-anchor="middle" fill="#fbbf24" font-size="9">${mesa.reservado_por}</text>` : ''}
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <ion-refresher slot="fixed" id="refresher">
        <ion-refresher-content pulling-icon="chevron-down-circle-outline" refreshing-spinner="crescent">
        </ion-refresher-content>
      </ion-refresher>
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="mapa-svg">
        <!-- Fundo -->
        <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" rx="12" fill="#0d1117"/>

        <!-- Bar/Balcao -->
        <rect x="20" y="15" width="540" height="90" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
        <text x="290" y="35" text-anchor="middle" fill="#8b949e" font-size="12" font-weight="600">BAR / BALCAO</text>

        <!-- Salao -->
        <rect x="20" y="150" width="540" height="230" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
        <text x="290" y="172" text-anchor="middle" fill="#8b949e" font-size="12" font-weight="600">SALAO</text>

        <!-- Externa -->
        <rect x="20" y="400" width="540" height="170" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1"/>
        <text x="290" y="420" text-anchor="middle" fill="#8b949e" font-size="12" font-weight="600">EXTERNA</text>
        <text x="290" y="558" text-anchor="middle" fill="#4a5568" font-size="10">Rua / Area Externa</text>

        <!-- Mesas -->
        ${mesasHtml}
      </svg>
    `;

    // Eventos de clique
    container.querySelectorAll('.mesa-group').forEach(group => {
      group.addEventListener('click', async () => {
        const id = parseInt(group.dataset.id);
        const isReservada = group.dataset.reservada === 'true';
        const isOcupada = group.dataset.ocupada === 'true';
        const mesa = mesas.find(m => m.id === id);

        if (isOcupada) {
          await showAlert({ header: 'Mesa Ocupada', message: 'Esta mesa ja esta em uso.' });
          return;
        }

        if (isReservada) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const isDono = mesa.reservado_por === user.nome;

          if (isDono || user.perfil === 0) {
            const confirm = await showAlert({
              header: 'Liberar Mesa',
              message: `Deseja liberar a Mesa ${mesa.numero}?`,
              buttons: ['Cancelar', { text: 'Liberar', role: 'confirm' }],
            });
            if (confirm === 'confirm') {
              try {
                await api.liberarMesa(id);
                audio.playLiberate();
                await showToast({ message: `Mesa ${mesa.numero} liberada!`, color: 'success' });
                await this.carregarMapa();
              } catch (error) {
                await showAlert({ header: 'Erro', message: 'Nao foi possivel liberar a mesa.' });
              }
            }
          } else {
            await showAlert({
              header: 'Mesa Reservada',
              message: `Reservada para: ${mesa.reservado_por}`,
            });
          }
          return;
        }

        // Mesa disponivel - reservar
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.nome) {
          await showAlert({
            header: 'Login Necessario',
            message: 'Faca login para reservar uma mesa.',
          });
          return;
        }

        const confirm = await showAlert({
          header: 'Reservar Mesa',
          message: `Deseja reservar a Mesa ${mesa.numero} (${mesa.qtd_cadeiras} lugares)?`,
          buttons: ['Cancelar', { text: 'Reservar', role: 'confirm' }],
        });

        if (confirm === 'confirm') {
          try {
            await api.reservarMesa(id, user.nome);
            audio.playReserve();
            await showToast({ message: `Mesa ${mesa.numero} reservada para ${user.nome}!`, color: 'success' });
            await this.carregarMapa();
          } catch (error) {
            await showAlert({ header: 'Erro', message: 'Nao foi possivel reservar a mesa.' });
          }
        }
      });
    });

    // Re-attach refresher
    const refresher = container.querySelector('#refresher');
    refresher.addEventListener('ionrefresh', async () => {
      await this.carregarMapa();
      refresher.complete();
    });
  }
}

customElements.define('mapa-page', MapaPage);
