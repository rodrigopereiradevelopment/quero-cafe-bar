/**
 * Cria e injeta o menu lateral na aplicação.
 * A função garante que o menu seja criado apenas uma vez.
 */
const createAndInjectMenu = () => {
    // 1. Evita a criação de múltiplos menus
    if (document.querySelector('ion-menu')) {
        return;
    }

    // 2. O <ion-menu> precisa de um `contentId` que aponte para a área de conteúdo principal.
    //    Vamos encontrar o elemento de saída do roteador (ion-nav) e garantir que ele tenha um ID.
    const mainContent = document.querySelector('ion-nav'); // O outlet do ion-router em projetos vanilla.
    const contentId = 'main-content';

    if (!mainContent) {
        console.error('[Header.js] Elemento <ion-nav> não encontrado. O menu lateral não pode ser inicializado.');
        return; // Aborta a criação do menu se o conteúdo principal não for encontrado.
    }

    if (!mainContent.id) {
        mainContent.id = contentId;
    }

    // 3. Cria o elemento <ion-menu>
    const menu = document.createElement('ion-menu');
    menu.contentId = mainContent.id; // Garante que o ID do conteúdo seja o mesmo que o menu espera.
    menu.innerHTML = `
        <ion-header>
            <ion-toolbar>
                <ion-title style="font-family: 'UnifrakturMaguntia', cursive; font-weight: 400; color: #e2b714; font-size: 1.4rem; letter-spacing: 0.02em;">
                    ☕ Quero Café
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list lines="none" style="padding: 8px;">
                <ion-item button class="menu-item" data-url="/home" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="home-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Home</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/produtos" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="fast-food-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Produtos</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/usuarios" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="people-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Usuários</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/mesas" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="grid-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Mesas</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/comandas" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="receipt-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Comandas</ion-label>
                </ion-item>
                <ion-item style="margin: 16px 8px 4px; --min-height: 1px; --inner-padding-end: 0;">
                    <div style="width: 100%; height: 1px; background: #21262d;"></div>
                </ion-item>
                <ion-item button class="menu-item" data-url="/profile" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="person-circle-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Meu Perfil</ion-label>
                </ion-item>
                <ion-item button class="menu-item" data-url="/settings" style="--min-height: 48px; border-radius: 8px; margin-bottom: 4px;">
                    <ion-icon name="settings-outline" slot="start" style="color: #8b949e; margin-right: 12px;"></ion-icon>
                    <ion-label style="font-weight: 500;">Configuracoes</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `;

    // 4. Adiciona os eventos de clique para a navegação
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async () => {
            const url = item.dataset.url;
            const router = document.querySelector('ion-router');
            if (router && window.location.hash.substring(1) !== url) {
                router.push(url, 'root');
            }
            await menu.close(); // Fecha o menu após a navegação
        });
    });

    // 5. Adiciona o menu ao DOM, no início do <body>
    document.body.prepend(menu);
};

export function createHeader(pageName) {
    if (pageName !== 'Login') {
        createAndInjectMenu();
    }

    const startSlotContent = pageName !== 'Login' ? `<ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>` : `<ion-icon name="cafe" slot="start" style="margin-left: 15px; font-size: 24px; color: #e2b714;"></ion-icon>`;
    const logoutBtn = pageName !== 'Login' ? `<ion-buttons slot="end"><ion-button id="logout-btn" style="--color: #8b949e;"><ion-icon slot="icon-only" name="log-out-outline"></ion-icon></ion-button></ion-buttons>` : ``;

    return `<ion-header>
                <ion-toolbar>
                    ${startSlotContent}
                    <ion-title>Quero Café Bar - ${pageName}</ion-title>
                    ${logoutBtn}
                </ion-toolbar>
            </ion-header>`;
};