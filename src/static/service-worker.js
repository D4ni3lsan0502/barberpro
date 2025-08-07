const CACHE_NAME = 'barberpro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/src/js/main.js',
  '/src/js/api.js',
  '/src/js/cliente-storage.js',
  '/src/js/agendamento-storage.js',
  '/login.html',
  '/login-cliente.html',
  '/cadastro-cliente.html',
  '/barbeiro-dashboard.html',
  '/agendamentos.html',
  '/cliente-dashboard.html',
  '/agendamento-cliente.html',
  '/agendamentos-barbeiro.html',
  '/barbeiro-servicos.html',
  '/static/images/icons/icon-192x192.png',
  '/static/images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

