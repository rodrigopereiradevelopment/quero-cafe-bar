import './style.css'

// Load Ionic
(async () => {
  const ionicPath = '/ionic.esm.js';
  await import(/* @vite-ignore */ ionicPath);
})();

// Core CSS required for Ionic components to work properly
import '@ionic/core/css/core.css';

// Basic CSS for apps built with Ionic
import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

// Optional CSS utils that can be commented out
import '@ionic/core/css/padding.css';
import '@ionic/core/css/float-elements.css';
import '@ionic/core/css/text-alignment.css';
import '@ionic/core/css/text-transformation.css';
import '@ionic/core/css/flex-utils.css';
import '@ionic/core/css/display.css';

// Import Pages
import './pages/login/LoginPage.js';
import './pages/home/HomePage.js';

import './pages/produto/RegProdutoPage.js';
import './pages/produto/ListProdutoPage.js';
import './pages/produto/UpdateProdutoPage.js';

import './pages/usuario/RegUsuarioPage.js';
import './pages/usuario/ListUsuarioPage.js';
import './pages/usuario/UpdateUsuarioPage.js';

import './pages/mesa/RegMesaPage.js';
import './pages/mesa/ListMesaPage.js';
import './pages/mesa/UpdateMesaPage.js';

import './pages/comanda/RegComandaPage.js';
import './pages/comanda/ListComandaPage.js';
import './pages/comanda/UpdateComandaPage.js';

import './pages/profile/ProfilePage.js';
import './pages/settings/SettingsPage.js';
import './pages/menu/MenuPage.js';
import './pages/mapa/MapaPage.js';

// Route Guard Global — protege todas as rotas autenticadas
const PUBLIC_ROUTES = ['/login'];
const router = document.querySelector('ion-router');

// Rotas por perfil: 0=Admin, 1=Atendente, 2=Cliente, 3=Barista, 4=Cozinheiro
const ROUTE_PERMISSIONS = {
  '/usuarios': [0],
  '/produtos': [0, 1],
  '/mesas': [0, 1],
  '/comandas': [0, 1],
  '/home': [0, 1, 3, 4],
  '/menu': [0, 1, 2, 3, 4],
  '/profile': [0, 1, 2, 3, 4],
  '/settings': [0, 1, 2, 3, 4],
};

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function getUserPerfil() {
  const userRaw = localStorage.getItem('user');
  if (!userRaw) return -1;
  try {
    return JSON.parse(userRaw).perfil ?? -1;
  } catch {
    return -1;
  }
}

function getCurrentPath() {
  return window.location.pathname;
}

function canAccessRoute(path, perfil) {
  for (const [route, allowedProfiles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(route) && !allowedProfiles.includes(perfil)) {
      return false;
    }
  }
  return true;
}

if (router) {
  router.addEventListener('ionRouteDidChange', (e) => {
    const path = e.detail?.to || getCurrentPath();
    const isPublic = PUBLIC_ROUTES.some(r => path.startsWith(r));

    if (!isPublic && !isAuthenticated()) {
      router.push('/login', 'root');
    } else if (isPublic && isAuthenticated()) {
      router.push('/home', 'root');
    } else if (!isPublic && isAuthenticated()) {
      const perfil = getUserPerfil();
      if (!canAccessRoute(path, perfil)) {
        router.push('/home', 'root');
      }
    }
  });
}

// Sync de sessao entre abas
window.addEventListener('storage', (e) => {
  if (e.key === 'token' && !e.newValue) {
    const currentPath = getCurrentPath();
    if (!PUBLIC_ROUTES.some(r => currentPath.startsWith(r))) {
      window.location.href = '/login';
    }
  }
});