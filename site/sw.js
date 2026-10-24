const CACHE_NAME = 'english-practice-v50';
const APP_SHELL = [
  './',
  './index.html',
  './vocabulary_words.md',
  './manifest.webmanifest',
  './icons/app-icon.svg',
  './images/vocabulary/cereal.jpg',
  './images/vocabulary/toast.jpg',
  './images/vocabulary/chicken.jpg',
  './images/vocabulary/sandwich.jpg',
  './images/vocabulary/crisps.jpg',
  './images/vocabulary/ham.jpg',
  './images/vocabulary/pasta.jpg',
  './images/vocabulary/rice.jpg',
  './images/vocabulary/spices.jpg',
  './images/vocabulary/chips.jpg',
  './images/vocabulary/steak.jpg',
  './css/styles.css',
  './css/writing-evaluator.css',
  './data/files.js',
  './data/theory.js',
  './data/reading.js',
  './data/reading-extensions.js',
  './data/writing.js',
  './data/phonetics.js',
  './data/vocabulary-extra.js',
  './data/vocabulary-translation-sets.js',
  './data/video-lessons.js',
  './data/food-dishes.js',
  './js/storage.js',
  './js/router.js',
  './js/exercises.js',
  './js/phonetic-transcription.js',
  './js/translator.js',
  './js/app.js',
  './js/reading-practice.js',
  './js/writing-practice.js',
  './js/learning-lab.js',
  './js/writing-evaluator.js',
  './js/register-service-worker.js',
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
  const isLocalRequest = url.origin === self.location.origin;
  // Stream uploaded lessons without putting large media files in the app cache.
  if (request.destination === 'video') return;
  const isDishPhoto = request.destination === 'image' &&
    ['images.unsplash.com', 'thumb.wikimedia.org'].includes(url.hostname);
  if (request.method !== 'GET' || (!isLocalRequest && !isDishPhoto)) return;

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
        if (response.ok || (isDishPhoto && response.type === 'opaque')) await cacheResponse(request, response);
        return response;
      })
      .catch(async () => (await caches.match(request)) || Response.error())
  );
});
