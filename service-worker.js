// BarberPro Service Worker
const CACHE_NAME = 'barberpro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/cadastro-barbeiro.html',
  '/cadastro-cliente.html',
  '/barbeiro-dashboard.html',
  '/barbeiro-dashboard-v2.html',
  '/cliente-dashboard.html',
  '/agendamento.html',
  '/confirmacao-agendamento.html',
  '/favoritos.html',
  '/barbeiro-perfil.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/main.js',
  '/js/estrutura-dados.js',
  '/js/estrutura-dados-v2.js',
  '/js/estrutura-dados-v3.js',
  '/js/calculo-tempo.js',
  '/js/upload-comprovante.js',
  '/js/fluxo-agendamento.js',
  '/js/gps-rotas.js',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-144x144.png',
  '/img/icons/icon-152x152.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-384x384.png',
  '/img/icons/icon-512x512.png',
  '/offline.html' // Certifique-se de ter esta página para fallback offline
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Excluir caches antigos
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de cache: Cache First, fallback para network e offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        // Clone da requisição
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then(networkResponse => {
            // Verificar se a resposta é válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Clone da resposta
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(() => {
            // Fallback offline para navegação
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Para outros recursos, retornar erro simples
            return new Response('Sem conexão com a internet', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-agendamentos') {
    event.waitUntil(syncAgendamentos());
  }
});

// Função para sincronizar agendamentos pendentes
function syncAgendamentos() {
  // Aqui seria implementada a lógica para sincronizar dados
  // armazenados localmente com o servidor quando a conexão for restabelecida
  console.log('Sincronizando agendamentos pendentes');
  return Promise.resolve();
}

// Notificações push
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Nova notificação', body: '', url: '/' };
  }
  const options = {
    body: data.body,
    icon: '/img/icons/icon-192x192.png',
    badge: '/img/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ação ao clicar na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
