const CACHE = 'jogo-premium-v2';
const ASSETS = [
  '/jogo-premium.php',
  '/assets/styles.css',
  '/assets/lib/phaser.min.js',
  '/assets/src/main.js',
  '/assets/src/levels.js',
  '/assets/src/scenes/BootScene.js',
  '/assets/src/scenes/MenuScene.js',
  '/assets/src/scenes/GameScene.js',
  '/assets/src/scenes/SubmitScoreScene.js',
  '/assets/src/scenes/ScoreboardScene.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      const url = new URL(req.url);
      if (url.origin === location.origin && (req.method === 'GET')) {
        const copy = resp.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
      }
      return resp;
    }).catch(() => cached))
  );
});
