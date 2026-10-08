const CACHE_NAME = 'english-practice-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/app-icon.svg',
  './css/styles.css',
  './data/files.js',
  './data/theory.js',
  './js/storage.js',
  './js/router.js',
  './js/exercises.js',
  './js/translator.js',
  './js/app.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith('english-practice-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const cacheResponse = (key, response) => caches.open(CACHE_NAME)
    .then(cache => cache.put(key, response.clone()))
    .catch(error => console.error('No se pudo guardar un recurso para uso sin conexión.', error));

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(async response => {
          if (response.ok) await cacheResponse(new URL('./index.html', self.registration.scope), response);
          return response;
        })
        .catch(async () => (await caches.match(new URL('./index.html', self.registration.scope))) || Response.error())
    );
    return;
  }

  event.respondWith(
    fetch(request).then(async response => {
        if (response.ok) await cacheResponse(request, response);
        return response;
      })
      .catch(async () => (await caches.match(request)) || Response.error())
  );
});
