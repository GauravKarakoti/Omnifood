const CACHE_NAME = "app-cache-v2"; // Versioning to prevent stale cache
const urlsToCache = [
  "/",
  "/index.html",
  "/css/general.css",
  "/css/queries.css",
  "/js/script.js",
  "/img/favicon-192.webp",
  "/img/favicon-512.webp",
  '/img/omnifood-logo.avif',
  '/img/hero-min.webp',
  '/img/cursor.png',
  '/img/customers/customer-1.avif',
  '/img/customers/customer-2.avif',
  '/img/customers/customer-3.avif',
  '/img/customers/customer-4.avif',
  '/img/customers/customer-5.avif',
  '/img/customers/customer-6.avif',
  '/img/meals/meal-1.avif',
  '/img/meals/meal-2.avif',
  '/img/gallery/gallery-1.avif',
  '/img/gallery/gallery-2.avif',
  '/img/gallery/gallery-3.avif',
  '/img/gallery/gallery-4.avif',
  '/img/gallery/gallery-5.avif',
  '/img/gallery/gallery-6.avif',
  '/img/gallery/gallery-7.avif',
  '/img/gallery/gallery-8.avif',
  '/img/gallery/gallery-9.avif',
  '/img/gallery/gallery-10.avif',
  '/img/gallery/gallery-11.avif',
  '/img/gallery/gallery-12.avif',
];

//Install Service Worker and Cache Static Files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ Caching assets");
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Ensure immediate activation
  );
});

//Fetch with Network-First Strategy + Fallback to Cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const protocol = new URL(event.request.url).protocol;
        if (!/^https?:$/.test(protocol)) {
          return networkResponse;  // Skip unsupported schemes
        }
        const cacheResponse = networkResponse.clone();
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheResponse);  // Cache the fresh response
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request)) // Fallback to cache
  );
});

//Activate and Clean Up Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME) // Keep only the current version
          .map((cache) => caches.delete(cache))
      );
    })
  );
  self.clients.claim();  // Take control of uncontrolled clients
});
