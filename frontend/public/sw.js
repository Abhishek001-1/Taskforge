const cacheName = "careeros-v1";
self.addEventListener("install", (e) => e.waitUntil(caches.open(cacheName).then((c) => c.addAll(["/", "/index.html", "/manifest.webmanifest", "/favicon.svg"]))));
self.addEventListener("fetch", (e) => e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then((r) => r || caches.match("/")))));
