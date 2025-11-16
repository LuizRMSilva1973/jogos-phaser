const CACHE = 'jogo-premium-v1';
const ASSETS = [
  '/public_html/jogo-premium.php',
  '/public_html/assets/styles.css',
  '/public_html/assets/lib/phaser.min.js',
  '/public_html/assets/src/main.js',
  '/public_html/assets/src/levels.js',
  '/public_html/assets/src/scenes/BootScene.js',
  '/public_html/assets/src/scenes/MenuScene.js',
  '/public_html/assets/src/scenes/GameScene.js',
  '/public_html/assets/src/scenes/SubmitScoreScene.js',
  '/public_html/assets/src/scenes/ScoreboardScene.js'
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
