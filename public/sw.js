const CACHE_NAME = 'bagma-shell-v2';
const SHELL = ['/', '/about', '/order', '/manifest.webmanifest', '/logo5.png'];
const PRIVATE_PATHS = ['/admin', '/account', '/cart', '/checkout', '/track-order', '/order-confirmation', '/carwash/book'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) return;
  if (PRIVATE_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`))) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/') ));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});