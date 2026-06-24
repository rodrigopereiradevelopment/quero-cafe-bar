import { logout as authLogout } from './auth.js';

export function logout() {
    authLogout();
    window.location.href = '/login';
}

export function createListSkeleton(count = 5) {
    return Array(count).fill('').map(() => `
        <ion-item lines="none" style="--min-height: 72px;">
            <ion-avatar slot="start" style="--border-radius: 8px; width: 48px; height: 48px;">
                <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
            </ion-avatar>
            <ion-label>
                <div style="height: 14px; width: 70%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                <div style="height: 12px; width: 50%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
            </ion-label>
        </ion-item>
    `).join('');
}

export function createCardSkeleton(count = 3) {
    return `<div class="comandas-grid">${Array(count).fill('').map(() => `
        <ion-card style="border: 1px solid #30363d; border-radius: 12px;">
            <ion-card-header>
                <div style="height: 18px; width: 60%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
            </ion-card-header>
            <ion-card-content>
                <div style="height: 14px; width: 80%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                <div style="height: 14px; width: 60%; background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
            </ion-card-content>
        </ion-card>
    `).join('')}</div>`;
}

export function getLoggedUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.id || null;
    } catch {
        return null;
    }
}

export function getLoggedUserProfile() {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}
