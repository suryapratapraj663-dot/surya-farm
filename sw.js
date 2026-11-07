// Service Worker for Surya Farming PWA / WebAPK
const CACHE_NAME = 'surya-farming-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './farmer.html',
  './buyer.html',
  './css/styles.css',
  './js/demoData.js',
  './js/notifications.js',
  './js/iotNodes.js',
  './js/aiScanner.js',
  './js/marketplace.js',
  './js/telegramBot.js',
  './js/iotAiArchitect.js',
  './js/app.js',
  './manifest_farmer.json',
  './manifest_buyer.json',
  './manifest.json',
  './icons/farmer-192.png',
  './icons/farmer-512.png',
  './icons/buyer-192.png',
  './icons/buyer-512.png',
  './icons/portal-192.png',
  './icons/portal-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});

