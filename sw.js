// ============================================================
// DED — Service Worker
// Cache-first strategy for offline support (PWA)
// ============================================================

const CACHE_NAME = 'ded-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/design-system.css',
  './css/home.css',
  './css/gate.css',
  './css/football.css',
  './css/gym.css',
  './js/config.js',
  './js/supabase-client.js',
  './js/sync-engine.js',
  './js/gate-syllabus-data.js',
  './js/store.js',
  './js/components.js',
  './js/home.js',
  './js/gate.js',
  './js/football.js',
  './js/gym.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// External resources to cache
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
];

// ============================================================
// Install — cache all static assets
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Caching static assets');
      // Cache local assets
      await cache.addAll(STATIC_ASSETS);
      // Try to cache external assets (non-blocking)
      for (const url of EXTERNAL_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Failed to cache external:', url);
        }
      }
    })
  );
  // Take control immediately
  self.skipWaiting();
});

// ============================================================
// Activate — clean up old caches
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// ============================================================
// Fetch — cache-first for static, network-first for API
// ============================================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Network-first for football API
  if (url.hostname.includes('football-data.org')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Network-first for Supabase CDN (JS library)
  if (url.hostname.includes('cdn.jsdelivr.net') && url.pathname.includes('supabase')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Cache-first for everything else (static assets, fonts)
  event.respondWith(cacheFirst(event.request));
});

// ============================================================
// Strategies
// ============================================================

// Cache-first: Try cache, fall back to network (and cache the response)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return a basic offline fallback if needed
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Network-first: Try network, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Stale-while-revalidate: Serve cache immediately, update cache in background
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || new Response('Offline', { status: 503 });
}
