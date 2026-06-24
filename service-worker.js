// Service Worker — simpele versie
// Zorgt dat de app offline werkt

const CACHE_NAME = 'mijn-gezondheid-v1';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/i18n.js',
  './js/app.js',
  './i18n/nl.json',
  './i18n/en.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// --------------------------------------------------
// Install: bestanden opslaan in cache
// --------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// --------------------------------------------------
// Activate: oude caches verwijderen
// --------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      keys.forEach(key => {
        if (key !== CACHE_NAME) {
          caches.delete(key);
        }
      });
    })
  );
});

// --------------------------------------------------
// Fetch: eerst cache, anders internet
// --------------------------------------------------
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // gevonden in cache
      }
      return fetch(event.request); // anders internet
    })
  );
});