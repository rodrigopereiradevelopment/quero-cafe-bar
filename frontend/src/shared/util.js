import { logout as authLogout } from './auth.js';

export function logout() {
    authLogout();
    const useHash = document.querySelector('ion-router')?.useHash ?? true;
    window.location.href = useHash ? '#/login' : '/login';
}
