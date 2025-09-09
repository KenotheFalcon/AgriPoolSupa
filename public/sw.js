// Optimized Service Worker for AgriPool NG
const CACHE_NAME = 'agripool-v1.0.0';
const STATIC_CACHE_NAME = 'agripool-static-v1';
const DYNAMIC_CACHE_NAME = 'agripool-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (!cacheName.includes('agripool')) {
            return caches.delete(cacheName);
          }
        })
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    (async () => {
      try {
        // Network first for API calls
        if (event.request.url.includes('/api/')) {
          const response = await fetch(event.request);
          if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(event.request, response.clone());
          }
          return response;
        }
        
        // Cache first for static assets
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return await fetch(event.request);
      } catch (error) {
        if (event.request.destination === 'document') {
          const cache = await caches.open(STATIC_CACHE_NAME);
          return cache.match('/offline') || new Response('Offline');
        }
        return new Response('Network Error', { status: 503 });
      }
    })()
  );
});
