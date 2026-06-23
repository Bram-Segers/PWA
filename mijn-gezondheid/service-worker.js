// Mijn Gezondheid — service worker
// Slaat de app-bestanden op in de cache zodat de app ook offline werkt (F8).

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

// Bij installatie: alle app-bestanden in de cache zetten.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Bij activatie: oude caches van eerdere versies opruimen.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const oldKeys = keys.filter((key) => key !== CACHE_NAME);
      return Promise.all(oldKeys.map((key) => caches.delete(key)));
    })
  );
});

// Bij elk verzoek: eerst kijken of het bestand al in de cache staat.
// Zo niet, dan alsnog ophalen via internet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
