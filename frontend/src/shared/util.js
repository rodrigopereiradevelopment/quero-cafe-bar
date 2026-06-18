import { logout as authLogout } from './auth.js';

export function logout() {
    authLogout();
    window.location.href = '/login';
}
