const CACHE_NAME = "inshape-v1";
const PRECACHE_URLS = ["/", "/site.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // The Cache API only supports http(s) — browser extensions can trigger fetch
  // events with schemes like chrome-extension:// that must be left untouched.
  if (!request.url.startsWith("http")) return;

  const isStaticAsset = /\.(?:png|jpg|jpeg|svg|ico|webmanifest|woff2?)$/.test(
    new URL(request.url).pathname,
  );

  if (isStaticAsset) {
    // Cache-first: static assets rarely change and are safe to serve stale.
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for pages: always prefer fresh data, fall back to cache offline.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return res;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
  );
});
