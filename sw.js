const CACHE_NAME = 'intoinfinity-v1';

// Assets to pre-cache on install
const PRECACHE = [
  './',
  './index.html',
  './INTO_INFINITY_LOGO.png'
];

// Build full asset lists for EAR and EYE (0..156)
const TOTAL = 157;
const EAR_ASSETS = [];
const EYE_ASSETS = [];
for (let i = 0; i < TOTAL; i++) {
  EAR_ASSETS.push('./EAR/' + i + '.wav');
  EYE_ASSETS.push('./EYE/' + i + '.png');
}

// Install: pre-cache core files only (media cached on demand)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for EAR/EYE assets, network-first for others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  // EAR and EYE assets: cache-first strategy
  if (path.includes('/EAR/') || path.includes('/EYE/') || path.endsWith('INTO_INFINITY_LOGO.png')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Other requests: network-first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
