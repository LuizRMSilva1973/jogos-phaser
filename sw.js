const CACHE = 'sky-platforms-v2';
const BASE = self.registration.scope.endsWith('/')
  ? self.registration.scope.slice(0, -1)
  : self.registration.scope;
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/lib/phaser.min.js',
  '/manifest.webmanifest',
  '/src/main.js',
  '/src/scenes/BootScene.js',
  '/src/scenes/MenuScene.js',
  '/src/scenes/GameScene.js'
].map((path) => {
  // Garante que o SW funcione em subdiretórios (ex.: GitHub Pages /jogos-phaser/)
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = `/${path}`;
  return `${BASE}${path}`;
});

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Cache-first para nossos assets; rede como fallback
  if (ASSETS.some((a) => url.href === a || url.pathname === a)) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
