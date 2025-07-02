import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { warmStrategyCache } from 'workbox-recipes';

// This is a placeholder for the precache manifest that will be injected by Workbox.
// It will include the offline page.
precacheAndRoute([{ url: '/offline', revision: null }, ...(self.__WB_MANIFEST || [])]);

// Warm up the offline page cache
const strategy = new StaleWhileRevalidate();
const urls = ['/offline'];
warmStrategyCache({ urls, strategy });

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images with a cache-first strategy.
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Handle navigations with a fallback to the offline page.
const handler = createHandlerBoundToURL('/offline');
const navigationRoute = new NavigationRoute(handler, {
  // You can add allowlists or denylists here.
  // For example, denylist: [new RegExp('/admin/')]
});
registerRoute(navigationRoute);

// Pre-cache the offline page so it's available.
self.addEventListener('install', (event) => {
  const files = ['/offline'];
  event.waitUntil(caches.open('workbox-offline-fallbacks').then((cache) => cache.addAll(files)));
});
