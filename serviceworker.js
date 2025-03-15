const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/css/style.css",
    "/css/general.css",
    "/css/queries.css",
    "/js/script.js",
    "/img/favicon-192.webp",
    "/img/favicon-512.webp"
];

//Install Service Worker and Cache Static Files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
        console.log("Caching assets");
        return cache.addAll(urlsToCache);
        })
    );
});

//Fetch and Serve Cached Files
    self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
        })
    );
});

//Activate and Clean Up Old Caches
    self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames
            .filter((cache) => cache !== CACHE_NAME) 
            .map((cache) => caches.delete(cache))
        );
        })
    );
});
