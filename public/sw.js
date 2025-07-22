
// This is a basic service worker file for PWA functionality.
// It enables the app to be "installable".

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // You can add logic here to pre-cache assets if needed.
  // For now, we'll keep it simple.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // This is a good place to clean up old caches.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We are not implementing any caching strategy here,
  // so we'll just let the network handle all requests.
  // This is the simplest "online-first" strategy.
  event.respondWith(fetch(event.request));
});
