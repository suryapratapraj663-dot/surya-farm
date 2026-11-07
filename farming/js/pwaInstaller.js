// SURYA FARMING - PWA & WebAPK Installation Engine
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install banner if present
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'flex';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('SURYA FARMING PWA ServiceWorker Registered:', reg.scope);
    }).catch(err => {
      console.log('SURYA FARMING SW registration note:', err);
    });
  });
}

