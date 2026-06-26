import { audio } from '../services/audio.js';

export function showToast({ message, color = 'success', duration = 2000, position = 'bottom' }) {
  if (color === 'success') audio.playSuccess();
  else if (color === 'danger') audio.playError();

  const toast = document.createElement('ion-toast');
  toast.message = message;
  toast.color = color;
  toast.duration = duration;
  toast.position = position;
  document.body.appendChild(toast);
  toast.addEventListener('ionToastDidDismiss', () => toast.remove());
  toast.present();
}

export function showAlert({ header, message, buttons = ['OK'] }) {
  return new Promise((resolve) => {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = buttons;
    document.body.appendChild(alert);
    alert.addEventListener('ionAlertDidDismiss', (e) => {
      alert.remove();
      resolve(e.detail?.data?.values?.[0] || e.detail?.role || undefined);
    });
    alert.present();
  });
}

export function showLoading(message = 'Aguarde...') {
  const loading = document.createElement('ion-loading');
  loading.message = message;
  document.body.appendChild(loading);
  loading.present();
  return {
    dismiss: async () => { await loading.dismiss(); loading.remove(); },
  };
}
